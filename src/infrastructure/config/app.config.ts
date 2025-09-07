import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  // Validate required environment variables
  const requiredEnvVars = ['PORT', 'NODE_ENV', 'API_PREFIX'];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  return {
    port: parseInt(process.env.PORT, 10),
    nodeEnv: process.env.NODE_ENV,
    apiPrefix: process.env.API_PREFIX,
    corsOrigin: process.env.CORS_ORIGIN,
    swagger: {
      title: process.env.SWAGGER_TITLE,
      description: process.env.SWAGGER_DESCRIPTION,
      version: process.env.SWAGGER_VERSION,
      path: process.env.SWAGGER_PATH,
    },
    throttle: {
      ttl: parseInt(process.env.THROTTLE_TTL, 10),
      limit: parseInt(process.env.THROTTLE_LIMIT, 10),
    },
  };
});

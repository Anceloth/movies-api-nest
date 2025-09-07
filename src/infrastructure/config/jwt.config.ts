import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  // Validate required environment variables
  const requiredEnvVars = ['JWT_SECRET', 'JWT_EXPIRES_IN'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  };
});

# API de Películas - Sistema de Cines

## Descripción
Este documento describe la API REST para el manejo de películas en el sistema de cines. La API está construida con NestJS, TypeORM y PostgreSQL, siguiendo los principios de Clean Architecture.

## Endpoints Disponibles

### 1. Crear Película
**POST** `/movies`

Crea una nueva película en el sistema.

**Body:**
```json
{
  "title": "El Padrino",
  "genre": "Drama",
  "director": "Francis Ford Coppola",
  "releaseDate": "1972-03-24"
}
```

**Respuesta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "El Padrino",
  "genre": "Drama",
  "director": "Francis Ford Coppola",
  "releaseDate": "1972-03-24",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### 2. Obtener Todas las Películas
**GET** `/movies`

Obtiene una lista paginada de películas.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Tamaño de página (default: 10)
- `activeOnly` (opcional): Solo películas activas (default: true)

**Ejemplo:** `GET /movies?page=1&limit=5`

**Respuesta:**
```json
{
  "movies": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "El Padrino",
      "description": "La historia de una familia de la mafia italiana en Nueva York",
      "duration": 175,
      "genre": "Drama",
      "director": "Francis Ford Coppola",
      "releaseDate": "1972-03-24",
      "rating": 9.2,
      "posterUrl": "https://example.com/poster.jpg",
      "trailerUrl": "https://youtube.com/watch?v=example",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 3. Obtener Película por ID
**GET** `/movies/:id`

Obtiene una película específica por su ID.

**Respuesta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "El Padrino",
  "genre": "Drama",
  "director": "Francis Ford Coppola",
  "releaseDate": "1972-03-24",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### 4. Actualizar Película
**PATCH** `/movies/:id`

Actualiza una película existente. Todos los campos son opcionales.

**Body:**
```json
{
  "title": "El Padrino - Edición Especial",
  "genre": "Drama"
}
```

**Respuesta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "El Padrino - Edición Especial",
  "description": "La historia de una familia de la mafia italiana en Nueva York",
  "duration": 175,
  "genre": "Drama",
  "director": "Francis Ford Coppola",
  "releaseDate": "1972-03-24",
  "rating": 9.5,
  "posterUrl": "https://example.com/poster.jpg",
  "trailerUrl": "https://youtube.com/watch?v=example",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z"
}
```

### 5. Eliminar Película
**DELETE** `/movies/:id`

Elimina una película del sistema.

**Respuesta:** 204 No Content

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `204 No Content`: Recurso eliminado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `404 Not Found`: Película no encontrada
- `409 Conflict`: Ya existe una película con este título

## Validaciones

### Campos Requeridos para Crear:
- `title`: Título de la película (1-255 caracteres)
- `genre`: Género (1-100 caracteres)
- `director`: Director (1-255 caracteres)
- `releaseDate`: Fecha de estreno (formato YYYY-MM-DD)

## Estructura de la Base de Datos

La tabla `movies` tiene la siguiente estructura:

```sql
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  genre VARCHAR NOT NULL,
  director VARCHAR NOT NULL,
  releaseDate DATE NOT NULL,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Arquitectura

El módulo de películas sigue los principios de Clean Architecture:

- **Domain**: Entidades y interfaces de repositorio
- **Application**: Casos de uso y DTOs
- **Infrastructure**: Implementación de repositorios y modelos de TypeORM
- **Presentation**: Controladores y endpoints REST

## Ejecutar la Aplicación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno en `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=movies_db
```

3. Ejecutar migraciones:
```bash
npm run migration:run
```

4. Iniciar la aplicación:
```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/api`.

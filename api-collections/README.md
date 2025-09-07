# API Collections - Movies API

This directory contains collections to test the movies API of the cinema system.

## 📁 Available Files

- `Movies-API-Postman.json` - Postman collection
- `Movies-API-Insomnia.json` - Insomnia collection
- `README.md` - This documentation file

## 🚀 How to Use

### Postman

1. Open Postman
2. Click "Import"
3. Select the `Movies-API-Postman.json` file
4. The collection will be imported with all configured requests

### Insomnia

1. Open Insomnia
2. Go to "Application" → "Preferences" → "Data" → "Import Data"
3. Select the `Movies-API-Insomnia.json` file
4. The collection will be imported with all configured requests

## 🔧 Environment Variables

The collections include the following variables:

- `baseUrl`: `http://localhost:3000/api/v1`
- `movieId`: Example movie ID (updates automatically)

## 📋 Included Endpoints

### 1. Create Movie (POST)
- **URL**: `/movies`
- **Body**: JSON with title, genre, director and release date
- **Example**: Create "The Godfather"

### 2. Get All Movies (GET)
- **URL**: `/movies`
- **Optional parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Page size (default: 10)
  - `activeOnly`: Only active movies (default: true)

### 3. Get Movie by ID (GET)
- **URL**: `/movies/:id`
- **Parameters**: Movie ID

### 4. Update Movie (PATCH)
- **URL**: `/movies/:id`
- **Body**: JSON with fields to update
- **Example**: Update title to "The Godfather - Special Edition"

### 5. Delete Movie (DELETE)
- **URL**: `/movies/:id`
- **Parameters**: Movie ID

## 🎬 Movie Examples

The collection includes examples for creating popular movies:

- **Pulp Fiction** (1994) - Quentin Tarantino
- **The Lord of the Rings** (2001) - Peter Jackson
- **Inception** (2010) - Christopher Nolan

## 📊 Response Codes

- `200 OK`: Successful operation
- `201 Created`: Movie created successfully
- `204 No Content`: Movie deleted successfully
- `404 Not Found`: Movie not found
- `409 Conflict`: A movie with this title already exists
- `400 Bad Request`: Invalid input data

## 🔍 Validations

### Required Fields for Creation:
- `title`: Movie title (1-255 characters)
- `genre`: Genre (1-100 characters)
- `director`: Director (1-255 characters)
- `releaseDate`: Release date (YYYY-MM-DD format)

### Special Validations:
- **Unique titles**: Duplicate titles are not allowed
- **Valid dates**: ISO 8601 format (YYYY-MM-DD)
- **Optional fields**: All fields in update are optional

## 🛠️ Server Configuration

Before using the collections, make sure:

1. The application is running:
   ```bash
   npm run start:dev
   ```

2. The database is configured and migrations are executed:
   ```bash
   npm run migration:run
   ```

3. The server is available at `http://localhost:3000`

## 📚 Additional Documentation

- **Swagger UI**: http://localhost:3000/api/docs
- **Complete documentation**: See `MOVIES_API.md` in the project root

## 🎯 Recommended Testing Flow

1. **Create movies**: Use the provided examples
2. **List movies**: Verify they appear in the listing
3. **Get by ID**: Test with different IDs
4. **Update**: Modify titles, genres, etc.
5. **Pagination**: Test with different pages and limits
6. **Validations**: Try creating duplicate titles
7. **Delete**: Delete movies and verify they don't appear

## 🔄 Variable Updates

To use real movie IDs:

1. Create a movie using the "1. Create Movie" request
2. Copy the ID from the response
3. Update the `movieId` variable in the environment
4. Use the requests that depend on the ID (get, update, delete)

Enjoy testing the API! 🎬
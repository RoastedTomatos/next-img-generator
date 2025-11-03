# API Documentation

## Overview

The API consists of RESTful endpoints built using Next.js API routes. All endpoints return JSON responses and follow standard HTTP status codes.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: Your deployed domain

## Authentication

Currently, the API does not require authentication. This will be added in future updates.

## Endpoints

### Generate Image

Creates a new AI-generated image based on a text prompt.

**Endpoint**: `POST /api/generate`

**Request Body**:
```typescript
{
  prompt: string;        // Required: Text description for image generation
  width?: number;        // Optional: Image width in pixels (default: 1024)
  height?: number;       // Optional: Image height in pixels (default: 1024)
}
```

**Example Request**:
```json
{
  "prompt": "A beautiful sunset over mountains",
  "width": 1024,
  "height": 1024
}
```

**Success Response** (`200 OK`):
```typescript
{
  success: true;
  image: {
    id: string;
    prompt: string;
    image_url: string;
    width: number;
    height: number;
    user_id: string | null;
    created_at: string;
  };
}
```

**Example Response**:
```json
{
  "success": true,
  "image": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "prompt": "A beautiful sunset over mountains",
    "image_url": "https://example.com/image.jpg",
    "width": 1024,
    "height": 1024,
    "user_id": null,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses**:

`400 Bad Request` - Invalid input:
```json
{
  "success": false,
  "error": "Prompt is required"
}
```

`500 Internal Server Error` - Server error:
```json
{
  "success": false,
  "error": "Failed to save image"
}
```

---

### Get Images

Retrieves a list of generated images with pagination support.

**Endpoint**: `GET /api/images`

**Query Parameters**:
- `limit` (optional): Number of images to return (default: 20)
- `offset` (optional): Number of images to skip (default: 0)

**Example Request**:
```
GET /api/images?limit=10&offset=0
```

**Success Response** (`200 OK`):
```typescript
{
  images: Array<{
    id: string;
    prompt: string;
    image_url: string;
    width: number;
    height: number;
    user_id: string | null;
    created_at: string;
  }>;
}
```

**Example Response**:
```json
{
  "images": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "prompt": "A beautiful sunset over mountains",
      "image_url": "https://example.com/image.jpg",
      "width": 1024,
      "height": 1024,
      "user_id": null,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Response** (`500 Internal Server Error`):
```json
{
  "error": "Failed to fetch images"
}
```

---

## Data Models

### GeneratedImage

```typescript
interface GeneratedImage {
  id: string;              // UUID
  prompt: string;          // Text prompt used for generation
  image_url: string;       // URL to the generated image
  width: number;           // Image width in pixels
  height: number;          // Image height in pixels
  user_id: string | null;  // User ID (null if no auth)
  created_at: string;      // ISO 8601 timestamp
}
```

### GenerateImageRequest

```typescript
interface GenerateImageRequest {
  prompt: string;   // Required: Text description
  width?: number;   // Optional: Default 1024
  height?: number;  // Optional: Default 1024
}
```

### GenerateImageResponse

```typescript
interface GenerateImageResponse {
  success: boolean;
  image?: GeneratedImage;
  error?: string;
}
```

---

## Error Handling

All endpoints use standard HTTP status codes:

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request parameters
- `500 Internal Server Error` - Server-side error

Error responses always include an `error` field describing what went wrong.

---

## Rate Limiting

Currently, no rate limiting is implemented. This should be added in production.

**Recommended Limits**:
- `/api/generate`: 10 requests per minute per user
- `/api/images`: 60 requests per minute per user

---

## Future Endpoints

### Delete Image

**Endpoint**: `DELETE /api/images/:id`

**Authentication**: Required

**Description**: Deletes a specific image by ID.

---

### Get Image by ID

**Endpoint**: `GET /api/images/:id`

**Description**: Retrieves a single image by ID.

---

### Update Image

**Endpoint**: `PATCH /api/images/:id`

**Authentication**: Required

**Description**: Updates image metadata (e.g., prompt, tags).

---

## Example Usage

### JavaScript/TypeScript (Client-side)

```typescript
// Generate an image
const generateImage = async (prompt: string) => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  
  const data = await response.json();
  return data;
};

// Fetch images
const fetchImages = async (limit = 20, offset = 0) => {
  const response = await fetch(`/api/images?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  return data.images;
};
```

### cURL

```bash
# Generate image
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A beautiful sunset over mountains"}'

# Fetch images
curl http://localhost:3000/api/images?limit=10&offset=0
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Image URLs may be temporary or require authentication in future updates
- The API is designed to be stateless
- CORS is handled by Next.js (same-origin by default)


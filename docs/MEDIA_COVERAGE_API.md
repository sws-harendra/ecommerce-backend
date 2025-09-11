# Media Coverage API Documentation

This document outlines the API endpoints for managing media coverage items in the system.

## Base URL
`/media-coverage`

## Endpoints

### Get All Media Coverages
- **URL**: `/`
- **Method**: `GET`
- **Query Parameters**:
  - `isActive` (boolean, optional): Filter by active status
- **Response**: Array of media coverage objects
- **Authentication**: Not required

### Get Single Media Coverage
- **URL**: `/:id`
- **Method**: `GET`
- **Response**: Single media coverage object
- **Authentication**: Not required

### Create Media Coverage (Admin)
- **URL**: `/`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `title` (string, required): Title of the media coverage
  - `url` (string, required): URL link for the media coverage
  - `image` (file, required): Image file for the media coverage
- **Response**: Created media coverage object
- **Authentication**: Required (Admin)

### Update Media Coverage (Admin)
- **URL**: `/:id`
- **Method**: `PUT`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `title` (string, optional): Updated title
  - `url` (string, optional): Updated URL
  - `isActive` (boolean, optional): Update active status
  - `image` (file, optional): New image file (optional)
- **Response**: Updated media coverage object
- **Authentication**: Required (Admin)

### Delete Media Coverage (Admin)
- **URL**: `/:id`
- **Method**: `DELETE`
- **Response**: Success message
- **Authentication**: Required (Admin)

### Toggle Media Coverage Status (Admin)
- **URL**: `/:id/toggle-status`
- **Method**: `PATCH`
- **Response**: Updated media coverage object with toggled status
- **Authentication**: Required (Admin)

## Data Model

```javascript
{
  id: number,
  title: string,
  imageUrl: string,  // URL to the uploaded image
  url: string,       // External URL for the media coverage
  isActive: boolean, // Whether the media coverage is active
  createdAt: string, // ISO date string
  updatedAt: string  // ISO date string
}
```

## Error Responses

### 400 Bad Request
- Missing required fields
- Invalid URL format
- No image provided when required

### 401 Unauthorized
- User not authenticated
- User not authorized (non-admin)

### 404 Not Found
- Media coverage with specified ID not found

### 500 Internal Server Error
- Server error during processing

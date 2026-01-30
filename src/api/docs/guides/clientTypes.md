## Client Types Endpoints <!-- {docsify-ignore} -->

### Add New Client Types
Allow super admin to add new client types to the system.
- Method: `POST`
- Path: `/types`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "title": "type-title",
    "description": "type description",
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Client type added successfully",
    "result": {
        "id": "type-id",
        "role": "type-title",
    }
}
```
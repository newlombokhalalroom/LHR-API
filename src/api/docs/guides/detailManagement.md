## Detail Management Endpoints <!-- {docsify-ignore} -->
Details refer to detailed information associated with products, where each product can have multiple details, and vice versa.

### Add New Detail
Allow super admin to add new detail to the system.
- Method: `POST`
- Path: `/details`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "category": "Bed Types",
    "title": "Double Bed",
    "type": "hotel"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Detail added successfully",
    "result": {
        "id": "82352507-b37b-4c3e-8b4c-70067aad365e",
        "category": "Bed Types",
        "title": "Double Bed",
        "type": "hotel"
    }
}
```
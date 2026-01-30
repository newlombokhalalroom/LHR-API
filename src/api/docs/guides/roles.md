## Roles Endpoints <!-- {docsify-ignore} -->

### Add New Roles
Allow super admin to add new roles to the system.
- Method: `POST`
- Path: `/roles`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "title": "roles-title",
    "description": "roles description",
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Role added successfully",
    "result": {
        "id": "role-id",
        "role": "role-title",
    }
}
```
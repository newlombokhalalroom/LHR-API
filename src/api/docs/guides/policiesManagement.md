## Policies Management Endpoints <!-- {docsify-ignore} -->

### Add New Client Policies
Allows users with the "super-admin" role to add new policies to the system. Clients can then choose to add these policies to their client information.
- Method: `POST`
- Path: `/policies`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
   "type": "hotel",
   "category": "regular",
   "title": "No Pets",
   "description": "Pets are not allowed in the accommodation"
}
```
- **The `category` field in the request body specifies whether the facility is `halal` or `regular`.**
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Policy added successfully",
    "result": {
        "policy": {
            "id": "35c72a19-49e5-4f7c-a08a-aaf8a8205282",
            "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
            "category": "regular",
            "title": "No Pets",
            "description": "Pets are not allowed in the accommodation",
            "_created_date": "2023-10-17T06:50:41.633Z",
            "_updated_date": "2023-10-17T06:50:41.633Z"
        }
    }
}
```
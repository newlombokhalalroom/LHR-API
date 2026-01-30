## Policies Endpoints <!-- {docsify-ignore} -->

### Get All Policies
Allows users to retrieve a list of all types of policies. 
- Method: `GET`
- Path: `/policies`
- Optional Query Parameters:
    - `category` : Specifies the category of the policies.
    - `type` : Specifies the type of client.
- Example: 
```bash
GET base-url/policies?type=hotel&category=regular
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "policies": [
            {
                "id": "8a08844f-d28c-437d-8a21-4ba945372968",
                "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
                "category": "regular",
                "title": "Check-in",
                "description": "Standard check-in time",
                "_created_date": "2023-10-17T03:56:45.262Z",
                "_updated_date": "2023-10-17T03:56:45.262Z"
            },
            {
                "id": "a93ca831-04a1-4b36-a036-a589e02b4476",
                "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
                "category": "regular",
                "title": "Check-out",
                "description": "Standard check-out time",
                "_created_date": "2023-10-17T03:59:55.605Z",
                "_updated_date": "2023-10-17T03:59:55.605Z"
            }
        ]
    }
}
```
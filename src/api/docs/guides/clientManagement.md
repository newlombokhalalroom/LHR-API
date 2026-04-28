## Clients Endpoints <!-- {docsify-ignore} -->

### Retrieve Unapproved Client
Allows users with the "super-admin" role to retrieve a list of unapproved clients.
- Method: `GET`
- Path: `/clients/unapproved`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "clients": [
            {
                "id": "58bf6274-5866-48bb-a05d-8f0ca1a2bbaa",
                "name": "Grand",
                "title": "hotel"
            },
            {
                "id": "374624e2-7f5a-428f-8b26-92ded2581f27",
                "name": "Madani",
                "title": "hotel"
            }
        ]
    }
}
```

### Approve a Client
Allows users with the "super-admin" role to approve a client by specifying their ID. 
- Method: `PUT`
- Path: `/clients/approve/{id}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Client has been approved successfully"
}
```
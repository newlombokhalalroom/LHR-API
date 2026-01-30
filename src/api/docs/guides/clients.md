## Clients Endpoints <!-- {docsify-ignore} -->

### Get Client Types
This endpoint retrieves a list of client types from the server.
- Method: `GET`
- Path: `/clients/types`
- Optional Query Parameters:
    - `type` : Specifies the type.
- Example: 
```bash
GET base-url/clients/types?type=hotel
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        {
            "id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
            "title": "hotel",
            "description": "The hotel type classifies clients associated with hotels.",
            "_created_date": "2023-09-14T02:45:12.079Z",
            "_updated_date": "2023-09-14T02:45:12.079Z"
        },
        {
            "id": "bdeebf9e-cf96-425a-a16f-7818a0dd290d",
            "title": "car rent",
            "description": "The car rent type classifies clients associated with car rental services.",
            "_created_date": "2023-09-28T11:38:50.117Z",
            "_updated_date": "2023-09-28T11:38:50.117Z"
        }
    ]
}
```

### Add New Clients Information
Allows users with the "admin" role to add client information to the system.
- Method: `POST`
- Path: `/clients`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{  
    "id": "236e164b-d6ea-4a91-bb4e-cd9720fe9613", // not required
    "type": "hotel",
    "name": "Grand",
    "email": "samplehotel@example.com",
    "phone": "+1234567890",
    "npwp": "123-456-789",
    "picture": "https://example.com/samplehotel.jpg",
    "description": "A luxurious hotel offering top-notch amenities and breathtaking views."
}
```
- **The 'id' field is not required, it will be generated automatically in the database.**
- **The 'type' field is currently limited to 'hotel'.**
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Client added successfully",
    "result": {
        "clientId": "236e164b-d6ea-4a91-bb4e-cd9720fe9613"
    }
}
```

### Get Client's Information by User
Allows users with the "admin" role to retrieve their client information.
- Method: `GET`
- Path: `/clients/byUser`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "id": "374624e2-7f5a-428f-8b26-92ded2581f27",
        "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
        "owner_id": "4a96a9e9-30b8-4952-90d6-8f250d3e768b",
        "approved_by": "7b69dc7a-8e7e-4012-b165-3dc6a05d02fc",
        "name": "Madani",
        "email": "samplehotel@example.com",
        "phone": "+1234567890",
        "npwp": "123-456-789",
        "picture": "https://example.com/samplehotel.jpg",
        "description": "A luxurious hotel offering top-notch amenities and breathtaking views.",
        "_created_date": "2023-09-14T13:30:57.841Z",
        "_updated_date": "2023-09-14T13:30:57.841Z",
        "type": "hotel"
    }
}
```

### Update Clients Information
Allows users with the "admin" role to update their client information to the system.
- Method: `PUT`
- Path: `/clients`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "type": "hotel",
    "name": "Grand Madani Hotel",
    "email": "grandmadani@example.com",
    "phone": "+01909087",
    "npwp": "675-908-657",
    "picture": "https://example.com/grandmadanihotel.png",
    "description": "A luxurious halal hotel offering top-notch amenities and breathtaking views."
}
```
- **The 'type' field is currently limited to 'hotel'.**
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Clients updated successfully",
    "result": {
        "updatedClient": {
            "id": "236e164b-d6ea-4a91-bb4e-cd9720fe9613",
            "type_id": "336797b5-aad3-4f85-acf9-c78d447f67c8",
            "owner_id": "3f551e64-4a90-4728-b4b3-ad73eb944b1a",
            "approved_by": null,
            "name": "Grand Madani Hotel",
            "email": "grandmadani@example.com",
            "phone": "+01909087",
            "npwp": "675-908-657",
            "picture": "https://example.com/grandmadanihotel.png",
            "description": "A luxurious halal hotel offering top-notch amenities and breathtaking views."
        }
    }
}
```

### Add Client Pictures
Allows users with the "admin" role to add pictures related to their client information.
- Method: `POST`
- Path: `/clients/pictures`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "url": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
    "title": "Hotel Parking Lot",
    "description": "Big Hotel Parking Lot"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "pictureId": "cecee5bb-d1f7-4df7-a70f-3c875426ae24"
    }
}
```

### Delete Client Pictures
Allows users with the "admin" role to delete pictures related to their client information.
- Method: `DELETE`
- Path: `/clients/pictures`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "id": "cecee5bb-d1f7-4df7-a70f-3c875426ae24"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Picture of Hotel Parking Lot is deleted successfully"
}
```

### Add Client Facilities
Allows users with the "admin" role to add facilities related to their client information.
- Method: `POST`
- Path: `/clients/facilities`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "facilities": ["Kolam Renang", "Restaurant"]
}
```
- Every `facilities` entry must represent a valid facility name; invalid names will not be inserted into the database.
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Facilities added successfully",
    "result": [
        {
            "facility_id": "982dba7c-55d0-4a3c-a91d-d015986b16e2"
        },
        {
            "facility_id": "eab5fac4-6915-413e-b4f5-8e7cd886bbd2"
        }
    ]
}
```

### Delete Client Facility
Allows users with the "admin" role to delete facility related to their client information.
- Method: `DELETE`
- Path: `/clients/facilities`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "facility": "Restaurant"
}
```
- Every `facility` entry must represent a valid facility name; invalid names will not be deleted from the database.
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Facility has been deleted"
}
```

### Add Client Location
Allows users with the "admin" role to add location data related to their client information.
- Method: `POST`
- Path: `/clients/locations`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "address": "Jl. Udayana No.20, Monjok Bar., Kec. Selaparang, 83122",
    "longitude": 116.10281638858123,
    "latitude": -8.57548540893652,
    "city": "Kota Mataram",
    "province": "Nusa Tenggara Barat"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "locationId": "787f12e4-f30c-4eb2-9c08-3154c874691e"
    }
}
```

### Update Client Location
Allows users with the "admin" role to update location data related to their client information.
- Method: `PUT`
- Path: `/clients/locations`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "address": "Jl. Majapahit No.20, Monjok Bar., Kec. Selaparang, 83122",
    "longitude": 116.102431,
    "latitude": -8.575350,
    "city": "Mataram",
    "province": "West Nusa Tenggara"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Location updated successfully",
    "result": {
        "address": "Jl. Majapahit No.20, Monjok Bar., Kec. Selaparang, 83122",
        "city": "Mataram",
        "province": "West Nusa Tenggara",
        "longitude": 116.102431,
        "latitude": -8.57535
    }
}
```

### Add Client's Policies
Allows users with the "admin" role to add policies data related to their client information.
- Method: `POST`
- Path: `/clients/policies`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "policies": [
        {
            "title": "Check-out",
            "details": "From 12:00"
        },
        {
            "title": "Check-in",
            "details": "From 15:00"
        }
    ]
}
```
- Every `policies` entry must represent a valid policies title; invalid title will not be inserted into the database.
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Client's policies added successfully",
    "result": {
        "policies": [
            {
                "policy_id": "8a08844f-d28c-437d-8a21-4ba945372968",
                "client_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
                "details": "From 15:00",
                "_created_date": "2023-10-18T03:56:42.607Z",
                "_updated_date": "2023-10-18T03:56:42.607Z"
            },
            {
                "policy_id": "a93ca831-04a1-4b36-a036-a589e02b4476",
                "client_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
                "details": "From 12:00",
                "_created_date": "2023-10-18T03:56:42.607Z",
                "_updated_date": "2023-10-18T03:56:42.607Z"
            }
        ]
    }
}
```

### Update Client's Policy
Allows users with the "admin" role to update policies data related to their client information.
- Method: `PUT`
- Path: `/clients/policies/{policyId}`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "details": "From 11:00"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Client's policy updated successfully",
    "result": {
        "clientId": "374624e2-7f5a-428f-8b26-92ded2581f27",
        "updatedPolicy": {
            "policy_id": "a93ca831-04a1-4b36-a036-a589e02b4476",
            "details": "From 11:00",
            "_updated_date": "2023-10-18T07:31:31.361Z"
        }
    }
}
```

### Delete Client's Policy
Allows users with the "admin" role to delete policies data related to their client information.
- Method: `DELETE`
- Path: `/clients/policies/{policyId}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Client's policy deleted successfully",
    "result": {
        "deletedPolicy": {
            "policy_id": "8a08844f-d28c-437d-8a21-4ba945372968",
            "client_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
            "details": "From 15:00",
            "_created_date": "2023-10-18T08:01:03.251Z",
            "_updated_date": "2023-10-18T08:01:03.251Z"
        }
    }
}
```
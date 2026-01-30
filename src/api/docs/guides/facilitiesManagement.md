## Client Facilities Endpoints <!-- {docsify-ignore} -->

### Add New Client Facility
Allows users with the "super-admin" role to add new facilities to the system. Clients can then choose to add these facilities to their client information.
- Method: `POST`
- Path: `/facilities`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "type": "hotel",
    "title": "Restaurant",
    "category": "halal"
}
```
- **The `category` field in the request body specifies whether the facility is `halal` or `regular`.**
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Facility added successfully",
    "result": {
        "facilityId": "982dba7c-55d0-4a3c-a91d-d015986b16e2"
    }
}
```
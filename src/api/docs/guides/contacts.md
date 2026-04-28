## User Contact Endpoints <!-- {docsify-ignore} -->

### Update Contact
Update an existing contact's information. You should provide the Bearer Token in the request header for authentication.
- Method: `PUT`
- Path: `/contacts`
- Authentication: User Access Token (Bearer token)
- Request Body:
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "phone": "1234567890"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Contact updated successfully."
}
```

### Get User Contact Information
Retrieve the contact information for the authenticated user. 
- Method: `GET`
- Path: `/contacts`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "contact": {
            "id": "797d28cf-f772-48c6-992f-913cb6737b6e",
            "userId": "1d0ae2db-aeb8-4c20-933f-498c5dc401c8",
            "firstName": "John",
            "lastName": "Doe",
            "email": "johndoe@example.com",
            "phone": "1234567890",
            "_isEmailVerified": false,
            "_isPhoneVerified": false,
            "_createdDate": "2023-09-04T05:25:04.667Z",
            "_updatedDate": "2023-09-05T07:37:22.018Z"
        }
    }
}
```
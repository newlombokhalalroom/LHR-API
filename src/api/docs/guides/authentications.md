## Authentication Endpoints <!-- {docsify-ignore} -->

### Add Authentication
Allows users to log in using email/password or username/password to obtain access and refresh tokens for accessing protected resources.
- Method: `POST`
- Path: `/authentications`
- Request Body:
```json
{
    "usernameOrEmail": "username/username123@example.com",
    "password": "supersecret",
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Authentication added successfully",
    "result": {
        "accessToken": "header.payload.signature",
        "refreshToken": "header.payload.signature"
    }   
}
```

### Refresh Authentication
Allows users to refresh their access token using a valid refresh token to maintain access to protected resources when the access token expires.
- Method: `PUT`
- Path: `/authentications`
- Request Body:
```json
{
    "refreshToken": "header.payload.signature"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Authentication refreshed successfully",
    "result": {
        "accessToken": "header.payload.signature"
    }
}
```

### Delete Authentication
Enables users to log out by deleting their refresh token, effectively revoking access to protected resources.
- Method: `DELETE`
- Path: `/authentications`
- Request Body:
```json
{
    "refreshToken": "header.payload.signature"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Authentication deleted successfully",
}
```
## Verification Endpoints <!-- {docsify-ignore} -->

### Request For Email Verification Code
Allow users to request a verification code for email validation. The code will be sent to user's email.
- Method: `POST`
- Path: `/verifications/email`
- Authentication: User Access Token (Bearer token)
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Verification code sent successfully"
}
```

### Validate Email Verification Code
Allow user to validate the verification code.
- Method: `PUT`
- Path: `/verifications/email`
- Authentication: User Access Token (Bearer token)
- Request Body:
```json
{
    "code": "777777"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Email verified successfully"
}
```
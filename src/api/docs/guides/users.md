## Users Endpoints <!-- {docsify-ignore} -->

### Add User
User register for a new credential.
- Method: `POST`
- Path: `/users`
- Request Body:
```json
{
    "username": "johndoe123",
    "email": "johndoe@example.com",
    "password": "secretPassword"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "User added successfully",
    "result": {
        "userId": "f0c83e62-f40a-41fb-b0f6-7b595ba741fc"
    }
}
```

### Get User by ID
Get user detail by its ID.
- Method: `GET`
- Path: `/users/:id`
- Path Parameters: `id`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "id": "75191894-1d24-404d-b30c-820f5cfa2dbc",
        "role_id": "31b41d71-e353-4b93-8764-f4c4b652990f",
        "username": "user1",
        "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
        "_created_date": "2023-10-05T12:55:18.241Z",
        "_updated_date": "2023-10-23T08:48:43.240Z"
    }
}
```

### Get User by Authentication
Allows authenticated users to retrieve their own user data.
- Method: `GET`
- Path: `/users/profile`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "id": "75191894-1d24-404d-b30c-820f5cfa2dbc",
        "role_id": "31b41d71-e353-4b93-8764-f4c4b652990f",
        "username": "user1",
        "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
        "_created_date": "2023-10-05T12:55:18.241Z",
        "_updated_date": "2023-10-23T08:48:43.240Z"
    }
}
```

### User Picture Upload
Allows authenticated users to upload their profile picture by providing a valid picture URL. 
- Method: `PUT`
- Path: `/users/picture`
- Authentication: User Access Token (Bearer token)
- Request Body:
```json
{
    "url": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Picture was successfully updated"
}
```

### Password Reset Request
Allows users to request a password reset by providing their registered email address. If the email is registered, the server will send a password reset code to the user's email address.
- Method: `POST`
- Path: `/users/password/reset`
- Request Body:
```json
{
    "email": "user@example.com"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Reset password code sent successfully"
}
```

### Password Reset 
Allows users who have received a valid password reset code via email to change their password.
- Method: `PUT`
- Path: `/users/password/reset`
- Request Body:
```json
{
    "code": "reset_code_here",
    "newPassword": "new_password_here"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Password has changed successfully"
}
```

### Change Password
Allows authenticated users to change their password by providing both their old and new passwords.
- Method: `PUT`
- Path: `/users/password`
- Authentication: User Access Token (Bearer token)
- Request Body:
```json
{
    "oldPassword": "current_password123",
    "newPassword": "new_password456"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Password has changed successfully"
}
```

### User Registration as Admin
Allows users to register with the "admin" role, granting them elevated privileges within the system..
- Method: `POST`
- Path: `/users/admins`
- Request Body:
```json
{
    "username": "johndoe123",
    "email": "johndoe@example.com",
    "password": "secretPassword"
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "admin added successfully",
    "result": {
        "userId": "4a96a9e9-30b8-4952-90d6-8f250d3e768b"
    }
}
```
### Change Username
Allows authenticated users to change their username by providing their desired new username.
- Method: `PUT`
- Path: `/users/username`
- Authentication: User Access Token (Bearer token)
- Request Body:
```json
{
    "username": "janeDoe"
}
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": {
        "id": "511ed288-554b-4f07-96ed-3d323e67e745",
        "username": "janeDoe"
    }
}
```
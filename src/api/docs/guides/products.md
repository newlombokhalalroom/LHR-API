## Products Endpoints <!-- {docsify-ignore} -->

### Add New Product

Allows users with the "admin" role to create a new product by submitting the product's information.

- Method: `POST`
- Path: `/products`
- Authentication: User Access Token (Bearer token)
- Request Body:

```json
{
  "title": "Lombok Halal Package",
  "description": "Embark on a remarkable journey of spirituality, culture, and adventure with our meticulously crafted Halal Travel Package. Designed with the discerning Muslim traveler in mind, this exceptional offering is your gateway to a world of enriching experiences while respecting your faith and dietary requirements.",
  "availability": true,
  "price": 150000,
  "units": "package",
  "amenities": [
    {
      "id": "2645f5fd-068c-41df-8f57-2214ecc3a2a5"
    },
    {
      "id": "8e5ed2e2-611e-44bc-87d9-82fd12c0165c"
    }
  ],
  "pictures": [
    {
      "picture": "https://example.com/interior-1.jpg",
      "title": "Interior",
      "description": "Interior very nice"
    },
    {
      "picture": "https://example.com/cargo-space-2.jpg",
      "title": "Cargo Space",
      "description": "Cargo Space Big"
    }
  ],
  "details": [
    {
      "title": "Days",
      "amount": 5
    },
    {
      "title": "Nights",
      "amount": 4
    }
  ]
}
```

- Response Code: `201 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product added successfully",
  "result": {
    "id": "15d2055f-577f-4dac-bee6-3b311ea5cfc2",
    "client_id": "eb417dbb-a7d3-45b2-ad72-758c4da7bf65",
    "title": "Executive Penthouse",
    "description": "Experience unparalleled opulence in our Executive Penthouse, boasting panoramic views of the city and top-notch amenities.",
    "availability": true,
    "price": "750000",
    "units": "night",
    "amenities": [
      {
        "id": "4a855f1d-37fa-45e7-915a-038c90135e59",
        "title": "Air Conditioning"
      },
      {
        "id": "c8145160-5450-4925-981f-be81008783d7",
        "title": "Hairdryer"
      },
      {
        "id": "f0e70ddb-c220-4619-a480-35d8e91f90be",
        "title": "Mini Fridge"
      },
      {
        "id": "f6084020-b73b-4b2e-aaa7-831c7963748c",
        "title": "Television"
      }
    ],
    "pictures": [
      {
        "id": "9eb9a083-a49c-44fa-901f-87792602cb64",
        "picture": "https://example.com/executive-penthouse-1.jpg",
        "description": "Marvel at the cityscape from your floor-to-ceiling windows.",
        "title": "Panoramic City Views"
      },
      {
        "id": "36c19666-892b-4cd2-9e5c-377f6badedbf",
        "picture": "https://example.com/executive-penthouse-2.jpg",
        "description": "Unwind in your exclusive Jacuzzi with a view.",
        "title": "Private Jacuzzi"
      }
    ],
    "details": [
      {
        "detail_id": "ea594391-5dc9-4ea1-b963-ddf9291cd648",
        "amount": "3"
      },
      {
        "detail_id": "c0a29999-9939-4d7b-8d98-c0cb054d1702",
        "amount": "1"
      }
    ]
  }
}
```

### Update Product Information

Allows users with the "admin" role to update a product information by its ID.

- Method: `PUT`
- Path: `/products/{id}`
- Authentication: User Access Token (Bearer token)
- Request Body:

```json
{
  "title": "Regular Ocean View Room",
  "description": "Experience luxury and breathtaking ocean views in our spacious Deluxe Ocean View Room, perfect for a romantic getaway or relaxation.",
  "availability": true,
  "quantity": 5,
  "price": 350000,
  "units": "night"
}
```

- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product updated successfully",
  "result": {
    "title": "Regular Ocean View Room",
    "description": "Experience luxury and breathtaking ocean views in our spacious Deluxe Ocean View Room, perfect for a romantic getaway or relaxation.",
    "availability": true,
    "quantity": 5,
    "price": "350000",
    "units": "night"
  }
}
```

### Delete a Product

Allows users with the "admin" role to delete a product by its ID.

- Method: `DELETE`
- Path: `/products/{id}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product deleted successfully",
  "result": {
    "id": "2b6d6541-624a-4387-a4cc-66f8de456189",
    "client_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
    "title": "Executive Suite",
    "description": "Indulge in luxury with our spacious executive suite, ideal for business travelers and special occasions.",
    "availability": true,
    "price": "2000000",
    "units": "night",
    "_created_date": "2023-09-28T12:46:28.526Z",
    "_updated_date": "2023-09-28T12:46:28.526Z"
  }
}
```

### Add New Product Amenities

Allows users with the "admin" role to add new amenities in a product by its ID.

- Method: `POST`
- Path: `/products/{id}/amenities`
- Authentication: User Access Token (Bearer token)
- Request Body:

```json
{
  "amenities": ["04bad9ea-2a47-4a6a-a07a-5ba6bde5bb6b"]
}
```

- Response Code: `201 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product amenities added successfully",
  "result": [
    {
      "id": "04bad9ea-2a47-4a6a-a07a-5ba6bde5bb6b",
      "title": "International Airfare"
    }
  ]
}
```

### Delete Product Amenity

Allows users with the "admin" role to delete an amenity in a product by its ID.

- Method: `DELETE`
- Path: `/products/{productId}/amenities/{amenityId}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Products amenities deleted successfully",
  "result": [
    {
      "product": "Deluxe Ocean View Room",
      "amenity": "Television"
    }
  ]
}
```

### Add New Products Pictures

Allows users with the "admin" role to add new pictures in a product by its ID.

- Method: `POST`
- Path: `/products/{id}/pictures`
- Authentication: User Access Token (Bearer token)
- Request Body:

```json
{
  "pictures": [
    {
      "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
      "title": "Swimming Pool",
      "description": "Big swimming pool for everyone"
    },
    {
      "picture": "https://example.com/lombok-view-room-2.jpg",
      "title": "Outstanding View",
      "description": "Lombok City View"
    }
  ]
}
```

- Response Code: `201 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product pictures added successfully",
  "result": [
    {
      "id": "de8ef9aa-5e16-45d8-8938-3dbf2c3024ff",
      "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
      "description": "Big swimming pool for everyone",
      "title": "Swimming Pool"
    },
    {
      "id": "456e64ab-8eb2-4597-9e0e-82020dc34ed9",
      "picture": "https://example.com/deluxe-ocean-view-room-2.jpg",
      "description": "Lombok City View",
      "title": "Outstanding View"
    }
  ]
}
```

### Delete Product Picture

Allows users with the "admin" role to delete a picture in a product by its ID.

- Method: `DELETE`
- Path: `/products/{productId}/pictures/{pictureId}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product picture deleted successfully",
  "result": {
    "id": "2d7846c9-a61f-4226-83f5-43a2a9525aff",
    "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
    "title": "Swimming Pool",
    "description": "Big swimming pool for everyone"
  }
}
```

### Add New Product Details

Allows users with the "admin" role to add new details in a product by its ID.

- Method: `POST`
- Path: `/products/{id}/details`
- Authentication: User Access Token (Bearer token)
- Request Body:

```json
{
  "details": [
    {
      "title": "Guest",
      "amount": 2
    },
    {
      "title": "Double Bed",
      "amount": 1
    }
  ]
}
```

- Response Code: `201 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product details added successfully",
  "result": [
    {
      "detail_id": "442f9e14-bb9f-4e93-aaae-68355f1a2740",
      "amount": "1"
    },
    {
      "detail_id": "98bf5675-a5e2-4cc7-a74a-073b7c5ad17c",
      "amount": "2"
    }
  ]
}
```

### Update Product's Detail

Allows users with the "admin" role to update a detail in a product by its ID.

- Method: `PUT`
- Path: `/products/{productId}/details/{detailId}`
- Authentication: User Access Token (Bearer token)
- Request Body:

```json
{
  "amount": 1
}
```

- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product detail updated successfully",
  "result": {
    "product": "Standard Room",
    "detail": "Single Bed",
    "amount": "1",
    "_updated_date": "2023-10-19T03:08:09.268Z"
  }
}
```

### Delete Product Detail

Allows users with the "admin" role to delete a detail in a product by its ID.

- Method: `DELETE`
- Path: `/products/{productId}/details/{detailId}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product detail deleted successfully",
  "result": {
    "product": "Double Deluxe Room",
    "detail": "King Size Bed"
  }
}
```

### Add New Product Options

Allows users with the "admin" role to add new options in a product by its ID.

- Method: `POST`
- Path: `/products/{productId}/options`
- Authentication: User Access Token (Bearer token)
- Request Body:

```json
{
  "options": [
    {
      "title": "Laundry",
      "price": 30000
    },
    {
      "title": "Room Cleaning",
      "price": 45000
    }
  ]
}
```

- Response Code: `201 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product options added successfully",
  "result": [
    {
      "option_id": "833b2ec3-ffaf-4560-bf49-3e5ad2b97a36",
      "price": "30000"
    },
    {
      "option_id": "7cb5a011-1f28-4d9f-8aff-39abac48831e",
      "price": "45000"
    }
  ]
}
```

### Update Product's Option

Allows users with the "admin" role to update a option in a product by its ID.

- Method: `PUT`
- Path: `/products/{productId}/options/{optionId}`
- Authentication: User Access Token (Bearer token)
- Request Body:

```json
{
  "price": 60000
}
```

- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product option updated successfully",
  "result": {
    "product": "Double Deluxe Room",
    "option": "Laundry",
    "price": "60000",
    "_updated_date": "2023-11-02T13:29:46.814Z"
  }
}
```

### Delete Product Option

Allows users with the "admin" role to delete a option in a product by its ID.

- Method: `DELETE`
- Path: `/products/{productId}/options/{optionId}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product option deleted successfully",
  "result": {
    "product": "Double Deluxe Room",
    "option": "Laundry"
  }
}
```

### Add Product's Policies

Allows users with the "admin" role to add policies data related to their product information.

- Method: `POST`
- Path: `/products/{productId}/policies`
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
  "message": "Product's policies added successfully",
  "result": {
    "policies": [
      {
        "policy_id": "8a08844f-d28c-437d-8a21-4ba945372968",
        "product_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
        "details": "From 15:00",
        "_created_date": "2023-10-18T03:56:42.607Z",
        "_updated_date": "2023-10-18T03:56:42.607Z"
      },
      {
        "policy_id": "a93ca831-04a1-4b36-a036-a589e02b4476",
        "product_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
        "details": "From 12:00",
        "_created_date": "2023-10-18T03:56:42.607Z",
        "_updated_date": "2023-10-18T03:56:42.607Z"
      }
    ]
  }
}
```

### Update Product's Policy

Allows users with the "admin" role to update policies data related to their product information.

- Method: `PUT`
- Path: `/products/{productId}/policies/{policyId}`
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
  "message": "Product's policy updated successfully",
  "result": {
    "productId": "374624e2-7f5a-428f-8b26-92ded2581f27",
    "updatedPolicy": {
      "policy_id": "a93ca831-04a1-4b36-a036-a589e02b4476",
      "details": "From 11:00",
      "_updated_date": "2023-10-18T07:31:31.361Z"
    }
  }
}
```

### Delete Product's Policy

Allows users with the "admin" role to delete policies data related to their product information.

- Method: `DELETE`
- Path: `/products/{productId}/policies/{policyId}`
- Authentication: User Access Token (Bearer token)
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product's policy deleted successfully",
  "result": {
    "deletedPolicy": {
      "policy_id": "8a08844f-d28c-437d-8a21-4ba945372968",
      "product_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
      "details": "From 15:00",
      "_created_date": "2023-10-18T08:01:03.251Z",
      "_updated_date": "2023-10-18T08:01:03.251Z"
    }
  }
}
```

### Update Product Availability

Allows users with the "admin" role to update the product availability.

- Method: `PUT`
- Path: `/products/{id}/availability`
- Required Query Parameters:
  - `value` : Specifies the value of availability(true/false).
- Example:

```bash
GET base-url/products/{id}/availability?value=false
```

- Authentication: User Access Token (Bearer token)
- Response Code: `201 OK`
- Response Body:

```json
{
  "status": true,
  "message": "Product availability updated successfully",
  "result": {
    "id": "69f2ec85-60ed-45ab-8520-c53488888081",
    "title": "Regular Room",
    "availability": false
  }
}
```

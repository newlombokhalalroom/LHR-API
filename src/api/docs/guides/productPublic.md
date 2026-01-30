## Public Product's Endpoints <!-- {docsify-ignore} -->

Items refer to individual products or objects associated with a larger product category.

### Get Product's

Allows any users to retrieve detailed information about products.

- Method: `GET`
- Path: `/products`
- Query Parameters:
  - `filter` (optional as JSON string): filter based on order's fields.
  - `page` (optional): The page number for paginated results.
  - `limit` (optional): The number of items per page for pagination.
  - Example:

```bash
GET base-url/products?page=1&limit=5&filter=%7B%22where%22%3A%22types.title%3D'hotel'%20AND%20products.title%20LIKE%20'%25Standard%25'%22%7D
```

- Filter (optional): `{"where":"types.title='hotel' AND products.title LIKE '%Standard%'"}` or JSON.stringify({where:"types.title='hotel' AND products.title LIKE '%Standard%'"})
- Response Code: `200 OK`
- Response Body:

```json
{
  "status": true,
  "total": 27,
  "count": 3,
  "pages": 1,
  "result": [
    {
      "id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
      "client_id": "b822acae-dd55-4305-a892-534a01cc0165",
      "title": "Standard  Deluxe",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text eve",
      "availability": true,
      "price": "750000",
      "units": "night",
      "_created_date": "2023-11-02T23:36:32.217Z",
      "_updated_date": "2023-11-09T22:40:15.978Z",
      "type": "hotel",
      "items": [
        {
          "id": "d13cfccb-9318-434e-9b42-5c40ecec9347",
          "title": "Room 001"
        },
        {
          "id": "b603ff71-4412-45b9-8e4b-b6bd075a86b6",
          "title": "Room 2"
        },
        {
          "id": "78ec964d-69fe-4f9a-8df1-913a21908843",
          "title": "Room 003"
        },
        {
          "id": "46b4f458-b098-4d30-bc0f-587bc72549a3",
          "title": "Room 4"
        }
      ],
      "details": [
        {
          "id": "ea594391-5dc9-4ea1-b963-ddf9291cd648",
          "title": "Guests",
          "amount": "2"
        }
      ],
      "amenities": [
        {
          "amenity_id": "f7f2acad-8352-4d9f-8485-d5933425709e",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-09-29T02:33:19.813Z",
          "id": "f7f2acad-8352-4d9f-8485-d5933425709e",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "halal",
          "title": "Al-Quran",
          "_updated_date": "2023-09-29T02:33:19.813Z"
        },
        {
          "amenity_id": "f0e70ddb-c220-4619-a480-35d8e91f90be",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-09-29T02:31:59.546Z",
          "id": "f0e70ddb-c220-4619-a480-35d8e91f90be",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "regular",
          "title": "Mini Fridge",
          "_updated_date": "2023-09-29T02:31:59.546Z"
        },
        {
          "amenity_id": "aa51132e-72b0-415e-9e45-6794b357b503",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-09-29T02:32:44.512Z",
          "id": "aa51132e-72b0-415e-9e45-6794b357b503",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "halal",
          "title": "Prayer Mat",
          "_updated_date": "2023-09-29T02:32:44.512Z"
        },
        {
          "amenity_id": "00a28508-c62b-4416-96ce-e3ae1b656b85",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-09-29T02:32:52.578Z",
          "id": "00a28508-c62b-4416-96ce-e3ae1b656b85",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "halal",
          "title": "Qibla Direction Signage",
          "_updated_date": "2023-09-29T02:32:52.578Z"
        },
        {
          "amenity_id": "f6084020-b73b-4b2e-aaa7-831c7963748c",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-09-29T02:31:52.116Z",
          "id": "f6084020-b73b-4b2e-aaa7-831c7963748c",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "regular",
          "title": "Television",
          "_updated_date": "2023-09-29T02:31:52.116Z"
        },
        {
          "amenity_id": "75196624-2707-4a42-ac14-d68b9db60fc0",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-11-09T14:36:57.518Z",
          "id": "75196624-2707-4a42-ac14-d68b9db60fc0",
          "type_id": "5b1a0059-807f-4cec-b857-156ae1d4d9a4",
          "category": "regular",
          "title": "Toll Fee",
          "_updated_date": "2023-11-09T14:36:57.518Z"
        },
        {
          "amenity_id": "da1575d5-2871-4f09-a3c0-c9c5aa49b08b",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-11-09T14:36:40.980Z",
          "id": "da1575d5-2871-4f09-a3c0-c9c5aa49b08b",
          "type_id": "5b1a0059-807f-4cec-b857-156ae1d4d9a4",
          "category": "regular",
          "title": "Fuel",
          "_updated_date": "2023-11-09T14:36:40.980Z"
        },
        {
          "amenity_id": "c8145160-5450-4925-981f-be81008783d7",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-09-29T02:32:18.257Z",
          "id": "c8145160-5450-4925-981f-be81008783d7",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "regular",
          "title": "Hairdryer",
          "_updated_date": "2023-09-29T02:32:18.257Z"
        },
        {
          "amenity_id": "4a855f1d-37fa-45e7-915a-038c90135e59",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-09-29T02:32:06.977Z",
          "id": "4a855f1d-37fa-45e7-915a-038c90135e59",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "regular",
          "title": "Air Conditioning",
          "_updated_date": "2023-09-29T02:32:06.977Z"
        },
        {
          "amenity_id": "b2638387-e13f-4130-817b-2832b3880846",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-11-09T14:38:05.025Z",
          "id": "b2638387-e13f-4130-817b-2832b3880846",
          "type_id": "5b1a0059-807f-4cec-b857-156ae1d4d9a4",
          "category": "regular",
          "title": "GPS Navigation",
          "_updated_date": "2023-11-09T14:38:05.025Z"
        },
        {
          "amenity_id": "0a87ce77-1825-4092-8663-85bf657e6400",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-11-09T14:37:57.919Z",
          "id": "0a87ce77-1825-4092-8663-85bf657e6400",
          "type_id": "5b1a0059-807f-4cec-b857-156ae1d4d9a4",
          "category": "regular",
          "title": "Child Safety Seats",
          "_updated_date": "2023-11-09T14:37:57.919Z"
        },
        {
          "amenity_id": "00f9348d-48eb-43b5-8434-80b3daab4c6d",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-11-09T14:37:17.737Z",
          "id": "00f9348d-48eb-43b5-8434-80b3daab4c6d",
          "type_id": "5b1a0059-807f-4cec-b857-156ae1d4d9a4",
          "category": "regular",
          "title": "Pick-up and Drop-off",
          "_updated_date": "2023-11-09T14:37:17.737Z"
        },
        {
          "amenity_id": "3172e6e8-ccae-4408-9b21-ec59d42fcad4",
          "product_id": "40e1956f-9e9e-4680-91f0-f0c21d34a834",
          "_created_date": "2023-11-09T14:37:05.748Z",
          "id": "3172e6e8-ccae-4408-9b21-ec59d42fcad4",
          "type_id": "5b1a0059-807f-4cec-b857-156ae1d4d9a4",
          "category": "regular",
          "title": "Parking Fee",
          "_updated_date": "2023-11-09T14:37:05.748Z"
        }
      ],
      "pictures": [
        {
          "id": "b08b9fc9-0774-4cfc-a280-1117191b0794",
          "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/products%2F40e1956f-9e9e-4680-91f0-f0c21d34a834%2Fpicture-ce4c7c50-a61c-4a06-96d6-b1171cdb63a3?alt=media&token=a5f1ada1-3f64-498d-8c53-e67c2b75cd5d",
          "title": "Standard  Deluxe-94edf865-6878-4e87-a794-92c6ef32ed89",
          "description": "-"
        },
        {
          "id": "79efc99f-e58b-47a0-a06b-d92a62bede6b",
          "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/products%2F40e1956f-9e9e-4680-91f0-f0c21d34a834%2Fpicture-af689beb-609e-4e37-9f15-18dff12ab2af?alt=media&token=93720a6f-0376-4544-afe5-aef88758eb01",
          "title": "Standard  Deluxe-b1028a9a-47b4-4339-b047-fd2c67e3f9e9",
          "description": "-"
        },
        {
          "id": "fa7e6a4c-bbc1-45ef-8cc4-b8a663dee3b0",
          "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/products%2F40e1956f-9e9e-4680-91f0-f0c21d34a834%2Fpicture-e025fddc-1ad5-4493-b335-e66be8339733?alt=media&token=8f24dfd6-fb83-4f87-9d49-b0438751aa51",
          "title": "Standard  Deluxe-82547376-89fe-489f-ba98-0aace57395be",
          "description": "-"
        }
      ],
      "client": {
        "id": "b822acae-dd55-4305-a892-534a01cc0165",
        "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
        "owner_id": "fbac7945-941a-4cb8-b92c-64405ae1431b",
        "approved_by": "a9411808-18aa-4adf-8009-7c2bede481a4",
        "name": "Fahru LTD",
        "email": "fahrustack@gmail.com",
        "phone": "(+62) 877-2192-6278",
        "npwp": "66.666.666.6-666.666",
        "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/clients%2Fb822acae-dd55-4305-a892-534a01cc0165%2Fpicture?alt=media&token=c0ca3ed2-3bbf-41fb-9b58-f99c5c1f000b",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet euismod quam, vitae feugiat tellus fermentum non.",
        "_created_date": "2023-10-16T16:04:39.148Z",
        "_updated_date": "2023-11-24T06:38:19.429Z",
        "title": "hotel"
      }
    },
    {
      "id": "23ec58fe-2d95-4d9f-928b-f0f7028a12d1",
      "client_id": "b822acae-dd55-4305-a892-534a01cc0165",
      "title": "Standard",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text eve",
      "availability": true,
      "price": "350000",
      "units": "night",
      "_created_date": "2023-11-03T02:41:31.798Z",
      "_updated_date": "2023-11-13T05:39:35.740Z",
      "type": "hotel",
      "items": [
        {
          "id": "f350f528-9ed8-4a33-a042-4bf22501de1c",
          "title": "Room Thor"
        },
        {
          "id": "63acaf7f-2108-4a45-a90b-e1725d48519e",
          "title": "abcacb"
        }
      ],
      "details": [
        {
          "id": "ea594391-5dc9-4ea1-b963-ddf9291cd648",
          "title": "Guests",
          "amount": "2"
        },
        {
          "id": "2d418f73-dede-4504-a344-479dd79f7ac8",
          "title": "Twin Bed",
          "amount": "3"
        }
      ],
      "amenities": [
        {
          "amenity_id": "f7f2acad-8352-4d9f-8485-d5933425709e",
          "product_id": "23ec58fe-2d95-4d9f-928b-f0f7028a12d1",
          "_created_date": "2023-09-29T02:33:19.813Z",
          "id": "f7f2acad-8352-4d9f-8485-d5933425709e",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "halal",
          "title": "Al-Quran",
          "_updated_date": "2023-09-29T02:33:19.813Z"
        },
        {
          "amenity_id": "aa51132e-72b0-415e-9e45-6794b357b503",
          "product_id": "23ec58fe-2d95-4d9f-928b-f0f7028a12d1",
          "_created_date": "2023-09-29T02:32:44.512Z",
          "id": "aa51132e-72b0-415e-9e45-6794b357b503",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "halal",
          "title": "Prayer Mat",
          "_updated_date": "2023-09-29T02:32:44.512Z"
        },
        {
          "amenity_id": "00a28508-c62b-4416-96ce-e3ae1b656b85",
          "product_id": "23ec58fe-2d95-4d9f-928b-f0f7028a12d1",
          "_created_date": "2023-09-29T02:32:52.578Z",
          "id": "00a28508-c62b-4416-96ce-e3ae1b656b85",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "halal",
          "title": "Qibla Direction Signage",
          "_updated_date": "2023-09-29T02:32:52.578Z"
        },
        {
          "amenity_id": "f6084020-b73b-4b2e-aaa7-831c7963748c",
          "product_id": "23ec58fe-2d95-4d9f-928b-f0f7028a12d1",
          "_created_date": "2023-09-29T02:31:52.116Z",
          "id": "f6084020-b73b-4b2e-aaa7-831c7963748c",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "regular",
          "title": "Television",
          "_updated_date": "2023-09-29T02:31:52.116Z"
        },
        {
          "amenity_id": "f0e70ddb-c220-4619-a480-35d8e91f90be",
          "product_id": "23ec58fe-2d95-4d9f-928b-f0f7028a12d1",
          "_created_date": "2023-09-29T02:31:59.546Z",
          "id": "f0e70ddb-c220-4619-a480-35d8e91f90be",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "regular",
          "title": "Mini Fridge",
          "_updated_date": "2023-09-29T02:31:59.546Z"
        },
        {
          "amenity_id": "4a855f1d-37fa-45e7-915a-038c90135e59",
          "product_id": "23ec58fe-2d95-4d9f-928b-f0f7028a12d1",
          "_created_date": "2023-09-29T02:32:06.977Z",
          "id": "4a855f1d-37fa-45e7-915a-038c90135e59",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "regular",
          "title": "Air Conditioning",
          "_updated_date": "2023-09-29T02:32:06.977Z"
        },
        {
          "amenity_id": "c8145160-5450-4925-981f-be81008783d7",
          "product_id": "23ec58fe-2d95-4d9f-928b-f0f7028a12d1",
          "_created_date": "2023-09-29T02:32:18.257Z",
          "id": "c8145160-5450-4925-981f-be81008783d7",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "regular",
          "title": "Hairdryer",
          "_updated_date": "2023-09-29T02:32:18.257Z"
        }
      ],
      "pictures": [
        {
          "id": "3868c4b9-c9e9-4497-911c-3f56572244ea",
          "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/products%2F23ec58fe-2d95-4d9f-928b-f0f7028a12d1%2Fpicture-cb715fd7-978b-4c50-851e-f6c89d828587?alt=media&token=bd747d61-cd5e-4eb8-9390-99f2b97aa677",
          "title": "room3.jpg",
          "description": "-"
        },
        {
          "id": "0f2f06f5-902f-4955-a456-a3ecf4ce36ca",
          "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/products%2F23ec58fe-2d95-4d9f-928b-f0f7028a12d1%2Fpicture-03569343-5764-478b-b1aa-2c050a920c2f?alt=media&token=1e5f5a89-c7c0-4824-a4c9-6891b12ff6f7",
          "title": "bathroom.jpeg",
          "description": "-"
        }
      ],
      "client": {
        "id": "b822acae-dd55-4305-a892-534a01cc0165",
        "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
        "owner_id": "fbac7945-941a-4cb8-b92c-64405ae1431b",
        "approved_by": "a9411808-18aa-4adf-8009-7c2bede481a4",
        "name": "Fahru LTD",
        "email": "fahrustack@gmail.com",
        "phone": "(+62) 877-2192-6278",
        "npwp": "66.666.666.6-666.666",
        "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/clients%2Fb822acae-dd55-4305-a892-534a01cc0165%2Fpicture?alt=media&token=c0ca3ed2-3bbf-41fb-9b58-f99c5c1f000b",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet euismod quam, vitae feugiat tellus fermentum non.",
        "_created_date": "2023-10-16T16:04:39.148Z",
        "_updated_date": "2023-11-24T06:38:19.429Z",
        "title": "hotel"
      }
    },
    {
      "id": "a1fca1c5-68ef-4e2b-ba55-55de4dd1ca60",
      "client_id": "eb417dbb-a7d3-45b2-ad72-758c4da7bf65",
      "title": "Standard Room",
      "description": "A comfortable standard room perfect for a relaxing stay.",
      "availability": true,
      "price": "900000",
      "units": "night",
      "_created_date": "2023-11-02T06:03:30.456Z",
      "_updated_date": "2023-11-02T06:37:44.694Z",
      "type": "hotel",
      "items": [
        {
          "id": "02c75932-5d1f-410d-94f2-5a326bb8de88",
          "title": "S-4"
        },
        {
          "id": "deaa4fc4-1e28-4363-975c-b5a28d0b6c01",
          "title": "S-5"
        },
        {
          "id": "99f51a0a-1fbf-474d-91a4-ba849d9619b2",
          "title": "S-6"
        },
        {
          "id": "3f707205-83a7-4a59-959c-cce818817cb9",
          "title": "S-7"
        },
        {
          "id": "a9172750-69f0-4a62-a9c2-ce420f592d26",
          "title": "S-3"
        }
      ],
      "details": [
        {
          "id": "ea594391-5dc9-4ea1-b963-ddf9291cd648",
          "title": "Guests",
          "amount": "2"
        },
        {
          "id": "c0a29999-9939-4d7b-8d98-c0cb054d1702",
          "title": "King Bed",
          "amount": "2"
        }
      ],
      "amenities": [
        {
          "amenity_id": "f6084020-b73b-4b2e-aaa7-831c7963748c",
          "product_id": "a1fca1c5-68ef-4e2b-ba55-55de4dd1ca60",
          "_created_date": "2023-09-29T02:31:52.116Z",
          "id": "f6084020-b73b-4b2e-aaa7-831c7963748c",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "regular",
          "title": "Television",
          "_updated_date": "2023-09-29T02:31:52.116Z"
        },
        {
          "amenity_id": "4a855f1d-37fa-45e7-915a-038c90135e59",
          "product_id": "a1fca1c5-68ef-4e2b-ba55-55de4dd1ca60",
          "_created_date": "2023-09-29T02:32:06.977Z",
          "id": "4a855f1d-37fa-45e7-915a-038c90135e59",
          "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
          "category": "regular",
          "title": "Air Conditioning",
          "_updated_date": "2023-09-29T02:32:06.977Z"
        }
      ],
      "pictures": [
        {
          "id": "dee55165-7408-4c0f-ac42-af47c461db43",
          "picture": "https://firebasestorage.googleapis.com/v0/b/lombok-halal-room-sandbox.appspot.com/o/admin%2F7328a9d5-b6f4-427d-af6b-71daea5dc32b?alt=media&token=75904f7e-f347-4272-ac11-9e799fbdf770",
          "title": "room type image",
          "description": "room type image"
        }
      ],
      "client": {
        "id": "eb417dbb-a7d3-45b2-ad72-758c4da7bf65",
        "type_id": "95d9abd9-b21e-4213-802b-1e2cfffc6ec0",
        "owner_id": "244281db-014c-4084-84b8-3357016954fc",
        "approved_by": "a9411808-18aa-4adf-8009-7c2bede481a4",
        "name": "GrandLegiHotel",
        "email": "info@grandlegihotel.com",
        "phone": "+123456789",
        "npwp": "789-654-321",
        "picture": "https://example.com/grandlegihotel.jpg",
        "description": "Experience unparalleled luxury at Grand Legi Hotel, where comfort meets elegance. Located in the heart of the city, our hotel offers a perfect blend of modern amenities and traditional hospitality. Whether you're traveling for business or leisure, our spacious rooms, exquisite dining options, and state-of-the-art facilities ensure a memorable stay. Enjoy breathtaking views of the city skyline and indulge in a relaxing atmosphere that will rejuvenate your senses. Grand Legi Hotel is not just a hotel; it's a destination in itself.",
        "_created_date": "2023-09-15T02:58:05.791Z",
        "_updated_date": "2023-11-23T18:26:13.569Z",
        "title": "hotel"
      }
    }
  ]
}
```

### Get product by Id
Allows any users to retrieve detailed information about a product.
- Method: `GET`
- Path: `/products/{id}`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "total": 13,
    "count": 1,
    "pages": 1,
    "result": {
        "id": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
        "client_id": "374624e2-7f5a-428f-8b26-92ded2581f27",
        "title": "Standard Room",
        "description": "A comfortable standard room perfect for a relaxing stay.",
        "availability": true,
        "price": "900000",
        "units": "night",
        "_created_date": "2023-09-28T12:45:03.587Z",
        "_updated_date": "2023-09-28T12:45:03.587Z",
        "items": [
            {
                "id": "b52e2474-53c3-4c38-b997-61eb4d731e3d",
                "title": "Standard 1"
            },
            {
                "id": "55e42e61-84b6-4a26-9c18-26908b92f399",
                "title": "Standard 2"
            },
            {
                "id": "a9fcc1d4-4880-4774-97ed-f867093a0281",
                "title": "Standard 3"
            }
        ],
        "details": [
            {
                "id": "3088c623-dc89-4424-86ca-a916f1d1448b",
                "title": "Single Bed",
                "amount": "1"
            },
            {
                "id": "68b6c624-a5d3-43ba-af83-d56ee7816480",
                "title": "Guests",
                "amount": "2"
            }
        ],
        "amenities": [
            {
                "amenity_id": "0ef924a0-437d-4646-81ef-e9b356c1da23",
                "product_id": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
                "_created_date": "2023-09-27T11:48:05.271Z",
                "id": "0ef924a0-437d-4646-81ef-e9b356c1da23",
                "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
                "category": "halal",
                "title": "Qibla Direction",
                "_updated_date": "2023-09-27T11:48:05.271Z"
            },
            {
                "amenity_id": "eeaaa843-856a-4d14-91a1-26f25d52f985",
                "product_id": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
                "_created_date": "2023-09-27T12:18:45.203Z",
                "id": "eeaaa843-856a-4d14-91a1-26f25d52f985",
                "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
                "category": "halal",
                "title": "Prayer Mats",
                "_updated_date": "2023-09-27T12:18:45.203Z"
            },
            {
                "amenity_id": "b8e51cd2-5791-4d5e-a379-ca372ad2c8fe",
                "product_id": "fefb02f8-f410-496a-9b25-f8e1a10103d5",
                "_created_date": "2023-09-28T03:20:53.811Z",
                "id": "b8e51cd2-5791-4d5e-a379-ca372ad2c8fe",
                "type_id": "a3dfce96-6136-4b15-9d4c-83a7a55fc279",
                "category": "halal",
                "title": "Television",
                "_updated_date": "2023-09-28T03:20:53.811Z"
            }
        ],
        "pictures": [
            {
                "id": "a7e251c5-03d9-4d5c-8d12-e35d234a345e",
                "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
                "title": "Bedroom",
                "description": "Cozy Bedroom with 1 Queen-sized Bed"
            },
            {
                "id": "8b86a833-d5e8-4e01-9bc3-4865a9f6c7bb",
                "picture": "https://i.ibb.co/t4Y85qN/blank-profile-picture-973460-1280.png",
                "title": "Bathroom",
                "description": "Bathroom with Shower"
            }
        ],
        "policies": [
            {
                "policy_id": "2cdf9752-0831-443e-9e56-c4d08c76e916",
                "title": "Check-in",
                "category": "regular",
                "description": "Standard check-in time",
                "details": "From 15:00"
            },
            {
                "policy_id": "f3f5158b-9947-4b07-a334-51d466136a8c",
                "title": "Check-out",
                "category": "regular",
                "description": "Standard check-out time",
                "details": "From 12:00"
            }
        ],
        "client": {
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
            "title": "hotel"
        }
    }
}
```
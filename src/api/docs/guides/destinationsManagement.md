## Destinations Endpoints <!-- {docsify-ignore} -->

### Create a Destination
Allows the creation of a new destination with details such as title, description, category, address, geographical coordinates, city, province, and associated pictures. Requires authentication with a JWT token having the super-admin scope.
- Method: `POST`
- Path: `/destinations`
- Authentication: User Access Token (Bearer token)
- Request Body: 
```json
{
    "title": "Islamic Center Lombok",
    "description": "A prominent Islamic center in Lombok, serving as a place of worship and community activities.",
    "category": "Mosque",
    "address": "Jl. Udayana, Gomong, Kec. Selaparang, Kota Mataram, Nusa Tenggara Bar. 83125",
    "latitude": -8.57995266513888,
    "longitude": 116.10062165078462,
    "city": "Mataram",
    "province": "West Nusa Tenggara",
    "pictures": [
        "https://awsimages.detik.net.id/community/media/visual/2020/05/08/d5258a79-c83e-42ce-8d69-abca0e48f346_169.jpeg?w=1200",
        "https://sohib.indonesiabaik.id/thumbnail/article-lg/articles/2023/05/30/megahnya-masjid-islamic-center-mataram-kl89zTngHb.jpg",
        "https://yourtrip.id/wp-content/uploads/2022/07/Kemegahan-Islamic-Center-Mataram.jpg"
    ]
}
```
- Response Code: `201 OK`
- Response Body:
```json
{
    "status": true,
    "message": "Destination added successfully",
    "result": {
        "id": "6670c816-42e6-408b-be0d-323dfe7b0033",
        "title": "Islamic Center Lombok",
        "description": "A prominent Islamic center in Lombok, serving as a place of worship and community activities.",
        "category": "Mosque",
        "address": "Jl. Udayana, Gomong, Kec. Selaparang, Kota Mataram, Nusa Tenggara Bar. 83125",
        "coordinate": "0101000020E6100000EDD8CA9570065D40C2FF438EEF2821C0",
        "city": "Mataram",
        "province": "West Nusa Tenggara",
        "_created_date": "2023-11-30T08:06:08.317Z",
        "_updated_date": "2023-11-30T08:06:08.317Z",
        "pictures": [
            {
                "id": "27929492-7603-4a54-b85a-3093629b4ec5",
                "destination_id": "6670c816-42e6-408b-be0d-323dfe7b0033",
                "picture": "https://awsimages.detik.net.id/community/media/visual/2020/05/08/d5258a79-c83e-42ce-8d69-abca0e48f346_169.jpeg?w=1200",
                "_created_date": "2023-11-30T08:06:08.352Z"
            },
            {
                "id": "56a45b41-5881-4d1c-bbb7-b69e94f42b01",
                "destination_id": "6670c816-42e6-408b-be0d-323dfe7b0033",
                "picture": "https://sohib.indonesiabaik.id/thumbnail/article-lg/articles/2023/05/30/megahnya-masjid-islamic-center-mataram-kl89zTngHb.jpg",
                "_created_date": "2023-11-30T08:06:08.352Z"
            },
            {
                "id": "3341a608-862c-4bae-848c-3408e9e252f1",
                "destination_id": "6670c816-42e6-408b-be0d-323dfe7b0033",
                "picture": "https://yourtrip.id/wp-content/uploads/2022/07/Kemegahan-Islamic-Center-Mataram.jpg",
                "_created_date": "2023-11-30T08:06:08.352Z"
            }
        ]
    }
}
```
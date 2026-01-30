## Destinations Endpoints <!-- {docsify-ignore} -->

### Get Destination Categories
Retrieves a list of distinct destination categories available in the system. 
- Method: `GET`
- Path: `/destinations/categories`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        "Mosque",
        "Restaurant"
    ]
}
```

### Get Destinations
Retrieves a list of destinations based on optional filters such as category, city, and geographical location (latitude and longitude).
- Method: `GET`
- Path: `/destinations`
- Query Parameters:
    - `category` (optional): Filter by destination category
    - `city` (optional): Filter by destination city
    - `latitude` and `longitude` (optional): Get the nearest destination within 10Km Radius.
- Example: 
```bash
GET base-url/destinations?city=Pujut&category=Restaurant
```
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
    "result": [
        {
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
            "longitude": 116.10062165078462,
            "latitude": -8.57995266513888,
            "picture": "https://sohib.indonesiabaik.id/thumbnail/article-lg/articles/2023/05/30/megahnya-masjid-islamic-center-mataram-kl89zTngHb.jpg"
        },
        {
            "id": "a708f31c-5f7e-43c9-b2f0-99eaaf82b0e0",
            "title": "Lalo Restaurant - Mandalika",
            "description": "Set against a backdrop of the Indian Ocean, with al fresco and elegant outdoor seating, such is its reputation, the mere mention of Lalo Restaurant Truntum Boutique Mandalika, Lombok is enough to launch culinary aficionados into overtures of whole-hearted praise. Offering an exceptional outdoor dining experience backed by wine menu and unrivalled service, simply put, be it the daily à la carte menu or its famed Sunday Brunch, Lalo Restaurant sets the standard.",
            "category": "Restaurant",
            "address": "Jl. Tj. Ocean View, Sukadana, Kec. Pujut, Kabupaten Lombok Tengah, Nusa Tenggara Bar. 83573",
            "coordinate": "0101000020E6100000F3D3A47C4A145D40C0FE9C61E5C821C0",
            "city": "Pujut",
            "province": "West Nusa Tenggara",
            "_created_date": "2023-11-30T08:33:10.564Z",
            "_updated_date": "2023-11-30T08:33:10.564Z",
            "longitude": 116.31704631897428,
            "latitude": -8.892375040449565,
            "picture": "https://cms.hig.id//upload/cms/Resto5.jpg"
        }
    ]
}
```

### Get Destination by ID
Retrieves details of a destination specified by its unique ID. Requires the ID of the destination as a path parameter. 
- Method: `GET`
- Path: `/destinations/{id}`
- Response Code: `200 OK`
- Response Body:
```json
{
    "status": true,
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
        "longitude": 116.10062165078462,
        "latitude": -8.57995266513888,
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
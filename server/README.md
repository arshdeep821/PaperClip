# List of End points that have been created so far

-   GET http://localhost:3001/test
    For testing server connection

## USERS

-   POST http://localhost:3001/users (CREATE USER)

```bash
Example Body
{
    "username": "Arshdeep_is_Awesome",
	"name": "Arshdeep",
    "password": "password123",
    "city": "Vancouver",
	"country": "Canada"
}

Example of what gets returned
{
    "_id": "68510d80587ba5eebf9c2e0d",
    "username": "Sony123",
	"name": "Sony",
    "city": "Vancouver",
	"country": "Canada",
    "tradingRadius": 10,
    "inventory": [],
    "createdAt": "2025-06-17T06:38:56.679Z"
}
```

-   POST http://localhost:3001/users/login

```bash
Example Body
{
    "username": "Arshdeep_is_Awesome",
    "password": "password123",
}

Example of what gets returned
{
    "_id": "68510d80587ba5eebf9c2e0d",
    "username": "Sony123",
	"name": "Sony",
    "city": "Vancouver",
	"country": "Canada",
    "tradingRadius": 10,
    "inventory": [],
    "createdAt": "2025-06-17T06:38:56.679Z"
}
```

-   GET http://localhost:3001/users/:id (GET USER)

```bash
Example of what gets returned

{
    "_id": "6850dfc4e36623cf51dff709",
    "username": "Simar",
    "location": "Vancouver",
    "tradingRadius": 10,
    "inventory": [],
    "createdAt": "2025-06-17T03:23:48.644Z",
    "updatedAt": "2025-06-17T06:37:36.908Z",
    "__v": 18
}

or

{
    "_id": "6850dfc4e36623cf51dff709",
    "username": "Simar",
    "location": "Vancouver",
    "tradingRadius": 10,
    "inventory": [
        {
            "_id": "68510eb2587ba5eebf9c2e11",
            "name": "iPhone 15",
            "description": "iPhone 15 pro with 16GB ram",
            "category": "6850e027e36623cf51dff70c",
            "owner": "6850dfc4e36623cf51dff709",
            "condition": "New",
            "imagePath": "./public/1750142642494-55253357.jpg",
            "createdAt": "2025-06-17T06:44:02.532Z",
            "updatedAt": "2025-06-17T06:44:02.532Z",
            "__v": 0
        }
    ],
    "createdAt": "2025-06-17T03:23:48.644Z",
    "updatedAt": "2025-06-17T06:44:02.534Z",
    "__v": 19
}
```

## CATEGORIES

-   POST http://localhost:3001/categories (CREATE CATEGORY)

```bash
Example Body
{
    "name": "Technology"
}

Example of what gets returned

{
    "name": "Technology",
    "_id": "6850e039e36623cf51dff70f",
    "createdAt": "2025-06-17T03:25:45.571Z",
    "updatedAt": "2025-06-17T03:25:45.571Z",
    "__v": 0
}
```

-   GET http://localhost:3001/categories (GET ALL CATEGORIES)

```bash
Example of what gets returned

[
    {
        "_id": "6850e027e36623cf51dff70c",
        "name": "Clothes",
        "createdAt": "2025-06-17T03:25:27.243Z",
        "updatedAt": "2025-06-17T03:25:27.243Z",
        "__v": 0
    },
    {
        "_id": "6850e039e36623cf51dff70f",
        "name": "Technology",
        "createdAt": "2025-06-17T03:25:45.571Z",
        "updatedAt": "2025-06-17T03:25:45.571Z",
        "__v": 0
    }
]
```

## ITEMS

-   POST http://localhost:3001/items (CREATE ITEM)

Example body - Use formData on postman so you can attach files
![Body](./assets/createItem.png)

```bash
Example of what gets returned

{
    "name": "iPhone 15",
    "description": "iPhone 15 pro with 16GB ram",
    "category": "6850e027e36623cf51dff70c",
    "owner": "6850dfc4e36623cf51dff709",
    "condition": "New",
    "imagePath": "./public/1750142256850-324907369.jpg",
    "_id": "68510d30587ba5eebf9c2e03",
    "createdAt": "2025-06-17T06:37:36.900Z",
    "updatedAt": "2025-06-17T06:37:36.900Z",
    "__v": 0,
}
```

-   DELETE http://localhost:3001/items/:id (DELETE ITEM)

```bash
Example of what gets returned
{
    "message": "Item deleted successfully."
}
```

-   PATCH http://localhost:3001/items/:id (UPDATE ITEM)

Example body - Use formData on postman so you can attach files
![Body](./assets/updateItem.png)

```bash
Example of what gets returned

{
    "_id": "685115534fa25e0b72d4beab",
    "name": "iPhone 16",
    "description": "iphone 16 with 10 gb ram",
    "category": "6850e039e36623cf51dff70f",
    "owner": "6850dfc4e36623cf51dff709",
    "condition": "Used",
    "imagePath": "./public/1750144767004-243491146.png",
    "createdAt": "2025-06-17T07:12:19.767Z",
    "updatedAt": "2025-06-17T07:19:27.033Z",
    "__v": 0,
}
```

-   GET http://localhost:3001/items (GET ITEMS)

```bash
Example of what gets returned
[
    {
        "_id": "6855d1fbc45a5c67ff72729e",
        "name": "iPhone 15",
        "description": "Latest iPhone model in perfect condition",
        "category": {
            "_id": "6855d1fbc45a5c67ff727296",
            "name": "Electronics",
            "__v": 0,
            "createdAt": "2025-06-20T21:26:19.709Z",
            "updatedAt": "2025-06-20T21:26:19.709Z"
        },
        "owner": {
            "_id": "123456789012345678901234",
            "username": "Admin",
            "name": "Admin Name",
            "password": "$2b$10$ShVLu9k7WGuAxzx/gaiPDu.f1N1a/aJSlO/8YJfZXfLERqOF28xey",
            "city": "Vancouver",
            "country": "Canada",
            "tradingRadius": 10,
            "inventory": [
                "6855d1fbc45a5c67ff72729e",
                "6855d1fbc45a5c67ff72729f",
                "6855d1fbc45a5c67ff7272a0",
                "6855d1fbc45a5c67ff7272a1",
                "6855d1fbc45a5c67ff7272a2"
            ],
            "createdAt": "2025-06-20T21:26:19.718Z",
            "updatedAt": "2025-06-20T21:26:19.726Z",
            "__v": 0
        },
        "condition": "New",
        "imagePath": "iPhone.png",
        "__v": 0,
        "createdAt": "2025-06-20T21:26:19.723Z",
        "updatedAt": "2025-06-20T21:26:19.723Z"
    },
]
```

NEED TO BE ADDED

-   For User db schema
    GET http://localhost:3001/users

GET/DELETE/PATCH http://localhost:3001/users/:id

-   For Item db schema
    GET/POST http://localhost:3001/items

GET/DELETE/PATCH http://localhost:3001/items/:id

-   For Trades db schema
    GET/POST http://localhost:3001/trades

GET/DELETE/PATCH http://localhost:3001/items/:id

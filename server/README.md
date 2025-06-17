# List of End points that have been created so far

- GET http://localhost:3001/test
For testing server connection

## USERS
- POST http://localhost:3001/users
```bash
Example Body
{
    "username": "Arshdeep",
    "password": "password",
    "location": "Vancouver"
}
```

- GET http://localhost:3001/users/:id


## CATEGORIES
- POST http://localhost:3001/categories
```bash
Example Body
{
    "name": "Technology"
}
```

- GET http://localhost:3001/categories

## ITEMS 

- POST http://localhost:3001/items

Example body - Use formData on postman so you can attach files
[Body](./assets/createItem.png)

NEED TO BE ADDED

- For User db schema
GET http://localhost:3001/users

GET/DELETE/PATCH http://localhost:3001/users/:id

- For Item db schema
GET/POST http://localhost:3001/items

GET/DELETE/PATCH http://localhost:3001/items/:id

- For Trades db schema
GET/POST http://localhost:3001/trades

GET/DELETE/PATCH http://localhost:3001/items/:id
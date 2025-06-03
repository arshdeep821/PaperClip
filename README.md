# Project Setup and Running Instructions

## Client Setup

To run the client application, follow these steps:

1. Navigate to the client directory:

```bash
cd client
```

2. Build the docker image:

```bash
docker build -t client .
```

3. Start the development server:

```bash
docker run -p 3000:3000 client 
```

The application should now be running on your local development server.
http://localhost:3000/

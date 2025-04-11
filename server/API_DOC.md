# API Documentation

## Endpoints

### 1. **Users**

#### Login a User

- **URL**: `/login`
- **Method**: `POST`
- **Description**: Logs in a user using a Google ID token.
- **Request Body**:
  ```json
  {
    "token": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "access_token": "string",
      "id": "integer"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Invalid token"
    }
    ```

---

### 2. **Collections**

#### Create a New Collection

- **URL**: `/collections`
- **Method**: `POST`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Request Body**:
  ```json
  {
    "name": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "id": "integer",
      "name": "string",
      "userId": "integer",
      "coverImage": "string | null",
      "createdAt": "string",
      "updatedAt": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "User not found"
    }
    ```

#### Get All Collections for a User

- **URL**: `/collections`
- **Method**: `GET`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "id": "integer",
        "name": "string",
        "userId": "integer",
        "coverImage": "string | null",
        "Entries": []
      }
    ]
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "User not found"
    }
    ```

#### Update Cover Image for a Collection

- **URL**: `/collections/:collectionId/cover`
- **Method**: `PATCH`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>",
    "Content-Type": "multipart/form-data"
  }
  ```
- **Request Body**:
  - `coverImage`: File (image)
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Collection not found"
    }
    ```

---

### 3. **Entries**

#### Create a New Entry

- **URL**: `/entries`
- **Method**: `POST`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Request Body**:
  ```json
  {
    "type": "anime | manga",
    "progress": "integer",
    "completed": "boolean",
    "collectionId": "integer",
    "jikanId": "integer"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "id": "integer",
      "title": "string",
      "type": "anime | manga",
      "progress": "integer",
      "completed": "boolean",
      "collectionId": "integer",
      "jikanId": "integer",
      "createdAt": "string",
      "updatedAt": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Collection not found"
    }
    ```

#### Get All Entries for a Collection

- **URL**: `/collections/:collectionId`
- **Method**: `GET`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "id": "integer",
        "title": "string",
        "type": "anime | manga",
        "progress": "integer",
        "completed": "boolean",
        "collectionId": "integer",
        "jikanId": "integer"
      }
    ]
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Collection not found"
    }
    ```

#### Update an Entry

- **URL**: `/entries/:collectionId/:entryId`
- **Method**: `PUT`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Request Body**:
  ```json
  {
    "progress": "integer",
    "completed": "boolean"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": "integer",
      "title": "string",
      "type": "anime | manga",
      "progress": "integer",
      "completed": "boolean",
      "collectionId": "integer",
      "jikanId": "integer",
      "createdAt": "string",
      "updatedAt": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Entry not found"
    }
    ```

#### Delete an Entry

- **URL**: `/entries/:collectionId/:entryId`
- **Method**: `DELETE`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Entry deleted"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Entry not found"
    }
    ```

---

### 4. **Recommendations**

#### Get Recommendations for a Collection

- **URL**: `/collections/:collectionId/recommendations`
- **Method**: `GET`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "result": [
        {
          "title": "string",
          "type": "anime | manga"
        }
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Collection not found"
    }
    ```

---

### 5. **Anime**

#### Get Anime Recommendations

- **URL**: `/animes`
- **Method**: `GET`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Query Parameters**:
  - `q` (optional): Search query.
  - `page` (optional): Page number.
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "entry": []
        }
      ],
      "pagination": "object"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Internal server error"
    }
    ```

#### Get Anime Details

- **URL**: `/animes/:id`
- **Method**: `GET`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": "object"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Anime not found"
    }
    ```

---

### 6. **Manga**

#### Get Manga Recommendations

- **URL**: `/mangas`
- **Method**: `GET`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Query Parameters**:
  - `q` (optional): Search query.
  - `page` (optional): Page number.
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "entry": []
        }
      ],
      "pagination": "object"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Internal server error"
    }
    ```

#### Get Manga Details

- **URL**: `/mangas/:id`
- **Method**: `GET`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": "object"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Manga not found"
    }
    ```

---

### Error Handling

- **401 Unauthorized**:
  ```json
  {
    "message": "Authentication failed"
  }
  ```
- **500 Internal Server Error**:
  ```json
  {
    "message": "Internal server error"
  }
  ```

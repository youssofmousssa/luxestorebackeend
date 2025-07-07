# LuxeStore Backend Endpoint Status

For each endpoint, see if it works and how to call it (with parameters example).

---

## Auth Endpoints

### POST /api/auth/register
- **Status:** Working
- **Parameters:**
  - email (string, required)
  - password (string, required)
  - name (string, required)
- **Example:**
curl --location 'http://localhost:5000/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "YourPassword123$",
  "name": "John Doe"
}'

### POST /api/auth/login
- **Status:** Working
- **Parameters:**
  - email (string, required)
  - password (string, required)
- **Example:**
curl --location 'http://localhost:5000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "YourPassword123$"
}'

### POST /api/auth/logout
- **Status:** Working
- **Headers:**
  - Authorization: Bearer <token>

---

## Product Endpoints

### GET /api/products
- **Status:** Working
- **Description:** Get all products

### GET /api/products/:id
- **Status:** Working
- **Description:** Get product by ID

### POST /api/products
- **Status:** Working (Admin only)
- **Headers:**
  - Authorization: Bearer <admin_token>
- **Body:**
  - name (string, required)
  - price (number, required)
  - description (string, optional)
  - sizes (array, optional)
  - colors (array, optional)
  - imageURL (string, optional)
  - stockQty (number, optional)
  - category (string, optional)

### PUT /api/products/:id
- **Status:** Working (Admin only)
- **Headers:**
  - Authorization: Bearer <admin_token>
- **Body:** Any product fields to update

### DELETE /api/products/:id
- **Status:** Working (Admin only)
- **Headers:**
  - Authorization: Bearer <admin_token>

---

## Order Endpoints

### POST /api/orders
- **Status:** Working (Authenticated)
- **Headers:**
  - Authorization: Bearer <token>
- **Body:**
  - items (array, required)
  - amount (number, required)
  - status (string, optional)
  - paymentIntentId (string, optional)

### GET /api/orders/:id
- **Status:** Working (Owner or Admin)
- **Headers:**
  - Authorization: Bearer <token>

### GET /api/orders/user/:userId
- **Status:** Working (Owner or Admin)
- **Headers:**
  - Authorization: Bearer <token>

### GET /api/orders
- **Status:** Working (Admin only)
- **Headers:**
  - Authorization: Bearer <admin_token>

### POST /api/cart
- **Status:** Working (Authenticated)
- **Headers:**
  - Authorization: Bearer <token>
- **Body:**
  - items (array, required)

### POST /api/checkout
- **Status:** Working
- **Body:**
  - amount (number, required)
  - currency (string, optional, default 'usd')
  - metadata (object, optional)

---

## Review Endpoints

### POST /api/reviews
- **Status:** Working (Authenticated)
- **Headers:**
  - Authorization: Bearer <token>
- **Body:**
  - productId (number, required)
  - rating (number, required, 1-5)
  - comment (string, optional)

### GET /api/reviews/:productId
- **Status:** Working
- **Description:** Get all reviews for a product

---

## Upload Endpoint

### POST /api/upload/imgbb
- **Status:** Working (Authenticated)
- **Headers:**
  - Authorization: Bearer <token>
- **Body:**
  - base64Image (string, required)

---

# Notes
- All endpoints requiring authentication need the `Authorization: Bearer <token>` header.
- Admin endpoints require a user with `role: "admin"` in the database.
- Registration always creates a regular user (`role: "user"`). To make an admin, update the DB manually.

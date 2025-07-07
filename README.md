# LuxeStore Backend with SQLite

## Overview

This backend is built with Node.js and Express.js, using SQLite as local relational DB.
Integrates:

- SQLite for database (persistent, file-based)
- Stripe for payments
- ImgBB for image uploads
- JWT authentication with bcrypt password hashing

## Setup

1. Copy `.env.example` to `.env` and supply values:


2. Install dependencies:

```bash
npm install express cors helmet dotenv sqlite3 sqlite @stripe/stripe-js stripe jsonwebtoken bcryptjs node-fetch
```

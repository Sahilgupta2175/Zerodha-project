# Zerodha API Documentation

## Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Holdings Endpoints](#holdings-endpoints)
  - [Orders Endpoints](#orders-endpoints)
  - [Positions Endpoints](#positions-endpoints)
  - [Sample Data Endpoints](#sample-data-endpoints)
- [Data Models](#data-models)
- [Environment Variables](#environment-variables)
- [CORS Configuration](#cors-configuration)

## Overview

This is the backend API for a Zerodha Clone trading platform. The API provides functionality for user authentication, managing holdings, placing orders, and viewing positions.

**Technology Stack:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS enabled for cross-origin requests

## Base URL

### Production
```
https://zerodha-backend-sg.vercel.app
```

### Development
```
http://localhost:8080
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are stored in cookies and can also be passed via headers.

### Cookie-based Authentication
- Token is stored in `token` cookie
- Cookie is set with `httpOnly: false` and `withCredentials: true`

### Header-based Authentication
- Send token in `Authorization` header as: `Bearer <token>`

## Error Handling

All endpoints return JSON responses with the following structure:

### Success Response
```json
{
  "message": "Success message",
  "success": true,
  "data": {} // Optional data
}
```

### Error Response
```json
{
  "message": "Error description",
  "success": false,
  "error": "Detailed error message" // Optional
}
```

## API Endpoints

### Health Check

#### Get Server Status
```http
GET /
```

**Description:** Returns server status and basic information.

**Response:**
```json
{
  "message": "Hi, I am root Route",
  "status": "Server is running",
  "env": {
    "PORT": 8080,
    "hasDbUrl": true,
    "hasTokenKey": true
  }
}
```

#### Health Check
```http
GET /health
```

**Description:** Returns server health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-08T10:30:00.000Z",
  "uptime": 3600.5
}
```

#### Database Connection Test
```http
GET /db-test
```

**Description:** Tests database connectivity.

**Response:**
```json
{
  "status": "OK",
  "database": {
    "state": "connected",
    "stateCode": 1,
    "hasUrl": true
  }
}
```

---

### Authentication Endpoints

#### User Signup
```http
POST /signup
```

**Description:** Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe",
  "createdAt": "2025-01-08T10:30:00.000Z"
}
```

**Required Fields:**
- `email` (string): User's email address
- `password` (string): User's password (will be hashed)
- `username` (string): Display name for the user
- `createdAt` (string): Account creation timestamp (optional)

**Success Response (201):**
```json
{
  "message": "User signed in successfully",
  "success": true,
  "user": {
    "_id": "60f7b2b5c4f5a2b3d4e5f6g7",
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "2025-01-08T10:30:00.000Z"
  }
}
```

**Error Responses:**
- **400:** Missing required fields
- **409:** User already exists
- **500:** Internal server error

#### User Login
```http
POST /login
```

**Description:** Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Required Fields:**
- `email` (string): User's email address
- `password` (string): User's password

**Success Response (200):**
```json
{
  "message": "User logged in successfully",
  "success": true
}
```

**Error Responses:**
- **400:** Missing email or password
- **404:** User not found
- **401:** Incorrect password
- **500:** Internal server error

#### Verify Token
```http
POST /verify
```

**Description:** Verify user authentication token.

**Authentication:** Required (token in cookie, header, or body)

**Request Body:**
```json
{
  "token": "jwt_token_here" // Optional if token is in cookie or header
}
```

**Success Response (200):**
```json
{
  "status": true,
  "user": "johndoe",
  "userId": "60f7b2b5c4f5a2b3d4e5f6g7",
  "email": "user@example.com"
}
```

**Error Response:**
```json
{
  "status": false,
  "message": "No token provided" // or "Invalid token" or "User not found"
}
```

---

### Holdings Endpoints

#### Get All Holdings
```http
GET /allHoldings
```

**Description:** Retrieve all user holdings.

**Response:**
```json
[
  {
    "_id": "60f7b2b5c4f5a2b3d4e5f6g7",
    "name": "RELIANCE",
    "qty": 10,
    "avg": 2450.50,
    "price": 2500.25,
    "net": "+2.03%",
    "day": "+1.25%"
  },
  {
    "_id": "60f7b2b5c4f5a2b3d4e5f6g8",
    "name": "TCS",
    "qty": 5,
    "avg": 3200.00,
    "price": 3180.75,
    "net": "-0.60%",
    "day": "-0.30%"
  }
]
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch holdings"
}
```

---

### Orders Endpoints

#### Place New Order
```http
POST /newOrder
```

**Description:** Place a new buy or sell order.

**Request Body:**
```json
{
  "name": "RELIANCE",
  "qty": "10",
  "price": "2500.25",
  "mode": "BUY"
}
```

**Required Fields:**
- `name` (string): Stock/instrument name
- `qty` (string/number): Quantity to buy/sell
- `price` (string/number): Price per unit
- `mode` (string): "BUY" or "SELL"

**Business Logic:**

**For BUY Orders:**
- Creates a new order record
- Updates existing holding if stock already owned (averages the price)
- Creates new holding if stock not owned

**For SELL Orders:**
- Creates a new order record
- Reduces quantity from existing holding
- Deletes holding if quantity becomes 0
- Returns error if insufficient holdings

**Success Response (201):**
```json
{
  "message": "Order placed successfully",
  "order": {
    "_id": "60f7b2b5c4f5a2b3d4e5f6g9",
    "name": "RELIANCE",
    "qty": 10,
    "price": 2500.25,
    "mode": "BUY"
  }
}
```

**Error Responses:**
- **400:** Insufficient holdings to sell
- **500:** Failed to place order

#### Get All Orders
```http
GET /allOrders
```

**Description:** Retrieve all user orders.

**Response:**
```json
[
  {
    "_id": "60f7b2b5c4f5a2b3d4e5f6g9",
    "name": "RELIANCE",
    "qty": 10,
    "price": 2500.25,
    "mode": "BUY"
  },
  {
    "_id": "60f7b2b5c4f5a2b3d4e5f6ga",
    "name": "TCS",
    "qty": 5,
    "price": 3200.00,
    "mode": "SELL"
  }
]
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch orders"
}
```

---

### Positions Endpoints

#### Get All Positions
```http
GET /allPositions
```

**Description:** Retrieve all user positions.

**Response:**
```json
[
  {
    "_id": "60f7b2b5c4f5a2b3d4e5f6gb",
    "product": "MIS",
    "name": "RELIANCE",
    "qty": 10,
    "avg": 2450.50,
    "price": 2500.25,
    "net": "+497.50",
    "day": "+1.25%",
    "isLoss": false
  }
]
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch positions"
}
```

---

### Sample Data Endpoints

#### Add Sample Holdings Data
```http
GET /addHoldings
```

**Description:** Populate database with sample holdings data for testing.

**Success Response:**
```
Holdings Sample Data added Successfully.
```

**Error Response (500):**
```json
{
  "error": "Failed to add holdings data"
}
```

#### Add Sample Positions Data
```http
GET /addPositions
```

**Description:** Populate database with sample positions data for testing.

**Success Response:**
```
Positions Sample Data added Successfully.
```

**Error Response (500):**
```json
{
  "error": "Failed to add positions data"
}
```

---

## Data Models

### User Model
```javascript
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password": "string (hashed with bcrypt)",
  "username": "string",
  "createdAt": "Date"
}
```

### Holdings Model
```javascript
{
  "_id": "ObjectId",
  "name": "string",      // Stock/instrument name
  "qty": "number",       // Quantity owned
  "avg": "number",       // Average purchase price
  "price": "number",     // Current market price
  "net": "string",       // Net profit/loss percentage
  "day": "string"        // Day's profit/loss percentage
}
```

### Orders Model
```javascript
{
  "_id": "ObjectId",
  "name": "string",      // Stock/instrument name
  "qty": "number",       // Quantity ordered
  "price": "number",     // Order price
  "mode": "string"       // "BUY" or "SELL"
}
```

### Positions Model
```javascript
{
  "_id": "ObjectId",
  "product": "string",   // Product type (e.g., "MIS", "CNC")
  "name": "string",      // Stock/instrument name
  "qty": "number",       // Position quantity
  "avg": "number",       // Average price
  "price": "number",     // Current price
  "net": "string",       // Net profit/loss amount
  "day": "string",       // Day's profit/loss percentage
  "isLoss": "boolean"    // Whether position is in loss
}
```

---

## Environment Variables

The following environment variables are required:

```bash
# Server Configuration
PORT=8080

# Database Configuration
ATLAS_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
TOKEN_KEY=your_jwt_secret_key_here

# Optional for development
NODE_ENV=production
```

### Environment Variable Descriptions:

- **PORT:** Server port number (defaults to 8080)
- **ATLAS_DB_URL:** MongoDB connection string
- **TOKEN_KEY:** Secret key for JWT token signing and verification

---

## CORS Configuration

The API is configured to accept requests from the following origins:

- `https://zerodha-dashboard-sg.vercel.app` (Dashboard Production)
- `https://zerodha-sg.vercel.app` (Frontend Production)
- `http://localhost:5173` (Vite Development Server)
- `http://localhost:3000` (React Development Server)

**CORS Settings:**
- `credentials: true` - Allows cookies to be sent
- Methods: `GET`, `POST`, `PUT`, `DELETE`
- Headers: `Content-Type`, `Authorization`

---

## Quick Start Guide

### 1. Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Environment variables configured

### 2. Installation
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```

### 4. Test the API
```bash
# Health check
curl http://localhost:8080/health

# Get holdings (requires authentication)
curl http://localhost:8080/allHoldings
```

### 5. Sample API Usage

**Sign Up:**
```bash
curl -X POST http://localhost:8080/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Place Order:**
```bash
curl -X POST http://localhost:8080/newOrder \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RELIANCE",
    "qty": "10",
    "price": "2500.25",
    "mode": "BUY"
  }'
```

---

## Support and Contact

For any questions or issues regarding this API:
- Create an issue in the GitHub repository
- Contact the development team

## Version Information

- **API Version:** 1.0.0
- **Last Updated:** January 2025
- **Compatibility:** Node.js 14+, MongoDB 4.4+

---

*This documentation covers all available endpoints and functionality of the Zerodha Clone API. Keep this document updated as new features are added.*

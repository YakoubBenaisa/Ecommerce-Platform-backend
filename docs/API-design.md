# E-commerce System API Design

## 1. API Architecture Overview

### Base URL Structure
```
https://ecommerce.com
```

### Authentication Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
```


### JWT Payload Structure
The payload includes user information and the associated storeId:


{
  "sub": "12345",                            // User ID (subject)
  "email": "user@example.com",               // User's email
  "storeId": "67890",                      // Associated store ID (null if not applicable)
  "iat": 1691376400,                        // Issued at time (Unix timestamp)
  "exp": 1691462800                         // Expiration time (Unix timestamp)
}

### Store Management API



```
GET    /api/v1/stores/{storeId}                 # Get store details and products
POST   /api/v1/stores                              # Create new store
PUT    /api/v1/stores                   # Update store
POST   /api/v1/stores/meta-integration  # Setup Meta integration
POST   /api/v1/stores/payment-setup     # Setup payment methods
```

### Product Management API


```
POST   /api/v1/products                      # Create product
GET    /api/v1/stores/{storeId}/products/{productId}          # Get product details
GET    /api/v1/stores/{storeId}/products          # Get products details
PUT    /api/v1/products/{productId}          # Update product
DELETE /api/v1/products/{productId}          # Delete product
PATCH  /api/v1/products/{productId}/inventory # Update inventory
POST   /api/v1/products/{productId}/images   # Upload images
```

### Category Management API

```
POST   /api/v1/stores/{storeId}/categories                    # Create category
GET    /api/v1/stores/{storeId}/categories                    # List categories
```

### Order Management API

```
POST   /api/v1/orders                                  # Create order
GET    /api/v1/orders/{orderId}                       # Get order details
GET    /api/v1/orders                # List store orders
PATCH  /api/v1/orders/{orderId}/status # Update order status
```





### Meta Integration API

```
POST   /api/v1/messenger/webhook                   # Handle Meta webhook
GET   /api/v1/messenger/webhook                   # verify webhook

```

### Customer Management API

```
POST   /api/v1/customers                                 # Create new customer
PUT   /api/v1/customers/{customerID}                                # update customer details
GET    /api/v1/customers                       # List store customers 
GET    /api/v1/customers/{customerID}                # Get customer details and orders
```


## 2. Query Parameters

Common query parameters for list endpoints:
```
page: number (default: 1)
limit: number (default: 20)
sort: string (e.g., "createdAt:desc")
filter: object (endpoint-specific filters)
```

Example product filtering:
```
GET /api/v1/stores/{storeId}/products?
    category=cat_123&
    minPrice=1000&
    maxPrice=2000&
    search=keyword
```

## 3. Error Responses

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": ["error message"]
    }
  }
}
```

## 4. Headers

Required headers for all requests:
```
Authorization: Bearer <token>
Accept: application/json
Content-Type: application/json
```



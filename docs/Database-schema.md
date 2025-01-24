## Full Database Schema
## Entity-Relationship Diagram :

![ERD](ERD.png)

### Users Table
```markdown
- `id`: UUID (Primary Key)
- `email`: VARCHAR
- `password_hash`: VARCHAR
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
```

### Stores Table
```markdown
- `id`: UUID (Primary Key)
- `name`: VARCHAR
- `description`: TEXT
- `owner_id`: UUID  UNIQUE (Foreign Key to Users)
- `meta_integration_status`: BOOLEAN
- `payment_setup_status`: BOOLEAN
```

### Products Table
```markdown
- `id`: UUID (Primary Key)
- `store_id`: UUID (Foreign Key to Stores)
- `name`: VARCHAR
- `description`: TEXT
- `price`: DECIMAL
- `category_id`: UUID (Foreign Key to Categories)
- `inventory_count`: INTEGER
- `images`: JSON (array of image URLs or paths)
```

### Categories Table
```markdown
- `id`: UUID (Primary Key)
- `store_id`: UUID (Foreign Key to Stores)
- `name`: VARCHAR
```

### Orders Table
```markdown
- `id`: UUID (Primary Key)
- `store_id`: UUID (Foreign Key to Stores)
- `customer_id`: UUID (Foreign Key to Customers)
- `total_amount`: DECIMAL
- `status`: ENUM 
  - 'pending'
  - 'processing'
  - 'shipped'
  - 'delivered'
  - 'cancelled'
- `payment_method`: ENUM
  - 'baridi_mob'
  - 'cash_on_delivery'
- `order_source`: ENUM ('messenger', 'platform', 'in-store') (Default: 'platform')
- `customer_messenger_id`: VARCHAR
- `adress`: JSON
```

### Order_Items Table
```markdown
- `id`: UUID (Primary Key)
- `order_id`: UUID (Foreign Key to Orders)
- `product_id`: UUID (Foreign Key to Products)
- `quantity`: INTEGER
- `unit_price`: DECIMAL
```

### Customers Table
```markdown
- `id`: UUID (Primary Key)
- `name`: VARCHAR
- `email`: VARCHAR
- `phone`: VARCHAR
- `store_id`: UUID (Foreign Key to Stores)
```



### Payments Table
```markdown
- `id`: UUID (Primary Key)
- `order_id`: UUID UNIQUE (Foreign Key to Orders)
- `amount`: DECIMAL
- `payment_method`: ENUM 
  - 'baridi_mob'
  - 'cash_on_delivery'
- `status`: ENUM 
  - 'pending'
  - 'successful' 
  - 'failed'
- `gateway_response`: JSON
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
```


### Meta_Integration Table
```markdown
- `id`: UUID (Primary Key)
- `store_id`: UUID UNIQUE (Foreign Key to Stores)
- `page_id`: VARCHAR
- `app_id`: VARCHAR
- `access_token`: VARCHAR
- `webhook_verify_token`: VARCHAR
- `integration_status`: ENUM
  - 'live_mode'
  - 'development_mode'
- 'webhook_token': VARCHAR
- 'webhook_port': INTEGER
- 'webhook_url': VARCHAR
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
```

### Chargili_Account Table
```markdown
- `id`: UUID (Primary Key)
- `store_id`: UUID UNIQUE (Foreign Key to Stores)
- `SECRET_KEY` : VARCHAR
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
```



## Relationships

### One-to-One Relationships:
1. `Stores.owner_id` → `Users.id`: Each store has a unique owner.
2. `Payments.order_id` → `Orders.id`: Each payment corresponds to a unique order.
3. `Meta_Integration.store_id` → `Stores.id`: Each store has one Meta integration.
4. `Chargili_Account.store_id` → `Stores.id`: Each store has one Chargili account.

### One-to-Many Relationships:
1. `Stores.id` → `Products.store_id`: A store can have multiple products.
2. `Stores.id` → `Categories.store_id`: A store can have multiple categories.
3. `Stores.id` → `Orders.store_id`: A store can have multiple orders.
4. `Stores.id` → `Customers.store_id`: A store can have multiple customers.

5. `Categories.id` → `Products.category_id`: A category can include multiple products.

### Many-to-Many Relationships:
1. **Products and Orders**: 
   - **Through Order_Items**: Products can appear in multiple orders, and orders can contain multiple products. This relationship is managed via the `Order_Items` table, which connects the **Products** and **Orders** tables.
   
# ShopSphere

## 1. Project Overview

ShopSphere is a full-stack e-commerce web application built to provide a complete online shopping experience with separate role-based interfaces for Customers, Employees, and Administrators.

The application supports product browsing, cart and wishlist management, checkout, mock payments, order management, product management, employee management, and customer management.

---

## 2. Features

### Customer

* Registration and login
* Browse products
* Product details
* Category and brand browsing
* Shopping cart
* Wishlist
* Product reviews
* Checkout
* Mock payment options
* Order placement
* Order history
* Customer dashboard
* Profile management

### Employee

* Employee login
* Employee dashboard
* Product CRUD operations
* Add and edit products
* Product image upload
* Product status management
* Order management

### Administrator

* Admin login
* Admin dashboard
* Employee management
* Customer management
* Product and catalog management
* Category and brand management
* Order management
* Activate/deactivate employee accounts

---

## 3. Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* Axios
* React Router
* Lucide React

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* JWT
* Maven

### Database

* PostgreSQL

### Tools

* IntelliJ IDEA
* Visual Studio Code
* Git
* GitHub
* Postman

---

## 4. Architecture

ShopSphere follows a layered full-stack architecture.

```text
ShopSphere
│
├── Frontend
│   ├── React.js
│   ├── Components
│   ├── Pages
│   ├── Context
│   └── API Services
│
└── Backend
    ├── Controllers
    ├── Services
    ├── Repositories
    ├── Entities
    ├── Security
    └── PostgreSQL Database
```

The frontend communicates with the Spring Boot backend through REST APIs.

---

## 5. Authentication & Roles

ShopSphere uses JWT-based authentication and role-based access control.

### Customer

* Register and log in
* Browse products
* Manage cart and wishlist
* Place orders
* View orders
* Manage profile

### Employee

* Log in through the employee portal
* Manage products
* Upload product images
* Manage orders

### Administrator

* Manage employees
* Manage customers
* Manage products
* Manage categories and brands
* Manage orders
* Access administrative dashboards

---

## 6. Payment & Orders

ShopSphere includes a mock payment system for demonstration purposes.

No real financial transactions are processed.

### Supported Payment Methods

* CARD
* UPI
* NETBANKING
* COD

The order system manages:

* Order number
* Customer details
* Order items
* Total amount
* Shipping charges
* Payment method
* Payment status
* Order status
* Shipping address
* Order date

---

## 7. Project Structure

```text
ShopSphere/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/shopsphere/backend/
│   │       │       ├── config/
│   │       │       ├── controller/
│   │       │       ├── dto/
│   │       │       ├── entity/
│   │       │       ├── enums/
│   │       │       ├── exception/
│   │       │       ├── repository/
│   │       │       ├── security/
│   │       │       ├── service/
│   │       │       └── service/impl/
│   │       │
│   │       └── resources/
│   │
│   ├── uploads/
│   ├── .env.example
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   └── employee/
│   │   └── utils/
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

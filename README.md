
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
```

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

## Screenshots

### Home Page
<img width="1920" height="897" alt="Home" src="https://github.com/user-attachments/assets/c30c802a-db63-430c-b0fb-2de214c08a80" /> 

### Shop & Product Catalog
<img width="1920" height="902" alt="Shop" src="https://github.com/user-attachments/assets/7b367fbf-eef0-4666-aadb-1552ba2a8f60" />

### Product Search
<img width="1920" height="903" alt="Search" src="https://github.com/user-attachments/assets/26c33506-e181-470d-a394-36f82e045138" />

### Product Details
<img width="1920" height="913" alt="ProductDetails" src="https://github.com/user-attachments/assets/1fda4ba8-110d-46a3-9989-ac3f24a3d9cb" />

### Shopping Cart
<img width="1920" height="891" alt="Cart" src="https://github.com/user-attachments/assets/ecf13069-655a-47d2-b7ec-5bdc016aa7c8" />

### Checkout & Payment
<img width="1920" height="913" alt="Checkout" src="https://github.com/user-attachments/assets/ee801374-3abb-419e-8572-e0add1dd2a0e" />

### Order Success
<img width="1920" height="904" alt="OrderSuccess" src="https://github.com/user-attachments/assets/6204a77b-7123-4f50-ab59-71b2e85c550a" />

### Employee Dashboard
<img width="1920" height="904" alt="EmployeeOverView" src="https://github.com/user-attachments/assets/32b368e0-2683-45c9-b405-bcaa88c3b2c8" />

### Employee Product Management
<img width="1920" height="923" alt="EmployeeProduct" src="https://github.com/user-attachments/assets/0e3e1cb2-4e4a-4636-ac62-e737fa74e3e6" />

### Admin Dashboard
<img width="1920" height="918" alt="AdminOverview" src="https://github.com/user-attachments/assets/401d42a9-b715-49f6-8da4-e894b8715b9f" />



## 9. Prerequisites
````markdown
- Java 17+
- Node.js 18+
- PostgreSQL
- Maven
````
## 10. Environment Configuration

Configure the required database credentials and JWT secret using the provided `.env.example` and `application.properties.example` files.

## 11. Setup & Run

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Backend: `http://localhost:8086`
Frontend: `http://localhost:5173`

## 12. API Overview

REST APIs are provided for authentication, products, customers, cart, wishlist, orders, reviews, employees, admin management, and dashboards.

## 13. Security

* JWT authentication
* Role-based authorization
* Sensitive credentials excluded from Git

## 14. Future Improvements

* Real payment gateway
* Email notifications
* Advanced analytics
* Cloud image storage
* CI/CD deployment

## Author

**Pravalika**

GitHub: **PRAVALIKA-SHINY**


























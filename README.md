# 🧾 Inventory Management System

A simple and effective inventory management platform built with the MERN stack. It allows users to manage product stock, monitor low inventory, and maintain operational control with secure user roles.

---

## 🔐 Demo Login Credentials

| Role   | Email               | Password   |
|--------|---------------------|------------|
| Admin  | admin@example.com   | admin123   |
| User   | user@example.com    | user123    |

---

## 👥 User Roles & Access Control

- **Admin**
  - Full access to all features.
  - Can add new users to the system.
  - Can add, update, and delete products.
  - Can download the full product report in Excel format.

- **User**
  - Can view products.
  - Can search and check inventory.
  - **Cannot add/update/delete** products — actions are disabled for security.

> 🔐 Role-based restrictions ensure secure handling of inventory data.

---

## ✨ Key Features

### 📦 Product Management
- Add new products with category, SKU, quantity, and threshold.
- Edit existing product details.
- Delete products securely.

### 🔍 Smart Search
- Instantly search for products by name or SKU using the search bar.

### 🚨 Low Stock Alerts
- Products below their low stock threshold are auto-highlighted at the top with a red background.

### 📁 Excel Report Export
- Download the entire inventory data as an `.xlsx` file with one click.
- Includes detailed timestamps, quantity, and category info.

### 👥 Admin-Controlled User Management
- Only admins can add new users.
- Ensures the system is operated by trusted personnel only.

### 🔓 Authenticated Access
- Session-based login system with role-based access.
- Prevents unauthorized data manipulation.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT-based auth
- **Export**: SheetJS (xlsx), FileSaver.js

---

## 📌 How to Run Locally

```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev

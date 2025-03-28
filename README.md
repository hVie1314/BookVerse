# 📚 BookVerse - E-commerce Platform for Books

## Overview
This repository contains the source code and materials for **BookVerse**, an e-commerce platform for buying and reading books.  
Built with **Express handlebars**, **Node.js**, and **MongoDB**, BookVerse offers a seamless, secure, and user-friendly experience for book lovers.

## Team Information

### 🏫 University
- **University Name:** University of Science - VNUHCM.
- **Course:** Introduction to Software Engineering.
- **Group:** 02.
  
### 👥 Team Members

| Name     | Student ID  |
|-------------------------|------------|
| Dương Ngọc Kiều Trinh   | 22120389   |
| Nguyễn Đoàn Minh Uyên   | 22120421   |
| Nguyễn Phạm Tú Uyên     | 22120422   |
| Nguyễn Mạnh Văn         | 22120427   |
| Hoàng Quốc Việt         | 22120429   |

  ## Repository Structure
The repository is organized into the following main branches:

- **main**: The production-ready branch with the latest stable version of both frontend and backend.
- **develop**: The main development branch where all features are merged before being pushed to `main`.
- **feature/frontend**: Contains the frontend code, built with **ExpressJs handlebars** and **TailwindCSS**.
- **feature/backend**: Contains the backend code, built with **Node.js** and **Express.js**.

Feature branches are created under `feature/frontend` or `feature/backend` for specific functionalities before merging into their respective branches.

## Features
- 📖 **Wide range of books** – Browse and explore various categories.
- 🛒 **Shopping cart & checkout** – Secure and efficient payment processing.
- 🔍 **Smart search** – Quickly find books based on titles, authors, and genres.
- ✍️ **Reviews & comments** – Share your thoughts with the community.
- 🔐 **User authentication** – Secure sign-up, login, and account management.
- 🎟️ **Coupons & promotions** – Enjoy discounts and special offers.
- 📊 **Admin dashboard** – Manage books, users, and orders.
- 📈 **Statistics & reporting** – Gain insights into sales and user engagement.

## Getting Started
Follow these steps to set up and run the project on your local machine.

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16 or later)
- **MongoDB** (local or cloud instance)
- **Git**

### Installation

#### Clone the repository
```bash
git clone https://github.com/yourusername/BookVerse.git
cd BookVerse
```

#### Install dependencies
##### Frontend
```bash
cd frontend
npm install
```

##### Backend
```bash
cd backend
npm install
```

#### Set up environment variables
Create a **.env** file in the backend/ directory and configure:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=your_application_port
```

Start the application
Backend
```bash
cd backend
npm start
```

Frontend
```bash
cd frontend
npm start
```

## Tech Stack

### Frontend:
- Express handlebars
- TailwindCSS

### Backend:
- Node.js + Express.js
- MongoDB

### DevOps:
- Docker
- GitHub Actions (CI/CD)

## Contributing
We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING) before making any changes.

## License
This project is licensed under the MIT License. See the full license [here](LICENSE).

# 📚 BookVerse - E-commerce Platform for Books

## Overview
This repository contains the source code and materials for **BookVerse**, an e-commerce platform for buying and reading books.  
Built with **Vue.js**, **Node.js**, and **MongoDB**, BookVerse offers a seamless, secure, and user-friendly experience for book lovers.

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
- **feature/frontend**: Contains the frontend code, built with **Vue.js** and **Bootstrap**
- **feature/backend**: Contains the backend code, built with **Node.js** and **Express.js**.

Feature branches are created under `feature/frontend` or `feature/backend` for specific functionalities before merging into their respective branches.

## Features
- 📖 **Wide range of books** – Browse and explore various categories.
- 🛒 **Shopping cart & checkout** – Secure and efficient payment processing.
- 🔍 **Smart search** – Quickly find books based on titles, authors, and genres.
- ✍️ **Reviews & comments** – Share your thoughts with the community.
- 🔐 **User authentication** – Secure sign-up, login, and account management.
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
npm run serve
```

##### Backend
```bash
cd backend
npm install
```

#### Set up environment variables
Create a **.env** file in the backend/ directory and configure:
```bash
PORT = 
CONNECTION_MONGODB_URL = 
CONNECTION_REDIS_URL =  
ACCESS_TOKEN_SECRET = 
EMAIL_SERVICE = 
EMAIL_USER = 
EMAIL_PASSWORD = 
MOMO_ACCESS_KEY = 
MOMO_SECRET_KEY = 
MOMO_REDIRECT_URL = 
MOMO_IPN_URL = 
MOMO_CREATE_URL = 
MOMO_QUERY_URL = 
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
- Vue.js
- Bootstrap

### Backend:
- Node.js + Express.js
- MongoDB
- Redis 

### DevOps:
- GitHub Actions (CI/CD)

## Contributing
We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before making any changes.

## License
This project is licensed under the MIT License. See the full license [here](LICENSE).

## References / Data Sources
- Some book data (titles, cover images, descriptions) are referenced from [Fahasa](https://www.fahasa.com/).
- This project is for educational and non-commercial purposes only.


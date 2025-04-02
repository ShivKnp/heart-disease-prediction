# Heart Disease Prediction System

## Overview
The **Heart Disease Prediction System** is a web-based application designed to predict the likelihood of heart disease based on user-inputted health parameters. It features a **React.js** frontend and a **Node.js/Express** backend with a REST API.

## Features
- **Predict heart disease risk** using machine learning models.
- **Backend API** built with Node.js and Express.
- **Frontend UI** powered by React.js.
- **User authentication** for secure access.
- **Data visualization** for risk assessment.
- **Deployment-ready** with Docker & CI/CD.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Machine Learning:** Python (Flask, scikit-learn)
- **Authentication:** JWT-based authentication

## Folder Structure
```plaintext
📦 Heart-Disease-Prediction
├── 📂 backend         # Node.js API
│   ├── controllers    # API Logic
│   ├── models        # Database Models
│   ├── routes        # API Routes
│   ├── server.js     # Server Entry Point
│
├── 📂 frontend        # React App
│   ├── components    # UI Components
│   ├── pages         # Pages & Views
│   ├── App.js        # Main App File
│
├── 📄 README.md       # Project Documentation
├── 📄 package.json    # Dependencies
└── 📄 .gitignore      # Ignored Files
```

##  Setup & Installation
### Clone the Repository
```sh
git clone https://github.com/your-username/heart-disease-prediction.git
cd heart-disease-prediction
```
### Backend Setup
```sh
cd backend
npm install
npm start
```
### Frontend Setup
```sh
cd frontend
npm install
npm start
```

## API Endpoints
| Method | Endpoint           | Description             |
|--------|-------------------|-------------------------|
| `POST` | `/api/predict`     | Predict heart disease  |
| `GET`  | `/api/users`       | Get user list          |
| `POST` | `/api/auth/login`  | User login             |

## 📌 Contributing
Want to contribute? Follow these steps:
1. **Fork** the repo
2. Create a **new branch** (`feature-xyz`)
3. **Commit** your changes
4. Open a **Pull Request**

---
**Developed with ❤️ by Shivansh Tiwari**


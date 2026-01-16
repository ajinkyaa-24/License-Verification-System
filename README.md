
# License Verification System (Police Dashboard)

## Overview
The License Verification System is a web-based police dashboard developed using **React.js**.
It allows authorities to verify driver license–related information through a cloud-based backend.

The frontend of this application is deployed on **Vercel**, while the backend services are built and hosted on **AWS Cloud**.
This project is developed for academic and demonstration purposes.

---

## Live Demo
🔗 https://license-verification-system.vercel.app/

---

## Demo Login Credentials

For testing and demonstration purposes, use the following credentials:

- **Officer ID:** officer101  
- **Password:** password123  

> ⚠️ These credentials are strictly for demo/testing purposes and do not provide access to real or sensitive data.

---

## Tech Stack

### Frontend
- React.js
- HTML
- CSS
- JavaScript
- Create React App

### Backend (AWS Services)
- AWS API Gateway
- AWS Lambdaa
- AWS DynamoDB
- AWS S3

---

## Features
- Secure login interface (demo-based)
- Police dashboard for license verification
- Real-time data fetching from AWS backend
- Cloud-based and scalable architecture
- Modular and maintainable frontend design

---

## System Architecture

React Frontend | v AWS API Gateway | v AWS Lambda | v DynamoDB / S3

---

## Project Structure

License-Verification-System/ 
│ 
├── public/ 
├── src/ │ 
├── LoginPage.js │ 
├── App.js 
│ └── index.js 
├── package.json 
├── package-lock.json 
├── .gitignore 
└── README.md

---

## Getting Started (Run Locally)

### Prerequisites
- Node.js
- npm

### Steps

npm install  
npm start  

The application will run at:  
http://localhost:3000

---

## Deployment

- Frontend deployed using **Vercel**
- Backend deployed using **AWS Lambda, API Gateway, DynamoDB, and S3**
- Frontend communicates securely with AWS-hosted REST APIs

---

## Security Note
Sensitive data such as:
- AWS credentials
- Environment variables
- Image datasets (driver faces)

are **not included in this repository** and are securely managed using AWS services.

---

## Author
Ajinkya Dahiwal  
Saiel Bhor
Aditya Chaudhari
Archisha Dutta
B.Tech – Computer Science & Engineering

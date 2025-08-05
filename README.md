# 🌐 Blogging Website - Cloud-Based Full Stack Project

## 📌 Project Overview
A scalable and secure **Cloud-Based Blogging Website** built using:
- **React + Vite** for frontend
- **Node.js + Express** for backend
- **MongoDB Atlas** for database
- **AWS Services** for cloud deployment

🔗 Live Demo: [https://naveenkumar.shop](https://naveenkumar.shop)

---

## 🚀 Technologies Used

### 🧑‍💻 Frontend
- React + Vite
- Axios for API calls
- Responsive UI

### 🔧 Backend
- Node.js + Express
- JWT Authentication
- RESTful API

### ☁️ AWS Services
| Service                    | Purpose                                           |
|---------------------------|---------------------------------------------------|
| Amazon S3                 | Host static frontend build                        |
| Amazon CloudFront         | CDN + HTTPS for global content delivery          |
| Amazon Route 53           | Custom domain mapping (`naveenkumar.shop`)       |
| AWS Certificate Manager   | Free SSL certificate                             |
| Amazon ECS Fargate        | Serverless backend container deployment           |
| Amazon ECR                | Docker image repository                          |
| Application Load Balancer | Routing API traffic to backend containers        |

---

## 🛠️ Features

- JWT-based secure login & signup
- Blog CRUD (Create, Read, Update, Delete)
- Real-time deployment with ECS
- Domain-based access with HTTPS
- Scalable, containerized backend
- Responsive and mobile-friendly UI

---

## 🧱 System Architecture

```text
[User] 
  ↓
[Route 53] → [CloudFront] → [S3 Bucket – React Frontend]
                            ↓
            [ALB] → [ECS Fargate – Node.js API] → [MongoDB Atlas]
```

##Folder Structure

/frontend         → React + Vite frontend
/backend          → Node.js + Express backend
README.md         → Project overview

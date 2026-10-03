# Microservices Architecture with Node.js, Docker & Nginx

A hands-on **microservices architecture project** built with Node.js and Express.

This repository demonstrates how an application can be split into independent services and exposed through an **API Gateway**, while **Nginx** sits in front of multiple gateway instances for load balancing.

## 🏗️ Architecture

```text
                         Client
                           |
                           v
                     +-----------+
                     |   Nginx   |
                     | :8080     |
                     +-----------+
                       /       \
                      /         \
                     v           v
              +-----------+ +-----------+
              | Gateway 1 | | Gateway 2 |
              | :8000     | | :8000     |
              +-----------+ +-----------+
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Auth       Order     Payment
      Service    Service    Service
      :8001      :8002      :8003
```

The API Gateway proxies requests to the appropriate internal microservice:

```text
/auth     -> auth-service
/order    -> order-service
/payment  -> payment-service
```

Nginx distributes incoming traffic across the gateway instances.

---

## 🚀 What This Project Demonstrates

### 1. Microservices

Instead of one large application, the backend is divided into independent services:

| Service | Responsibility | Container Port |
|---|---|---:|
| Auth Service | Authentication-related service | 8001 |
| Order Service | Order-related service | 8002 |
| Payment Service | Payment-related service | 8003 |
| Gateway | Single entry point for backend requests | 8000 |

Each service has its own Node.js application and Dockerfile.

### 2. API Gateway

The gateway acts as the entry point for clients.

It exposes routes such as:

```text
GET /
/auth/*
/order/*
/payment/*
```

The gateway uses `express-http-proxy` to forward requests to internal services.

For example:

```text
GET /auth
     |
     v
Gateway
     |
     v
http://auth-service:5001
```

### 3. Multiple Gateway Instances

The Docker Compose configuration starts two gateway containers:

```text
gateway1
gateway2
```

Both instances are built from the same gateway application.

This demonstrates a basic horizontal-scaling pattern where multiple gateway processes can handle incoming requests.

### 4. Nginx Load Balancing

Nginx is placed in front of the gateway instances.

The configuration defines an upstream backend containing the gateway containers:

```text
Client
  |
  v
Nginx :8080
  |
  +----> Gateway 1
  |
  +----> Gateway 2
```

This is useful for understanding how a reverse proxy/load balancer can sit in front of application instances.

---

# 🐳 Running the Project with Docker

Docker Compose is the recommended way to run the complete architecture.

## Prerequisites

Make sure you have installed:

- [Docker](https://www.docker.com/)
- Docker Compose

## Start all services

From the root of the repository:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker ps
```

Stop everything:

```bash
docker compose down
```

---

# 🌐 Accessing the Application

Nginx is exposed on port **8080**.

Use:

```text
http://localhost:8080
```

The gateway itself is also mapped to the host for direct testing:

```text
http://localhost:7001
http://localhost:7002
```

The individual services are mapped as:

```text
Auth     -> http://localhost:5001
Order    -> http://localhost:5002
Payment  -> http://localhost:5003
```

For normal client access, use **Nginx on port 8080**.

---

# 🧪 Testing the Routes

### Gateway

```http
GET http://localhost:8080/
```

The gateway returns a response containing the configured server name.

### Auth Service

Through the gateway:

```http
GET http://localhost:8080/auth
```

Expected response:

```text
Auth route
```

### Order Service

```http
GET http://localhost:8080/order
```

Expected response:

```text
Order route
```

### Payment Service

```http
GET http://localhost:8080/payment
```

Expected response:

```text
Payment route
```

You can test these endpoints with a browser, Postman, or cURL.

Example:

```bash
curl http://localhost:8080/auth
curl http://localhost:8080/order
curl http://localhost:8080/payment
```

---

# 📂 Project Structure

```text
Microservices/
│
├── backend/
│   ├── gateway/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   └── services/
│       ├── auth/
│       │   ├── Dockerfile
│       │   ├── index.js
│       │   ├── package.json
│       │   └── package-lock.json
│       │
│       ├── order/
│       │   ├── Dockerfile
│       │   ├── index.js
│       │   ├── package.json
│       │   └── package-lock.json
│       │
│       └── payment/
│           ├── Dockerfile
│           ├── index.js
│           ├── package.json
│           └── package-lock.json
│
├── nginx/
│   └── nginx.conf
│
└── docker-compose.yml
```

---

# ⚙️ Docker Compose Overview

The root `docker-compose.yml` defines:

### Nginx

```text
Port: 8080 -> 80
```

Nginx uses the custom configuration in:

```text
./nginx/nginx.conf
```

### Gateway Containers

Two instances are created from the same Dockerfile:

```text
gateway1
gateway2
```

### Microservices

Three independent service containers are created:

```text
auth-service
order-service
payment-service
```

Docker Compose provides an internal network so containers can communicate using service names such as:

```text
auth-service
order-service
payment-service
gateway1
gateway2
```

---

# 🔧 Environment Variables

Each application expects a `PORT` value through its environment configuration.

The gateway also uses:

```text
SERVER_NAME
```

to identify the gateway instance in its root response.

Example:

```env
PORT=8000
SERVER_NAME=FIRST
```

For the service containers, the ports configured inside the containers are:

```text
Auth:    8001
Order:   8002
Payment: 8003
```

> Keep environment files such as `.env` out of Git if they contain secrets.

---

# 🔄 Request Flow

Suppose a client requests:

```http
GET /payment
```

The request flow is:

```text
Client
  |
  v
Nginx :8080
  |
  v
Gateway
  |
  v
/payment
  |
  v
payment-service:5003
  |
  v
"Payment route"
```

The client does not need to communicate directly with the internal services.

This is one of the key ideas behind an API gateway.

---

# 🧠 Concepts Learned

This project focuses on understanding the fundamentals of distributed backend systems:

- Microservices architecture
- Service isolation
- API Gateway pattern
- Reverse proxy
- Load balancing
- Horizontal scaling
- Docker containers
- Docker Compose
- Internal container networking
- Environment variables
- Inter-service HTTP communication

---

# 🛠️ Tech Stack

**Backend**

- Node.js
- Express.js
- JavaScript (ES Modules)

**Infrastructure**

- Docker
- Docker Compose
- Nginx

**Gateway**

- express-http-proxy

---

# ⚠️ Current Project Scope

This is a learning implementation of a microservices architecture.

The current services are intentionally minimal:

- Auth service currently exposes a basic route.
- Order service currently exposes a basic route.
- Payment service currently exposes a basic route.
- The gateway forwards requests to these services.
- Nginx is configured to sit in front of gateway instances.

The focus is on understanding the **architecture and communication between components**, rather than implementing complete business logic.

---

# 📈 Possible Next Steps

The architecture can be extended with:

- JWT authentication
- MongoDB databases per service
- Redis for caching and rate limiting
- Kafka or RabbitMQ for event-driven communication
- Service discovery
- Centralized logging
- Health checks
- Circuit breakers
- Retry mechanisms
- Prometheus/Grafana monitoring
- Kubernetes deployment
- CI/CD with GitHub Actions

---

## 👨‍💻 Author

**Aryan Nair**

GitHub: [aryannair005](https://github.com/aryannair005)

---

⭐ This repository is part of my hands-on backend and system-design learning journey.

# Rentee System Backend

## CI/CD Pipeline
This project uses GitHub Actions for continuous integration and deployment. The pipeline includes steps for testing, building a Docker image, and deploying to DigitalOcean.

### How to Use the Pipeline
1. **Push Changes**: When you push changes to the `main` branch, the pipeline will automatically trigger.
2. **Testing**: The pipeline will run tests using Jest. Ensure all tests pass before merging changes.
3. **Building Docker Image**: After successful tests, the pipeline will build a Docker image for the application.
4. **Deployment**: The built Docker image will be deployed to DigitalOcean.

### Prerequisites
- Ensure you have a DigitalOcean account and the necessary API tokens configured in your GitHub repository secrets.
- Update the deployment commands in the GitHub Actions workflow as needed.



## Overview
The **Rentee System Backend** is a **NestJS-based monolithic API** for a peer-to-peer rental marketplace. Built with **Node.js (NestJS, TypeScript), PostgreSQL, and Docker**, it supports **scalable deployments on DigitalOcean** with **GitHub Actions for CI/CD**.

---

## Project Structure
```
rentee-backend/
│── src/                      # Source code
│   ├── auth/                 # Authentication & Authorization
│   ├── common/               # Common utilities, DTOs, interfaces
│   ├── config/               # Configuration & environment management
│   ├── database/             # Database connection & migrations
│   ├── modules/              # Feature modules (users, rentals, payments, etc.)
│   ├── app.module.ts         # Root module
│   ├── main.ts               # Entry point
│── test/                     # Tests
│── docker-compose.yml        # Docker setup
│── .github/workflows/ci-cd.yml  # GitHub Actions
│── .env                      # Environment variables
│── .gitignore                # Ignore files
│── Dockerfile                # Docker build config
│── package.json              # Dependencies
│── yarn.lock                 # Yarn lock file
│── tsconfig.json             # TypeScript config
│── nest-cli.json             # NestJS config
```

---

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/downloads)

### Setup & Run
```sh
git clone https://github.com/king1edy/rentee.git
cd rentee-backend
yarn install
cp .env.example .env
```
Edit `.env` to configure database credentials.

Run the project locally:
```sh
yarn start:dev
```

Run with Docker:
```sh
docker-compose up --build
```
Apply database migrations:
```sh
docker-compose exec rentee-api yarn typeorm migration:run
```

---

## Testing
```sh
yarn test
```

---

## CI/CD with GitHub Actions
### Deployment
1. Push changes to `main` or `develop` to trigger CI/CD.
```sh
git push origin main
```
2. GitHub Actions builds, tests, and pushes a Docker image.
3. Image is deployed to **DigitalOcean Droplet**.

### DigitalOcean Setup
1. Create a DigitalOcean Droplet (Ubuntu 22.04).
2. Install Docker & Docker Compose:
```sh
sudo apt update && sudo apt install docker.io docker-compose -y
```

---

## API Documentation
- **Swagger UI**: [http://localhost:4000/swagger](http://localhost:4000/swagger)

---

## Contribution Guide
1. **Fork the repository**.
2. **Create a feature branch**:
```sh
git checkout -b feature-name
```
3. **Make changes and commit**:
```sh
git commit -m "Added feature XYZ"
```
4. **Push and create a Pull Request**.

---

## Contact & Support
For issues or feature requests, create an issue on GitHub. 🚀

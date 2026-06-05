# College Management Information System (CMIS)

CMIS is a College Management Information System designed as a major internship project. The application features a Spring Boot backend API secured with JWT and role-based permissions, and a React + TypeScript frontend client built with custom glassmorphism styling.

## 🚀 Technology Stack
- **Backend**: Spring Boot 3.2.x, Java 17, Spring Security, Spring Data JPA, Lombok
- **Frontend**: React 18/19, TypeScript, Vite, React Router v6, React Hook Form, Yup, Axios, React Icons
- **Database**: PostgreSQL (Production/Docker), H2 Database (Development fallback)
- **Containerization**: Docker, Docker Compose, Nginx (Frontend asset server)
- **CI/CD**: GitHub Actions, SonarQube quality mapping

---

## 📂 Project Structure
```text
intern_major/
├── backend/
│   ├── src/main/java/com/cms/
│   │   ├── config/          # Security, JWT, Swagger, CORS Configurations
│   │   ├── controller/      # REST API Controllers (Versioned: /api/v1/)
│   │   ├── exception/       # Global Exception Handler and Custom Exceptions
│   │   ├── model/
│   │   │   ├── entity/      # JPA Entity models (User, Student, Course, Mark, Fee)
│   │   │   ├── dto/         # Request/Response Data Transfer Objects
│   │   │   └── response/    # Standard ApiResponse JSON wrapper
│   │   ├── repository/      # Spring Data JPA Repository Interfaces
│   │   ├── service/         # Service Interfaces & Implementations
│   │   └── util/            # JWT Token Utilities
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance, Interceptors, API Services
│   │   ├── components/      # Reusable UI components (Navbar, ProtectedRoute, etc.)
│   │   ├── context/         # AuthContext session manager
│   │   ├── pages/           # Pages (Login, Register, Dashboard, etc.)
│   │   ├── types/           # TypeScript Type Definitions
│   │   └── utils/           # Helper JS utilities
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── sonar-project.properties
└── README.md
```

---

## 🛠️ Local Development Setup

### Prerequisites
- [Java JDK 17+](https://adoptium.net/)
- [Node.js v18+](https://nodejs.org/)
- [Maven](https://maven.apache.org/) (optional, or run wrapper)
- [PostgreSQL](https://www.postgresql.org/) (optional, only if running Prod profile locally)

### Option A: Local Run (DEV Profile - H2 In-Memory DB)

In this mode, the backend runs on an in-memory database. No database installations are required.

#### 1. Start the Backend API
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Build and start the Spring Boot application (using the default `dev` profile):
   ```bash
   mvn spring-boot:run
   ```
   *The server will start on port `8080`.*
   *The local H2 console is accessible at: `http://localhost:8080/h2-console` (Credentials: JDBC URL: `jdbc:h2:mem:cmisdb`, User: `sa`, Password: `password`).*

#### 2. Start the Frontend client
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend client will start on port `5173` (or the next available port, e.g. `http://localhost:5173`).*

---

### Option B: Docker Compose Run (PROD Profile - PostgreSQL DB)

To run the entire ecosystem (Database + Backend + Frontend Nginx Server) in one command:

1. Ensure you have Docker and Docker Desktop running.
2. In the project root directory, run:
   ```bash
   docker compose up --build
   ```
3. Verify running containers:
   - **Frontend App**: `http://localhost:3000` (routed via Nginx)
   - **Backend REST API**: `http://localhost:8080`
   - **PostgreSQL Database**: Port `5432`

---

## 🔑 Access Credentials & Role System

The application operates on two roles:
1. **`ROLE_STUDENT`**: Has read-only permissions for courses, marks, and fees.
2. **`ROLE_ADMIN`**: Has full CRUD authority on students, courses, marks, and billing records.

### How to Create Accounts:
- **Student User**: Register any new email address (e.g. `jane.doe@college.edu`) through the **Register** page. It will automatically create a Student profile (`ROLE_STUDENT`) in the database.
- **Admin User**: Register an email address containing the term `admin` (e.g. `admin@cms.com` or `admin.principal@college.edu`) through the **Register** page. The service automatically promotes any email with "admin" in its string to the `ROLE_ADMIN` authority.

---

## 📖 Swagger API Documentation
When the backend API is running, you can inspect, document, and test endpoints via the Swagger OpenAPI v3 interface:
- **Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **API Documentation JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

To test secure endpoints from Swagger UI:
1. Log in or register using the `/api/v1/auth/login` endpoint.
2. Copy the `token` string from the JSON response.
3. Click the **Authorize** button at the top-right of the Swagger page, paste the token, and click **Authorize**.

---

## 🧪 Running Unit Tests
Backend test scripts cover user registration checks, authentication flows, and student profile CRUD validations.
To run JUnit 5 tests locally:
```bash
cd backend
mvn test
```

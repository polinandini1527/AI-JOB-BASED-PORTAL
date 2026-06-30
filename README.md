# 🚀 AI-Based Job Portal

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-3.8+-blue.svg)](https://maven.apache.org/)
[![H2 Database](https://img.shields.io/badge/Database-H2--File--Based-orange.svg)](https://www.h2database.com/)
[![Java](https://img.shields.io/badge/Java-17%20%2F%2023-red.svg)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A state-of-the-art, full-stack career platform designed to link job seekers with recruiters using semantic matchmaking. Features custom glassmorphism styling, a secure multi-role database, global exception handling advisors, input validation bindings, BCrypt encryption, and a custom file uploader.

---

## 📋 Table of Contents
1. [Project Introduction](#-project-introduction)
2. [Problem Statement](#-problem-statement)
3. [Objectives](#-objectives)
4. [Implemented Features](#-implemented-features)
5. [Technologies Used](#-technologies-used)
6. [System Architecture](#-system-architecture)
7. [Project Structure](#-project-structure)
8. [Database Design](#-database-design)
9. [REST APIs](#-rest-apis)
10. [Technical Implementation Details](#-technical-implementation-details)
    - [Validation Layer](#validation-layer)
    - [Global Exception Handling](#global-exception-handling)
    - [Security & Encryption](#security--encryption)
    - [DTO Layer Architecture](#dto-layer-architecture)
    - [Resume Management](#resume-management)
    - [AI Recommendations](#ai-recommendation-system)
    - [H2 Database Seeding](#h2-database-seeding)
11. [Frontend Design & UX](#-frontend-design--ux)
12. [Installation & Setup](#-installation--setup)
13. [Seeded Accounts (Default Login)](#-seeded-accounts-default-login)
14. [Screenshots](#-screenshots)
15. [Future Enhancements](#-future-enhancements)
16. [License](#-license)
17. [Author](#-author)

---

## 📖 Project Introduction
The **AI-Based Job Portal** is a premium, full-stack application built to simplify career searches and recruitment pipelines. Seeking to move away from local browser-storage designs, the application integrates a robust Spring Boot 3.3.0 backend with a highly interactive, responsive frontend. The platform handles user accounts, job postings, resume uploads, candidate tracking, and AI-driven career recommendations dynamically using a local persistent H2 database.

## ⚠️ Problem Statement
Modern recruitment workflows are often slowed down by:
- Fragmented candidate profiles.
- Unencrypted passwords stored directly in databases.
- The lack of real-time search filters for jobs by keyword, company, and location.
- High-latency matching algorithms that fail to link user profiles to open jobs.
- Poor validation checks, leading to corrupt database entries or duplicate user registrations.

## 🎯 Objectives
- Provide secure user credential handling via BCrypt hashing algorithms.
- Establish an automated database seeder checking records dynamically on reboot.
- Build clean DTO layers to separate database entities from controllers.
- Design a premium, highly responsive user interface with media query support, CSS variables, glassmorphic cards, loading overlays, and custom slide-in toast notifications.
- Enable high-performance, file-filtered resume uploads and secure downloads.

---

## ✨ Implemented Features
*   **Authentication & Security**: BCrypt password hashing, session state mapping, and credentials checking.
*   **Dual-dashboard Management**: Interactive Admin and Recruiter panels displaying live system metrics.
*   **Dynamic Resume Uploads**: Multi-format filter checking (.pdf, .doc, .docx) limited to 5 MB.
*   **Resume Download Service**: Attachment headers mapping files directly from the physical workspace directory.
*   **Multi-Criteria Job Filtering**: Filters open roles instantly by keywords, company name, and location.
*   **Duplicate Prevention**: Disallows duplicate applications for the same job and prevents double email registrations.
*   **Semantic AI Matchmaker**: Compares user skills dynamically against the jobs database.
*   **Elegant Toast System**: Elegant sliding messages replacing standard browser warnings.
*   **Loading States**: Full-screen blurs and indicators on networking events.

---

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic tags layout.
- **CSS3**: Variables, Flexbox/Grid alignment, HSL colors, media queries, and glassmorphic blurs.
- **JavaScript (ES6)**: Asynchronous async/await networking and DOM controllers.
- **FontAwesome**: UI icon layouts.

### Backend
- **Java 17/23**: Core programming language.
- **Spring Boot 3.3.0**: Backend execution framework.
- **Spring Data JPA / Hibernate**: Object-relational mapping.
- **Jakarta Validation**: Data annotations.
- **Spring Security Crypto**: BCrypt password encoding.

### Database
- **H2 (File-Based)**: Local file database (`jdbc:h2:file:./data/aijobportal`).

---

## 🏗️ System Architecture
```
  ┌─────────────────────────────────────────────────────────┐
  │                   Frontend (HTML/CSS/JS)                │
  └────────────────────────────┬────────────────────────────┘
                               │ JSON / Multipart Request
                               ▼
  ┌─────────────────────────────────────────────────────────┐
  │                 REST Controller Controllers             │
  └────────────────────────────┬────────────────────────────┘
                               │ DTO / Entity Binding
                               ▼
  ┌─────────────────────────────────────────────────────────┐
  │                    Service Layer Services               │
  └────────────────────────────┬────────────────────────────┘
                               │ JPA Transactions
                               ▼
  ┌─────────────────────────────────────────────────────────┐
  │                  Repository Layer Repositories          │
  └────────────────────────────┬────────────────────────────┘
                               │ H2 Query Execution
                               ▼
  ┌─────────────────────────────────────────────────────────┐
  │                 H2 Database (Local Filesystem)          │
  └─────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure
```
AI-BASED-JOB-PORTAL/
├── BACKEND/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/aijobportal/
│   │   │   │   ├── controller/         # REST Endpoints
│   │   │   │   ├── dto/                # Data Transfer Objects
│   │   │   │   ├── exception/          # Global Exception Handler
│   │   │   │   ├── model/              # Database Entities
│   │   │   │   ├── repository/         # Data Access Objects
│   │   │   │   ├── service/            # Core Business Logic
│   │   │   │   └── AIJobPortalApplication.java # Entry Point
│   │   │   └── resources/
│   │   │       ├── application.properties  # Database & Multipart Config
│   │   │       └── schema.sql
│   │   └── test/
│   ├── pom.xml                         # Maven Dependencies
│   └── uploads/                        # Physical storage for resumes
├── Frontend/
│   ├── index.html                      # Welcome landing page
│   ├── login.html                      # User login
│   ├── register.html                   # Account signup
│   ├── jobs.html                       # Jobs search
│   ├── profile.html                    # Profile & Resume center
│   ├── applications.html               # Application history
│   ├── recruiter-dashboard.html        # Recruiter stats & Job post
│   ├── admin-dashboard.html            # System administrative stats
│   ├── recommendation.html             # AI Job recommendation matches
│   ├── contact.html                    # Support form
│   ├── style.css                       # Modern layout styling
│   └── script.js                       # Frontend networking script
└── README.md                           # Documentation
```

---

## 🗄️ Database Design
The portal maps 4 primary JPA entities:

### 1. User
- Stores candidate credentials, skills, and resume file paths.
- **Fields**: `id` (PK), `name`, `email` (Unique), `password`, `skills`, `resumeName`.

### 2. Job
- Represents open positions.
- **Fields**: `id` (PK), `title`, `company`, `location`.

### 3. Recruiter
- Connects recruiter staff to company titles.
- **Fields**: `recruiterId` (PK), `companyName`, `email`.

### 4. Application
- Tracks job submissions.
- **Fields**: `applicationId` (PK), `userEmail`, `jobTitle`, `status` (Applied, Shortlisted, Selected, Rejected).

---

## 🌐 REST APIs

| Method | Endpoint | Purpose | Request Body | Response Format |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | Register a new account | `RegisterRequest` | `"Registration Successful"` |
| **POST** | `/login` | Authenticate credentials | `LoginRequest` | `"Login Successful"` |
| **GET** | `/user/profile` | Retrieve candidate details | Query: `email` | `UserProfileResponse` |
| **POST** | `/user/profile/update` | Update candidate details | Query: `email`, `name`, `skills` | `UserProfileResponse` |
| **POST** | `/user/profile/upload` | Upload resume file | Multipart: `email`, `file` | `UserProfileResponse` |
| **GET** | `/resume/{filename}` | Download uploaded resume | Path variable | Binary File Stream |
| **GET** | `/jobs` | Retrieve all job opportunities | None | `List<JobResponse>` |
| **POST** | `/jobs` | Post a new job opportunity | `Job` | `Job` |
| **GET** | `/applications` | Fetch candidate applications | Query: `email` | `List<ApplicationResponse>` |
| **POST** | `/applications` | Apply for a job | `Application` | `ApplicationResponse` |
| **GET** | `/recommendations` | Get skill-matched recommendations | Query: `skills` | `RecommendationResponse` |
| **GET** | `/admin/stats` | Fetch administrative metrics | None | `Map<String, Object>` |
| **GET** | `/recruiter/stats` | Fetch recruiter metrics | None | `Map<String, Object>` |

---

## 🛠️ Technical Implementation Details

### Validation Layer
Requests are validated at the boundaries using Jakarta Bean Validation. Constraints are declared on DTOs:
- `RegisterRequest` forces `@NotBlank` on name/email/skills, `@Email` formatting, and `@Size(min = 8)` for passwords.
- `Job` requires `@NotBlank` on job title, company name, and location.

### Global Exception Handling
Annotated with `@ControllerAdvice`, `GlobalExceptionHandler` intercept errors and maps them to structured `ErrorDetails` JSON payloads:
- `UserNotFoundException` -> HTTP 404
- `JobNotFoundException` -> HTTP 404
- `DuplicateEmailException` -> HTTP 400
- `DuplicateApplicationException` -> HTTP 400
- `MethodArgumentNotValidException` -> HTTP 400 (validation failures)

### Security & Encryption
The system deploys the `BCryptPasswordEncoder` bean. Passwords are never stored in plain text. During registration, credentials are hashed with a secure salt. During login, the server matches the raw password against the database hash using `encoder.matches()`.

### DTO Layer Architecture
To separate database tables from network outputs, specialized data objects are defined:
- `RegisterRequest`, `LoginRequest`
- `UserProfileResponse`, `JobResponse`, `ApplicationResponse`, `RecommendationResponse`

### Resume Management
- **File Upload**: File size checking in the controller prevents uploads above 5 MB. Files are restricted to PDF, DOC, and DOCX extensions. Uploaded documents are saved under the local folder `uploads/`.
- **File Download**: Requests to `GET /resume/{filename}` search the `uploads/` directory, set the appropriate MIME content-type (e.g. `application/pdf`), and attach the `Content-Disposition` header forcing an browser attachment download.

### AI Recommendation System
The `RecommendationService` calculates matches between candidate skills and available jobs. It queries the database, compares skills using basic string parsing, and ranks them:
- **85% Match** if the job title or description fully contains user skills.
- **50% Match** for partial keywords overlap.
- Returns `"No Suitable Job Found"` if there are no matches.

### H2 Database Seeding
To keep data persistent across restarts, a `CommandLineRunner` seeds H2 tables during startup only if they are empty. Checks are decoupled to seed jobs, users, applications, and recruiters independently.

---

## 🎨 Frontend Design & UX
The frontend features:
- **Google Fonts Outfit Typography**: Professional lettering.
- **Glassmorphic Layout System**: Blur backdrops (`backdrop-filter`) and light translucent borders.
- **Interactive Forms**: Smooth glowing borders when active.
- **CSS Transitions**: Micro-interactions like cards raising (`transform: translateY(-6px)`) when hovered.
- **Status Tags**: Color-coded badges for applications (Applied: Blue, Shortlisted: Gold, Selected: Green, Rejected: Red).
- **Toast Notifications**: Slide-in notices replacing traditional popups.
- **Loading Blurs**: Transparent loading overlays to indicate background requests.

---

## ⚙️ Installation & Setup

### Prerequisites
- **Java JDK**: Version 17 or higher.
- **Apache Maven**: Version 3.8 or higher.
- **Node.js / Python** (to serve the static frontend).

### Step 1: Run the Backend
1. Open your terminal in the `BACKEND` directory:
   ```bash
   cd BACKEND
   ```
2. Build and package the project:
   ```bash
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
4. Verify the backend console indicates Tomcat has started successfully on port `8082`.

### Step 2: Run the Frontend
1. Open your terminal in the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Serve the static HTML files using Python or Node:
   - **Using Python**:
     ```bash
     python -m http.server 8081
     ```
   - **Using Node**:
     ```bash
     npx http-server -p 8081
     ```
3. Open your browser and navigate to [http://localhost:8081/index.html](http://localhost:8081/index.html).

---

## 🔑 Seeded Accounts (Default Login)
Use the default accounts seeded in the database to test the portal:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Candidate** | `candidate@jobportal.com` | `password` |
| **Recruiter** | `recruiter@jobportal.com` | `password` |
| **Admin** | `admin@jobportal.com` | `password` |

---

## 📸 Screenshots
The following screenshot placeholders represent the polished layout states:

### Home Page
![Home Page Placeholder](https://placehold.co/800x450/4f46e5/ffffff?text=AI+Job+Portal+Home)

### Login & Registration
![Auth Placement](https://placehold.co/800x450/4f46e5/ffffff?text=Login+and+Signup+Forms)

### Jobs Board & Filters
![Jobs Placement](https://placehold.co/800x450/4f46e5/ffffff?text=Career+Board+and+Location+Filters)

### Candidate Profile & Uploader
![Profile Placement](https://placehold.co/800x450/4f46e5/ffffff?text=Candidate+Profile+and+Resume+Upload)

### Recruiter & Admin Dashboards
![Dashboards Placement](https://placehold.co/800x450/4f46e5/ffffff?text=Recruiter+Metrics+and+Job+Postings)

---

## 🔮 Future Enhancements
- **JWT Authentication**: Secure stateless token sessions instead of plain mapping.
- **Email Verification**: Confirm user registration via email links.
- **Relational Databases**: Migrate H2 database to PostgreSQL or MySQL for production.
- **Dockerization**: Containerize frontend and backend stacks.
- **Resume Parsing**: Use OCR/LLMs to automatically extract keywords from uploaded PDF files.

---

## 📄 License
This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👤 Author
**NANDINI**
*Java Full Stack Developer*
- **Workspace Name**: NANDINI
- **Target Role**: Java Full Stack Developer

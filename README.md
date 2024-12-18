# Notes Management Application

This is the README.md of the project, implemented as a **Full Stack application** using **React.js** for the frontend and **Spring Boot** for the backend.

---

## Table of Contents

1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [System Requirements](#system-requirements)
4. [Installation Instructions](#installation-instructions)
5. [Run the Project](#run-the-project)
6. [Implemented Features](#implemented-features)
7. [Authentication](#authentication)
8. [Live Deployment](#live-deployment)
9. [API Endpoints](#api-endpoints)

---

## 1. Overview

The application allows users to manage notes with the following features:

- Create, edit, and delete notes.
- Archive and unarchive notes.
- Filter notes by categories.
- Add and delete categories.
- Assign categories to notes.
- Basic authentication to protect routes.

---

## 2. Technologies Used

### **Frontend**

- **React.js** (Vite)
- **TypeScript**
- **Axios** (for HTTP requests)
- **React Router** (for navigation)
- **SweetAlert2** (for user-friendly alerts)
- **TailwindCSS** (for styling)

### **Backend**

- **Spring Boot** (Java)
- **Spring Security** (for authentication)
- **Spring Data JPA** (ORM)
- **H2 Database** (in-memory database)
- **Maven** (for dependency management)

---

## 3. System Requirements

- **Node.js**: v18.17.0
- **npm**: v9.x
- **Java**: JDK 17
- **Maven**: v3.8.5
- **Recommended IDE**: IntelliJ IDEA / VSCode
- **Git**: to clone the repository

---

## 4. Installation Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ensolvers-github-challenges/RomanHernandez-72a462.git
   cd RomanHernandez-72a462
   ```

2. **Backend Setup**

   - Navigate to the **backend** directory:

   ```bash
   cd backend
   ```

   - Build the project with Maven:

   ```bash
   mvn clean install
   ```

   - H2 is used by default, no extra database configuration is required.

3. **Frontend Setup**
   - Navigate to the **frontend** directory:
   ```bash
   cd frontend
   ```
   - Install dependencies:
   ```bash
   npm install
   ```

---

## 5. Run the Project

## Automatic Script

Run this script in the root directory to start the backend and frontend simultaneously:

```bash
bash start.sh
```

---

## Prerequisites

Before running the script, ensure you have the following tools installed:

1. **Java Development Kit (JDK) 17**

   - Download: [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)

2. **Maven** (for backend dependencies)

   - Ensure Maven Wrapper (`mvnw`) is included in the backend folder.
   - To verify Maven:
     ```bash
     mvn -v
     ```

3. **Node.js and npm** (for frontend dependencies)

   - Recommended version: Node.js **18+**
   - Download: [Node.js](https://nodejs.org)
   - To verify Node.js and npm:
     ```bash
     node -v
     npm -v
     ```

4. **Bash Terminal**
   - Works on **Linux/macOS** or Windows with a Bash-compatible terminal (e.g., Git Bash).

---

## What the Script Does

The `start.sh` script automates the setup process for the application:

1. **Backend**:

   - Builds the backend project using Maven.
   - Runs the Spring Boot backend at **http://localhost:8080**.

2. **Frontend**:
   - Installs frontend dependencies using `npm`.
   - Starts the React development server at **http://localhost:5173**.

---

## Steps to Run

1. Clone the project repository:

   ```bash
   git clone https://github.com/your-repository-url.git
   cd RomanHernandez-72a462
   ```

2. Make the script executable:

   ```bash
   chmod +x start.sh
   ```

3. Run the script:
   ```bash
   bash start.sh
   ```

---

## Access the Application

- **Frontend URL**: [http://localhost:5173](http://localhost:5173)
- **Backend URL**: [http://localhost:8080](http://localhost:8080)

---

## Troubleshooting

If any issues occur during the setup:

1. Ensure all prerequisites (JDK, Maven, Node.js) are installed and configured correctly.
2. Check if the backend port **8080** or frontend port **5173** is already in use and stop conflicting processes.
3. Review the console output for errors and address them as needed.

### **Manual Run**

1. **Start the Backend**

   - From the **backend** directory:

   ```bash
   mvn spring-boot:run
   ```

   - The backend server will be available at:
     ```
     http://localhost:8080
     ```

2. **Start the Frontend**
   - From the **frontend** directory:
   ```bash
   npm run dev
   ```
   - The frontend server will be available at:
     ```
     http://localhost:5173
     ```

---

## 6. Implemented Features

### **Phase 1: Notes Management**

- [x] Create notes.
- [x] Edit notes.
- [x] Delete notes.
- [x] Archive and unarchive notes.
- [x] View active notes.
- [x] View archived notes.

### **Phase 2: Categories Management**

- [x] Add categories.
- [x] Delete categories.
- [x] Assign categories to notes.
- [x] Filter notes by categories.
- [x] Automatically reassign notes to **"Uncategorized"** when a category is deleted.

---

## 7. Authentication

The application uses a basic authentication system:

- **Default User**:
  - **Username**: `user`
  - **Password**: `password`

Routes are protected, and only authenticated users can access them.

---

## 8. Live Deployment

(Add the live deployment link here if applicable.)

**Live Deployment URL**:

```

```

---

## 9. API Endpoints

### **Authentication**

- `POST /api/auth/login`: Login with credentials.

### **Notes**

- `GET /api/notes`: Fetch all notes.
- `POST /api/notes`: Create a new note.
- `PUT /api/notes/{id}`: Edit a note.
- `DELETE /api/notes/{id}`: Delete a note.
- `PATCH /api/notes/{id}/archive`: Archive a note.
- `PATCH /api/notes/{id}/unarchive`: Unarchive a note.

### **Categories**

- `GET /api/categories`: Fetch all categories.
- `POST /api/categories`: Create a new category.
- `DELETE /api/categories/{id}`: Delete a category.

---

## 10. Contact

If you have any questions about the project, contact me at:

- **Emails**: [dannylol207@gmail.com](mailto:dannylol207@gmail.com) and [dannylol207@gmail.com](mailto:dannylol207@gmail.com)
- **LinkedIn**: [EstebanRoman99](https://github.com/EstebanRoman99)

---

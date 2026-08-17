# 🚀 TaskBoard

A full-stack project management and collaboration platform inspired by Trello.

TaskBoard allows users to create organizations, manage members, create boards, organize work into sections, and manage issues.

---

## ✨ Features

### 🔐 Authentication

- User Signup
- User Signin
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes

### 🏢 Organizations

- Create and manage organizations
- View organizations
- Organization-specific boards
- Organization-specific members

### 👥 Organization Members

- View organization members
- Admin and Member roles
- Admin-only member management
- Add users to an organization
- Prevent duplicate memberships

### 📋 Boards

- Create boards inside organizations
- View boards belonging to an organization
- Open individual boards

### 🗂️ Board Sections

Boards can be organized into workflow sections such as:

- Open
- Pending
- Done

### 🐛 Issue Management

- Create issues
- Add issue descriptions
- Assign issues to sections
- Display issues according to their section

---

# 📸 Screenshots

## 🔐 Signup

<!-- Add screenshot here -->

<img width="1907" height="909" alt="Screenshot 2026-08-17 135513" src="https://github.com/user-attachments/assets/ce595476-0e5d-4294-bb37-86df6c42a82a" />


---

## 🔑 Signin

<!-- Add screenshot here -->

<img width="1907" height="901" alt="Screenshot 2026-08-17 135610" src="https://github.com/user-attachments/assets/285990fc-698b-417a-836b-40f05a99ca72" />


---

## 🏠 Dashboard

<!-- Add screenshot here -->

<img width="1907" height="903" alt="Screenshot 2026-08-17 135709" src="https://github.com/user-attachments/assets/96d92497-15a3-40f2-bcae-989d993e5089" />


---

## 🏢 Organizations

<!-- Add screenshot here -->

<img width="1907" height="903" alt="Screenshot 2026-08-17 140010" src="https://github.com/user-attachments/assets/322d3634-1630-4e1a-9b59-48c32f6a8bac" />


---

## 👥 Organization Members

<!-- Add screenshot here -->

<img width="1907" height="893" alt="Screenshot 2026-08-17 140045" src="https://github.com/user-attachments/assets/0bd6aa4f-1228-4c63-af68-259d5e9208ca" />


---

## 📋 Organization Boards

<!-- Add screenshot here -->

<img width="1907" height="907" alt="Screenshot 2026-08-17 140136" src="https://github.com/user-attachments/assets/a32b394f-4482-4173-a33c-13393e33145b" />


---



---

# 🏗️ Architecture

```text
                    React Frontend
                          │
                          │ REST API
                          ▼
                    Express Backend
                          │
                          ▼
                       Prisma
                          │
                          ▼
                  Neon PostgreSQL

                    WebSocket
                 (Future Integration)

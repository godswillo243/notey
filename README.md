# 📝 Notey

A modern full-stack note-taking application built with **React**, **NestJS**, **MongoDB**, and **Typegoose**, featuring secure authentication, note management, search, tagging, and a scalable production-ready architecture.

## ✨ Features

### 🔐 Authentication

- JWT Authentication (Access & Refresh Tokens)
- Email Verification
- Forgot & Reset Password
- Secure HTTP-only Cookies
- Password Hashing with bcrypt
- Protected Routes & Authorization

### 📝 Notes

- Create, Read, Update, and Delete Notes
- Pin & Unpin Notes
- Archive Notes
- Trash & Restore Notes
- Organize Notes with Tags
- Search Notes
- Color-coded Notes

### 👤 User Management

- User Profiles
- Avatar Support
- Profile Updates

### 🚀 Planned Features

- Rich Text Editor
- Real-time Collaboration
- Comments
- File Attachments
- Notifications
- Reminders
- Offline Support (PWA)

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Axios

### Backend

- NestJS
- TypeScript
- MongoDB
- Typegoose
- JWT
- Nodemailer
- bcrypt

### Tools

- Swagger (API Documentation)
- ESLint
- Prettier
- Git & GitHub

---

## 📂 Project Structure

```text
notey/
├── client/          # React Frontend
├── server/          # NestJS Backend
└── README.md
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/<your-username>/notey.git
cd notey
```

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run start:dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend

```env
# APP
PORT=
APP_URL=
CLIENT_URL=

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

# Database
MONGODB_URI=

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_PASS=
SMTP_USER=

# Cloudinary
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=

```

---

## 📸 Screenshots

Coming soon.

---

## 🗺️ Roadmap

- [x] Authentication
- [x] Email Verification
- [x] Password Reset
- [x] JWT Authentication
- [x] Notes CRUD
- [x] Pin & Archive Notes
- [ ] Trash & Restore
- [ ] Search & Filters
- [ ] Tags
- [ ] User Profiles
- [ ] Rich Text Editor
- [ ] Collaboration
- [ ] Notifications
- [ ] PWA Support

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

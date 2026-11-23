# JobConnect 🚀 – 100% Dynamic MERN Stack Job Portal

A professional, full-featured multi-role Job Portal website built with the **MERN Stack** (MongoDB, Express.js, React, Node.js) and styled with modern **Tailwind CSS** and **Lucide Icons**.

---

## 🌟 Key Highlights & Features

- **Multi-Role System (3 User Roles)**:
  - 👤 **Job Seeker**: Dynamic profile, resume PDF upload, search & multi-filter jobs, 1-click apply with cover note, track application lifecycle status (*Applied ➔ Under Review ➔ Shortlisted ➔ Interview Scheduled ➔ Accepted/Rejected*), join interview meeting links, save/bookmark jobs.
  - 💼 **Recruiter / Employer**: Company profile management with logo, post new positions with requirements & salary, applicant review pipeline with resume preview, 1-click candidate shortlisting/rejection, and schedule interviews with Google Meet/Zoom links and candidate notification.
  - 🛡️ **Super Admin**: Platform overview analytics (total seekers, recruiters, companies, applications, interview metrics), user management (search, filter, block/unblock, delete), job moderation (mark featured, delete), company verification (grant/revoke verified badge).
- **100% Dynamic Architecture**:
  - No fake hardcoded data on frontend. Every card, stat, filter, application status, and notification communicates directly with the MongoDB database via Express REST APIs.
  - Quick 1-click test login buttons on the login screen for instantaneous testing without typing.

---

## 📁 Project Structure

```
jobconnect-portal/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection (Atlas Cloud & Local support)
│   ├── controllers/
│   │   ├── adminController.js       # Admin platform statistics and moderation
│   │   ├── applicationController.js # Dynamic application lifecycle & interviews
│   │   ├── authController.js        # JWT registration, login, role check
│   │   ├── companyController.js     # Company profile & directory
│   │   ├── jobController.js         # Multi-filter search & job CRUD
│   │   └── profileController.js     # Candidate profile, skills & resume uploads
│   ├── middleware/
│   │   ├── auth.js                  # JWT token verification
│   │   ├── role.js                  # RBAC (Seeker, Recruiter, Admin)
│   │   └── upload.js                # Multer file upload for resumes
│   ├── models/
│   │   ├── Application.js           # Application schema with status tracking
│   │   ├── Company.js               # Company details & verification
│   │   ├── Job.js                   # Job postings with search indexes
│   │   ├── Notification.js          # In-app notification events
│   │   ├── Profile.js               # Seeker profile, skills & resume
│   │   ├── SavedJob.js              # Bookmarked jobs
│   │   └── User.js                  # User authentication schema
│   ├── routes/
│   ├── seed/
│   │   └── seedData.js              # Rich demo database seeder
│   ├── server.js                    # Express app entrypoint
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Footer.jsx       # Modern tech footer
│   │   │       ├── JobCard.jsx      # Dribbble-level job listing card
│   │   │       ├── Modal.jsx        # Accessible dialog modal
│   │   │       ├── Navbar.jsx       # Dynamic navigation with role badges
│   │   │       └── Toast.jsx        # Notification alert banners
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global authentication & user state
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── recruiter/
│   │   │   │   └── RecruiterDashboard.jsx
│   │   │   ├── seeker/
│   │   │   │   └── SeekerDashboard.jsx
│   │   │   ├── Companies.jsx        # Verified hiring companies directory
│   │   │   ├── Home.jsx             # High-converting landing page & search
│   │   │   ├── JobDetail.jsx        # Detailed job view & application modal
│   │   │   ├── Jobs.jsx             # Dynamic multi-filter search feed
│   │   │   ├── Login.jsx            # Sign in with 1-click demo logins
│   │   │   └── Register.jsx         # Seeker / Recruiter registration
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with JWT interceptor
│   │   ├── App.jsx                  # Protected routes & layout
│   │   ├── index.css                # Tailwind base styles
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Axios, React Router
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, Multer
- **Database**: MongoDB Atlas Cloud
- **Deployment**: Vercel (Frontend), Render (Backend API)




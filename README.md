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

## ⚡ Step-by-Step: How to Run in VS Code

### Step 1: Open the Project in VS Code
1. Open **Visual Studio Code**.
2. Go to **File ➔ Open Folder...**
3. Select the project directory:
   `C:\Users\HP\.gemini\antigravity\scratch\jobconnect-portal`

### Step 2: Configure MongoDB (Cloud Atlas or Local)
1. In the `backend` folder, copy `.env.example` to `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   # Paste your MongoDB Atlas Connection String here:
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/jobconnect?retryWrites=true&w=majority
   JWT_SECRET=jobconnect_super_secret_jwt_token_key_2026_xyz
   FRONTEND_URL=http://localhost:5173
   ```
2. *(See the next section below for step-by-step instructions on creating a 100% Free MongoDB Atlas database).*

### Step 3: Populate Demo Seed Data
In VS Code, open a new Terminal (`Ctrl + ~`) and run:
```bash
cd backend
npm run seed
```
This automatically populates the database with:
- 🛡️ Super Admin account
- 💼 2 Verified Recruiting Companies (TechCorp, CloudScale)
- 👤 2 Job Seekers with uploaded resumes and skills
- 🚀 8+ realistic jobs across IT, Design, DevOps, Management
- 📋 Sample active applications with *Shortlisted* and *Interview Scheduled* statuses!

### Step 4: Start the Backend Server
In the backend terminal, run:
```bash
npm run dev
# or
npm start
```
You will see:
```
🚀 JobConnect Backend Server running in development mode on port 5000
📡 Health Check: http://localhost:5000/api/health
✅ MongoDB Connected Successfully
```

### Step 5: Start the Frontend Application
Open a **second terminal split** in VS Code (`Ctrl + Shift + 5` or click the `+` button in Terminal), then run:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at:
`http://localhost:5173`

---

## 🍃 Step-by-Step: Setting Up Cloud MongoDB Atlas (Link Based)

To run without needing a local MongoDB installation and to easily connect live online:

1. **Sign Up / Log In to MongoDB Atlas**:
   - Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register).
   - Sign up with your Google account (100% Free).
2. **Create a Free Cluster**:
   - Select **M0 Free** (Shared) cluster.
   - Choose your nearest cloud provider region (e.g., AWS Mumbai / Singapore / US).
   - Click **Create Deployment**.
3. **Set Up Security & Credentials**:
   - Create a Database User (e.g., Username: `jobconnect_admin`, Password: `your_strong_password`).
   - Under **Network Access ➔ IP Access List**, click **Add IP Address**.
   - Select **Allow Access From Anywhere (`0.0.0.0/0`)** and click **Confirm**.
4. **Get the Connection String**:
   - Go to **Database ➔ Connect ➔ Drivers (Node.js)**.
   - Copy the connection string format:
     `mongodb+srv://jobconnect_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your database user password.
   - Paste this into `backend/.env` as `MONGO_URI`.

---

## 🔑 Quick Demo Login Credentials

You can test all 3 roles instantly using the **1-Click Test Logins** on the login page, or manually entering:

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@jobconnect.com` | `admin123` | Platform analytics, user activation/blocking, job moderation, company verification |
| **Recruiter** | `techcorp@recruiter.com` | `recruiter123` | Post new jobs, view applicant resumes, shortlist/reject, schedule interviews |
| **Job Seeker** | `rahul.dev@seeker.com` | `seeker123` | Search & filter jobs, 1-click apply, track application status, join scheduled interview |

---

## 🌐 How to Deploy Live (Connecting Frontend & Backend with URLs)

Instead of running on localhost, you can deploy both sides online completely free:

### 1. Backend Deployment (Render or Railway)
1. Push your repository to GitHub.
2. Go to [Render.com](https://render.com) and click **New ➔ Web Service**.
3. Connect your GitHub repository and set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add Environment Variables on Render:
   - `MONGO_URI` = Your MongoDB Atlas Connection String
   - `JWT_SECRET` = A strong secret key
   - `NODE_ENV` = `production`
5. Render gives you a live link: `https://jobconnect-backend.onrender.com`.

### 2. Frontend Deployment (Vercel)
1. Go to [Vercel.com](https://vercel.com) and click **Add New ➔ Project**.
2. Select your repository:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
3. Add Environment Variable:
   - `VITE_API_URL` = `https://jobconnect-backend.onrender.com/api`
4. Click **Deploy**. Vercel will give you a live frontend URL (e.g., `https://jobconnect-portal.vercel.app`).
Now your application is 100% online with live linked URLs!

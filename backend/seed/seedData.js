const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobconnect';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});

    console.log('🧹 Existing data wiped cleanly.');

    // 1. Create Super Admin
    const admin = await User.create({
      name: 'System Super Admin',
      email: 'admin@jobconnect.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    // 2. Create Recruiters
    const recruiter1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'techcorp@recruiter.com',
      password: 'recruiter123',
      role: 'recruiter',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    });

    const recruiter2 = await User.create({
      name: 'Michael Chen',
      email: 'cloudscale@recruiter.com',
      password: 'recruiter123',
      role: 'recruiter',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    // 3. Create Companies
    const company1 = await Company.create({
      recruiter: recruiter1._id,
      name: 'TechCorp Global',
      tagline: 'Empowering the future through cloud and AI innovations',
      description: 'TechCorp Global is a premier software engineering firm operating in 15+ countries, building mission-critical enterprise applications.',
      website: 'https://techcorp.example.com',
      industry: 'Information Technology',
      companySize: '201-500',
      location: 'San Francisco, CA (Remote Friendly)',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      isApproved: true,
    });

    const company2 = await Company.create({
      recruiter: recruiter2._id,
      name: 'CloudScale Systems',
      tagline: 'High performance distributed architectures made simple',
      description: 'CloudScale Systems designs next-generation serverless platforms, helping modern startups scale effortlessly.',
      website: 'https://cloudscale.example.com',
      industry: 'Cloud & Infrastructure',
      companySize: '51-200',
      location: 'New York, NY (Hybrid)',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      isApproved: true,
    });

    // 4. Create Job Seekers
    const seeker1 = await User.create({
      name: 'Rahul Manna',
      email: 'rahul.dev@seeker.com',
      password: 'seeker123',
      role: 'seeker',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    });

    const seeker2 = await User.create({
      name: 'Ananya Sharma',
      email: 'ananya.design@seeker.com',
      password: 'seeker123',
      role: 'seeker',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    });

    // 5. Create Profiles for Seekers
    await Profile.create({
      user: seeker1._id,
      headline: 'Full Stack MERN Developer | React & Node.js Enthusiast',
      bio: 'Full Stack Engineer with 3+ years of experience crafting dynamic, scalable web apps with React, Node.js, Express, and MongoDB.',
      phone: '+91 98765 43210',
      location: 'Kolkata, India',
      skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Git', 'REST APIs'],
      experienceLevel: 'Mid-level (3-5 yrs)',
      expectedSalary: '$85,000',
      preferredLocation: 'Remote',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeName: 'Rahul_Manna_Resume_2026.pdf',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      profileCompletion: 90,
      education: [
        {
          degree: 'B.Tech in Computer Science',
          institution: 'MAKAUT University',
          fieldOfStudy: 'Computer Science & Engineering',
          startYear: '2020',
          endYear: '2024',
        },
      ],
      experience: [
        {
          title: 'Full Stack Web Developer',
          company: 'NextGen Solutions',
          location: 'Remote',
          startDate: '2024',
          endDate: 'Present',
          current: true,
          description: 'Developed responsive dashboard interfaces, REST APIs, and automated MongoDB indexing.',
        },
      ],
    });

    await Profile.create({
      user: seeker2._id,
      headline: 'UI/UX Designer & Frontend Styler | Figma & Tailwind',
      bio: 'Creative UI/UX Designer crafting user-centric design systems, clickable prototypes, and high-converting landing pages.',
      phone: '+91 91234 56789',
      location: 'Bengaluru, India',
      skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Tailwind CSS', 'HTML5/CSS3', 'User Research'],
      experienceLevel: 'Fresher',
      expectedSalary: '$50,000',
      preferredLocation: 'Remote / Hybrid',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeName: 'Ananya_Sharma_Portfolio.pdf',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      profileCompletion: 85,
    });

    // 6. Create Realistic Jobs
    const jobsData = [
      {
        recruiter: recruiter1._id,
        company: company1._id,
        title: 'Senior Full Stack MERN Developer',
        category: 'Development & IT',
        jobType: 'Full-time',
        workplaceType: 'Remote',
        location: 'Remote (Worldwide)',
        experienceLevel: '3-5 Years',
        salaryMin: 95000,
        salaryMax: 135000,
        currency: 'USD',
        description: 'We are seeking an experienced Senior MERN Stack Developer to architect and deliver next-generation scalable cloud web applications. You will collaborate closely with UI/UX designers and backend systems teams.',
        requirements: [
          '3+ years hands-on production experience with React, Node.js, Express, and MongoDB',
          'Proficiency with TypeScript, state management (Redux/Zustand), and REST/GraphQL APIs',
          'Solid understanding of database indexing, query optimization, and schema design',
          'Experience deploying containerized services or serverless platforms',
        ],
        responsibilities: [
          'Design and implement high-performance, responsive React web portals',
          'Build secure RESTful microservices with Node.js and Express',
          'Participate in code reviews, automated CI/CD pipelines, and sprint planning',
        ],
        skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript', 'Tailwind CSS'],
        status: 'Published',
        isFeatured: true,
        applicantsCount: 1,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        recruiter: recruiter2._id,
        company: company2._id,
        title: 'Lead Frontend React Architect',
        category: 'Development & IT',
        jobType: 'Full-time',
        workplaceType: 'Remote',
        location: 'San Francisco, CA / Remote',
        experienceLevel: '5+ Years',
        salaryMin: 120000,
        salaryMax: 160000,
        currency: 'USD',
        description: 'Drive the frontend architecture of our flagship analytics platform. You will lead technical standards, mentor junior engineers, and create reusable UI component systems.',
        requirements: [
          '5+ years deep expertise with React, modern JavaScript ESNext, and TypeScript',
          'Demonstrated track record designing component libraries and micro-frontends',
          'Strong performance optimization skills (Lighthouse, Core Web Vitals, SSR/SSG)',
        ],
        responsibilities: [
          'Define frontend design system and best engineering practices',
          'Lead frontend team sprint deliverables and technical architecture meetings',
        ],
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux Toolkit', 'Testing Library'],
        status: 'Published',
        isFeatured: true,
        applicantsCount: 1,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
      {
        recruiter: recruiter1._id,
        company: company1._id,
        title: 'Backend Node.js & Microservices Engineer',
        category: 'Development & IT',
        jobType: 'Full-time',
        workplaceType: 'Hybrid',
        location: 'New York, NY',
        experienceLevel: '1-3 Years',
        salaryMin: 85000,
        salaryMax: 110000,
        currency: 'USD',
        description: 'Join our backend squad to build high-throughput APIs and reliable real-time event pipelines.',
        requirements: [
          '2+ years working with Node.js, Express, MongoDB, and Redis',
          'Strong grasp of JWT authentication, RBAC, and API security practices',
        ],
        responsibilities: [
          'Maintain and enhance RESTful APIs and Socket.IO microservices',
          'Optimize MongoDB queries and aggregation pipelines',
        ],
        skills: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'Docker', 'Socket.IO'],
        status: 'Published',
        isFeatured: true,
        applicantsCount: 0,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        recruiter: recruiter1._id,
        company: company1._id,
        title: 'Product UI/UX Designer',
        category: 'Design & Creative',
        jobType: 'Full-time',
        workplaceType: 'Remote',
        location: 'Remote',
        experienceLevel: '1-3 Years',
        salaryMin: 70000,
        salaryMax: 95000,
        currency: 'USD',
        description: 'Create intuitive, sleek, and high-impact digital experiences for our B2B SaaS products.',
        requirements: [
          'Strong portfolio showcasing mobile and desktop web UI/UX case studies',
          'Mastery in Figma, wireframing, interactive prototyping, and design systems',
        ],
        responsibilities: [
          'Conduct user interviews and usability testing',
          'Translate user problems into elegant interactive wireframes and polished UI mockups',
        ],
        skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
        status: 'Published',
        isFeatured: true,
        applicantsCount: 1,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
      {
        recruiter: recruiter2._id,
        company: company2._id,
        title: 'Junior MERN Stack Developer (Fresher Friendly)',
        category: 'Development & IT',
        jobType: 'Full-time',
        workplaceType: 'Remote',
        location: 'Remote',
        experienceLevel: 'Fresher',
        salaryMin: 45000,
        salaryMax: 65000,
        currency: 'USD',
        description: 'Exciting entry-level role for passionate developers who have built hands-on MERN stack personal or academic projects.',
        requirements: [
          'Demonstrated knowledge of React, JavaScript (ES6+), Node.js, and MongoDB',
          'Eagerness to learn, collaborate, and write clean, maintainable code',
        ],
        responsibilities: [
          'Build UI features and assist in building REST API endpoints',
          'Fix bugs and write unit tests alongside senior engineers',
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'CSS3'],
        status: 'Published',
        isFeatured: true,
        applicantsCount: 0,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      },
      {
        recruiter: recruiter2._id,
        company: company2._id,
        title: 'DevOps & Cloud Engineer (AWS / Kubernetes)',
        category: 'Development & IT',
        jobType: 'Full-time',
        workplaceType: 'Remote',
        location: 'Remote',
        experienceLevel: '3-5 Years',
        salaryMin: 105000,
        salaryMax: 145000,
        currency: 'USD',
        description: 'Maintain cloud infrastructure, automate deployment pipelines, and safeguard high availability across global regions.',
        requirements: [
          'Experience with AWS (EC2, ECS, S3, RDS), Docker, and Kubernetes',
          'Proficiency with CI/CD tools (GitHub Actions) and Terraform',
        ],
        responsibilities: [
          'Build self-healing cloud clusters and monitoring dashboards (Prometheus/Grafana)',
          'Manage infrastructure as code and zero-downtime blue-green deployments',
        ],
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
        status: 'Published',
        isFeatured: false,
        applicantsCount: 0,
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      },
      {
        recruiter: recruiter1._id,
        company: company1._id,
        title: 'Senior Product Manager',
        category: 'Product Management',
        jobType: 'Full-time',
        workplaceType: 'Hybrid',
        location: 'San Francisco, CA',
        experienceLevel: '5+ Years',
        salaryMin: 130000,
        salaryMax: 175000,
        currency: 'USD',
        description: 'Define product vision, lead roadmap execution, and align business goals with engineering teams.',
        requirements: [
          'Proven success managing SaaS products from discovery through market launch',
          'Data-driven mindset with deep customer empathy',
        ],
        responsibilities: [
          'Own the product roadmap and prioritize feature backlogs',
          'Coordinate cross-functional initiatives across design, engineering, and sales',
        ],
        skills: ['Product Strategy', 'Agile / Scrum', 'Roadmapping', 'User Analytics', 'Jira'],
        status: 'Published',
        isFeatured: false,
        applicantsCount: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        recruiter: recruiter2._id,
        company: company2._id,
        title: 'Growth Marketing & SEO Specialist',
        category: 'Sales & Marketing',
        jobType: 'Full-time',
        workplaceType: 'Remote',
        location: 'Remote',
        experienceLevel: '1-3 Years',
        salaryMin: 60000,
        salaryMax: 85000,
        currency: 'USD',
        description: 'Scale organic acquisition channels, execute paid search campaigns, and boost inbound customer conversions.',
        requirements: [
          'Proven record in SEO optimization, content distribution, and analytics',
          'Familiarity with Google Analytics 4, Ahrefs, and email automation tools',
        ],
        responsibilities: [
          'Analyze traffic funnels and run A/B testing on landing pages',
          'Drive social campaigns and technical SEO strategies',
        ],
        skills: ['SEO', 'Google Analytics', 'Content Strategy', 'Growth Marketing', 'A/B Testing'],
        status: 'Published',
        isFeatured: false,
        applicantsCount: 0,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
    ];

    const createdJobs = await Job.insertMany(jobsData);
    console.log(`✅ Created ${createdJobs.length} Jobs across categories.`);

    // 7. Create Sample Applications with rich statuses
    // Seeker 1 applied to Senior MERN (Shortlisted)
    await Application.create({
      job: createdJobs[0]._id,
      seeker: seeker1._id,
      recruiter: recruiter1._id,
      company: company1._id,
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeName: 'Rahul_Manna_Resume_2026.pdf',
      coverLetter: 'Hello TechCorp team! I have built several high-traffic MERN stack portals and would love to bring my experience in React and Node.js microservices to your team.',
      status: 'Shortlisted',
      feedback: 'Excellent portfolio and strong experience with full-stack architecture.',
    });

    // Seeker 1 applied to Lead Frontend (Interview Scheduled)
    await Application.create({
      job: createdJobs[1]._id,
      seeker: seeker1._id,
      recruiter: recruiter2._id,
      company: company2._id,
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeName: 'Rahul_Manna_Resume_2026.pdf',
      coverLetter: 'Excited about the Lead Frontend role! Experienced with component systems and performance profiling.',
      status: 'Interview Scheduled',
      interviewDetails: {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: '11:00 AM EST',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        instructions: 'Technical round with engineering lead. Please have your code editor open.',
      },
    });

    // Seeker 2 applied to Product UI/UX Designer (Under Review)
    await Application.create({
      job: createdJobs[3]._id,
      seeker: seeker2._id,
      recruiter: recruiter1._id,
      company: company1._id,
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeName: 'Ananya_Sharma_Portfolio.pdf',
      coverLetter: 'Hi, I am thrilled about this opening. My design case studies align directly with your design system and product requirements.',
      status: 'Under Review',
    });

    // 8. Create Sample Notifications
    await Notification.create({
      recipient: seeker1._id,
      sender: recruiter2._id,
      title: 'Interview Scheduled! 📅',
      message: 'CloudScale Systems scheduled an interview for Lead Frontend React Architect.',
      type: 'INTERVIEW',
      link: '/seeker/dashboard?tab=applied',
    });

    await Notification.create({
      recipient: seeker1._id,
      sender: recruiter1._id,
      title: 'Application Shortlisted 🎉',
      message: 'TechCorp Global has shortlisted you for Senior Full Stack MERN Developer.',
      type: 'APPLICATION_STATUS',
      link: '/seeker/dashboard?tab=applied',
    });

    console.log('🎉 Seed database completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Default Test Credentials:');
    console.log('Super Admin:  admin@jobconnect.com     / admin123');
    console.log('Recruiter 1:  techcorp@recruiter.com    / recruiter123');
    console.log('Recruiter 2:  cloudscale@recruiter.com  / recruiter123');
    console.log('Seeker 1:     rahul.dev@seeker.com     / seeker123');
    console.log('Seeker 2:     ananya.design@seeker.com / seeker123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

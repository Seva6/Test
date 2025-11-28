# StudentStudy

A homework reminder and grade tracking web application for high school and college students.

## Features

- 📝 **Assignment Management** - Create, track, and manage daily homework and long-term projects
- 📊 **Grade Tracking** - Monitor your academic performance with percentage-based grades
- 📅 **Calendar View** - Visualize all your deadlines in a clean calendar interface
- 🔔 **Smart Reminders** - Get notified about upcoming due dates with escalating urgency
- 👥 **Class Management** - Teachers can create classes and add students
- 🌙 **Dark Mode** - Easy on the eyes with light and dark theme support
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, React Router v6
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase (Authentication + Firestore)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase project

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   cd studentstudy
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable **Authentication** with Email/Password provider
   - Create a **Firestore Database**
   - Go to Project Settings > Your Apps > Add Web App
   - Copy your Firebase configuration

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Set up Firestore Security Rules**
   In Firebase Console > Firestore > Rules, paste:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /classes/{classId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null;
       }
       match /assignments/{assignmentId} {
         allow read, write: if request.auth != null;
       }
       match /grades/{gradeId} {
         allow read, write: if request.auth != null;
       }
       match /notifications/{notificationId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
studentstudy/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Buttons, inputs, cards, etc.
│   │   ├── layout/      # Navbar, sidebar, layout
│   │   ├── auth/        # Authentication components
│   │   └── assignments/ # Assignment-specific components
│   ├── context/         # React contexts (Auth, Theme, Notifications)
│   ├── pages/           # Page components
│   ├── services/        # Firebase configuration
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## User Roles

### Students
- Create personal assignments
- View teacher-posted assignments
- Track assignment status (Not Started → In Progress → Completed)
- Record and view grades
- Join classes (added by teacher)

### Teachers
- Create and manage classes
- Add students to classes by student ID
- Post assignments to entire classes
- View student homework status

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Screenshots

The app features:
- Clean, modern dashboard with stats
- Assignment list with status toggles
- Calendar view with color-coded events
- Grade tracking with subject averages
- Class management for teachers
- Full dark mode support

## License

MIT License - feel free to use this project for learning or building your own homework app!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

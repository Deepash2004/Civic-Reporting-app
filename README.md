# CitySaathi - Civic Reporting Application

<div align="center">
  <h3>A modern, mobile-first web application designed to empower citizens to report and track civic issues in their community.</h3>
</div>

## 🌟 Overview

CitySaathi is a comprehensive Civic Reporting App designed with a premium user experience in mind. It enables residents to easily report infrastructure problems, track the resolution process, and engage with their local community. The application is built as a progressive web app (PWA) with a responsive design that seamlessly adapts from mobile devices to desktop displays using a sophisticated device-frame presentation.

This project is built for **resumes and portfolios** as a demonstration of modern frontend development practices, advanced UI/UX patterns, and robust state management.

## 🚀 Key Features

- **Seamless Onboarding & Authentication:** Guest login capability for instant access, with options for Google and email authentication.
- **Issue Reporting & Tracking:** A streamlined flow to submit issues (potholes, water leaks, garbage, etc.) with location tracking and media uploads.
- **Local Storage Persistence:** For demo purposes, the app relies on robust local storage to persist user data, reports, and notifications smoothly without requiring an active backend connection.
- **Offline Mode:** Gracefully handles network disconnections and syncs data when the connection is restored.
- **Community Feed:** View and interact with issues reported by others in your area.
- **Gamification:** Earn badges and build streaks by actively participating in keeping the city clean and safe.
- **Responsive "Device Mockup" Mode:** When viewed on a desktop, the app renders inside a sleek, interactive mobile device frame.

## 💻 Tech Stack

- **Framework:** React 18 & Vite
- **Styling:** Tailwind CSS & standard CSS
- **Components:** Radix UI primitives & custom-built components
- **Animations:** Framer Motion (`motion`) for fluid page transitions and micro-interactions
- **Icons:** Lucide React
- **Icons & Components Base:** Material UI (`@mui/material`)
- **Data Persistence:** Custom robust LocalStorage wrapper (`FallbackDataService`) & Firebase SDK (ready for backend integration)

## 🛠️ Local Development Setup

To run the project locally:

1. **Clone the repository** (or download the source code).

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the app:**
   Open `http://localhost:5173` in your browser. 
   *Tip: Resize your browser window to see the responsive desktop device frame!*

## 🎨 Design & Architecture

- **Mobile-First:** Core layouts use a fixed max-width container (`max-w-md`) to ensure the design remains pristine.
- **Desktop Device Frame:** On wider screens, the mobile UI is centered within a styled CSS device frame, complete with simulated rounded corners and borders (`rounded-[3rem] border-[14px]`).
- **Dark/Light Mode:** Includes theme provider context handling dynamic color schemes.
- **Graceful Fallbacks:** The app features a `ConnectionManager` that detects offline status and switches to local caching mechanisms immediately.

## 📝 License

This project is created for demonstration and portfolio purposes. Feel free to fork and modify for your own use.
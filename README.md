# BookNest - Library Management System (Frontend)

BookNest is a modern, high-performance Library Management System designed to provide a seamless experience for both readers and administrators. Built with Next.js, it features a dynamic user interface, intuitive search, and a comprehensive dashboard for managing library resources.

## 🚀 Live Links
- **Live Application:** [https://booknest-tau-virid.vercel.app/](https://booknest-tau-virid.vercel.app/)
- **Backend API:** [https://booknestserver-xi.vercel.app/](https://booknestserver-xi.vercel.app/)

## ✨ Key Features
- **Dynamic Homepage:** Features an animated hero banner managed directly from the admin dashboard.
- **Advanced Book Catalog:** Browse books by category, search by title/author/ISBN, and filter by availability.
- **Membership Plans:** Integrated subscription system with automated payment verification.
- **User Dashboard:** 
  - Manage active borrowings and history.
  - View and upgrade membership plans.
  - Profile management.
- **Admin Dashboard:**
  - **Banner Management:** Create, toggle, and update homepage promotional slides.
  - **Category & Book Management:** Full CRUD operations with Cloudinary image uploads.
  - **Member Management:** Track user roles and membership statuses.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing.
- **Dark Mode Support:** Sleek UI that respects user system preferences.
- **Password Reset:** Secure password reset functionality.
- **AI Chatbot:** AI-powered chatbot for book recommendations and queries.
## 🛠️ Technologies Used
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI & Radix UI
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React
- **Carousel:** Swiper.js
- **State Management:** React Hooks
- **Auth Client:** Better-Auth Client

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/shakhawat-coder/lmsfrontend
   cd lmsfrontend
   ```

2. Install dependencies:
   ```bash
   pnpm install 
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://booknestserver-xi.vercel.app
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Build for production:
   ```bash
   pnpm build
   ```

---
Developed as part of the Next Level Web Development Assignment.

# CampusEvent – Online Event Registration System

## 1. Project Overview

**CampusEvent** is a cloud-native, full-stack web application engineered to streamline and digitize college event management and student event registration. Built using **React**, **Vite**, **Tailwind CSS**, and **Firebase**, the platform bridges the gap between campus event organizers and students by providing a real-time, interactive, and centralized system. CampusEvent simplifies event discovery, automates seat reservation and cancellation, enforces seat capacity limits through atomic database operations, and equips administrators with comprehensive event management dashboards.

---

## 2. Problem Statement

Higher education institutions often rely on manual, fragmented, or disconnected processes—such as physical sign-up sheets, static Google Forms, or decentralized messaging channels—to organize campus workshops, technical symposiums, cultural fests, and sports tournaments. These legacy workflows suffer from several core deficiencies:

- **Lack of Centralized Discovery:** Students miss out on opportunities due to scattered event announcements across disparate communication platforms.
- **Overbooking and Capacity Errors:** Manual tracking fails to prevent registration overflow once maximum capacity is reached.
- **Race Conditions:** Simultaneous registrations often result in seat over-allocation.
- **Administrative Friction:** Event managers lack real-time visibility into attendee lists, live seat counts, and registration cancellations.

CampusEvent resolves these challenges by providing a centralized, scalable, cloud-backed solution featuring real-time data synchronization, automated seat availability tracking, and atomic transactions.

---

## 3. Objectives

The primary technical and operational objectives of CampusEvent include:

- **Student Authentication:** Secure registration and login workflows utilizing Firebase Authentication with email/password credentials.
- **Event Discovery:** Intuitive interface enabling students to explore, search, and filter campus events by category.
- **Event Registration:** Seamless multi-step event registration with real-time seat availability updates.
- **Registration Cancellation:** Instant registration cancellation with automatic seat capacity restoration.
- **Seat Availability Management:** Enforcing strict capacity constraints to eliminate double-booking or overbooking.
- **Admin Event Management:** Full CRUD (Create, Read, Update, Delete) capability for administrators to manage events and inspect registered attendee rosters.
- **Cloud Data Persistence:** High-availability data persistence via Cloud Firestore with atomic state synchronization.
- **Cloud Deployment:** Serverless, high-performance web deployment hosted on Firebase Hosting.

---

## 4. Key Features

CampusEvent implements a comprehensive feature set divided across student interaction, administration, and cloud integration.

### Student Features
- **Register / Login:** User registration and authentication using email and password.
- **Browse Events:** Dynamic view of active campus events with categories, descriptions, dates, venues, and live capacity badges.
- **Search Events:** Real-time search by event title or description.
- **Filter Events by Category:** Categorical filtering (e.g., Technical, Cultural, Workshop, Sports).
- **View Event Details:** Detailed modal view presenting complete event schedules, venue info, organzing body, and available seats.
- **Register for Events:** One-click registration for authenticated users with instant status confirmation.
- **Prevent Duplicate Registration:** Automated constraint checks ensuring students cannot register for the same event more than once.
- **View My Registrations:** Personalized dashboard displaying all events the logged-in student has registered for.
- **Cancel Registration:** Capability for students to release their registration prior to the event, triggering seat restoration.

### Admin Features
- **Admin Authentication:** Role-based access control identifying administrator credentials upon login.
- **Admin Dashboard:** Centralized control panel displaying system metrics, event statistics, and management tools.
- **View Event & Registration Info:** Overview of all created events, registration numbers, and real-time attendance ratios.
- **Create Events:** Event creation interface for specifying titles, descriptions, categories, dates, locations, images, and seat capacities.
- **Edit Events:** Modifying existing event details and updating total seat capacities.
- **Delete Events:** Removal of events along with associated registration records.
- **View Attendees:** Instant access to attendee rosters showing names, emails, and registration timestamps per event.

### Cloud Features
- **Firebase Authentication:** Managed security provider managing user identity tokens and session states.
- **Cloud Firestore:** NoSQL cloud document database providing live synchronization and persistent storage.
- **Firestore Transactions:** Atomic transaction execution ensuring seat decrement on registration and seat increment on cancellation without race conditions.
- **Firebase Hosting:** Global CDN deployment delivering optimized static assets over HTTPS.

---

## 5. Technology Stack

| Layer / Role | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React | Component-based UI library for dynamic user interfaces |
| **Build Tool & Server** | Vite | Lightning-fast build tool and local development server |
| **Language / Syntax** | JavaScript / JSX | Core programming language and React template extension |
| **Styling Framework** | Tailwind CSS | Utility-first CSS framework for custom responsive design |
| **Authentication** | Firebase Authentication | Identity management supporting Email/Password auth |
| **Cloud Database** | Cloud Firestore | Scalable NoSQL cloud database for real-time storage |
| **Web Hosting** | Firebase Hosting | Production-grade hosting via global Content Delivery Network |
| **Version Control** | Git | Distributed version control system |
| **Code Repository** | GitHub | Remote repository hosting and source code management |
| **AI / Vibe Coding Tool** | Antigravity IDE | AI-assisted development environment for code generation and testing |

---

## 6. System Architecture

CampusEvent follows a modular serverless web application architecture. The frontend handles client presentation, state management, and user interaction, while Firebase cloud services manage authentication, persistence, and static hosting.

### Architectural Flow

```
+-------------------------------------------------------+
|                    Student / Admin                    |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|                 React + Vite Frontend                 |
|   (App.jsx, Components, Tailwind CSS UI Elements)     |
+-------------------------------------------------------+
                           |
            +--------------+--------------+
            |                             |
            v                             v
+-----------------------+     +-------------------------+
| Firebase Auth Service |     |  Application Services   |
| (Authentication Flow) |     |  (auth, event, reg)     |
+-----------------------+     +-------------------------+
                                          |
                                          v
                              +-------------------------+
                              |     Cloud Firestore     |
                              |      (NoSQL Data)       |
                              +-------------------------+
                                          |
                        +-----------------+-----------------+
                        |                 |                 |
                        v                 v                 v
                   [  users  ]       [  events  ]    [registrations]
```

### Infrastructure & Operations
- **Firebase Hosting:** Static single-page application assets are compiled into optimized bundles and served securely over global Firebase CDN servers.
- **Atomic Concurrency Control:** Firestore database transactions are utilized during registration creation and cancellation workflows. When a student registers or cancels, a multi-document transaction reads the event's `availableSeats`, checks constraints, and updates `availableSeats` atomically alongside registration document writes.

---

## 7. Firestore Database Structure

Cloud Firestore stores application state using three primary NoSQL collections:

### 1. `users` Collection
Stores user profile information, contact details, and role authorization.
- `uid` (string, Document ID): Unique Firebase Authentication User ID
- `name` (string): Full name of the user
- `email` (string): User email address
- `role` (string): User role (`"student"` or `"admin"`)
- `createdAt` (timestamp): Account creation timestamp

### 2. `events` Collection
Stores event metadata, schedules, and live seating capacity.
- `id` (string, Document ID): Unique Event ID
- `title` (string): Event title
- `description` (string): Comprehensive event description
- `category` (string): Category (e.g., Technical, Cultural, Workshop, Sports)
- `date` (string/timestamp): Event date and time
- `location` (string): Campus venue or virtual link
- `capacity` (number): Maximum allowable attendees
- `availableSeats` (number): Remaining open seats for registration
- `imageUrl` (string): Event banner image URL
- `createdBy` (string): UID of the administrator who created the event
- `createdAt` (timestamp): Event creation timestamp

### 3. `registrations` Collection
Stores student-to-event registration mappings.
- `id` (string, Document ID): Unique Registration ID
- `eventId` (string): Reference ID of the registered event
- `eventTitle` (string): Title snapshot of the registered event
- `userId` (string): Reference UID of the registered student
- `userName` (string): Name snapshot of the student
- `userEmail` (string): Email snapshot of the student
- `registeredAt` (timestamp): Registration timestamp

---

## 8. Registration Workflow

The event registration process enforces strict validation and atomic updates:

```
[Student Selects Event]
          │
          ▼
[Check Authentication] ──(Not Logged In)──► Prompt Login / Auth Modal
          │
      (Logged In)
          ▼
[Check Duplicate Registration] ──(Already Registered)──► Display Alert ("Already Registered")
          │
      (Not Registered)
          ▼
[Check Seat Availability] ──(availableSeats <= 0)──► Display Alert ("Event Full")
          │
    (Seats Available)
          ▼
[Execute Firestore Transaction]
  ├─ 1. Re-read event document (Locking state)
  ├─ 2. Confirm availableSeats > 0
  ├─ 3. Decrement availableSeats by 1
  └─ 4. Create new registration document in `registrations`
          │
          ▼
[Update Local State & UI] ──► Event appears in "My Registrations"
```

---

## 9. Cancellation Workflow

The registration cancellation process restores available capacity using atomic transactions:

```
[Student Clicks "Cancel Registration"]
          │
          ▼
[Execute Firestore Transaction]
  ├─ 1. Read target `registrations` document & `events` document
  ├─ 2. Delete target document from `registrations` collection
  └─ 3. Increment `availableSeats` by 1 on corresponding `events` document
          │
          ▼
[Refresh Application State]
  ├─ Remove item from "My Registrations" view
  └─ Update available seat counter on Event Card / Details Modal
```

---

## 10. Admin Workflow

Administrators possess elevated permissions to manage the lifecycle of campus events:

```
[Admin Login]
      │
      ▼
[Redirect to Admin Dashboard]
      │
      ├───────────────────────────────┬───────────────────────────────┐
      ▼                               ▼                               ▼
[Create Event]                  [Edit / Delete Event]           [View Attendees]
  │                               │                               │
  ├─ Open EventFormModal          ├─ Select existing event        ├─ Click "View Attendees"
  ├─ Fill event metadata          ├─ Modify fields or select Del  ├─ Fetch matching records
  ├─ Set capacity & available     ├─ Submit atomic update/delete  └─ Display student roster
  └─ Save to `events` collection  └─ Update `events` collection
```

---

## 11. Project Structure

The codebase is organized in a modular React application architecture:

```
c:\Users\satwi\VibeCoding\
├── .env.example
├── .firebaserc
├── .gitignore
├── firebase.json
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx
    ├── firebase.js
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── AdminDashboard.jsx
    │   ├── AuthModal.jsx
    │   ├── EventCard.jsx
    │   ├── EventDetailModal.jsx
    │   ├── EventFormModal.jsx
    │   ├── Hero.jsx
    │   ├── MyRegistrations.jsx
    │   ├── Navbar.jsx
    │   └── Toast.jsx
    └── services/
        ├── authService.js
        ├── eventService.js
        ├── mockStore.js
        └── registrationService.js
```

### Directory & File Roles
- **`src/firebase.js`:** Initializes Firebase app instance, Firebase Auth, and Cloud Firestore.
- **`src/services/`:** Encapsulates core backend interaction scripts (`authService.js`, `eventService.js`, `registrationService.js`, and fallback store `mockStore.js`).
- **`src/components/`:** Houses reusable UI components, modals, navigation header, hero banner, dashboard views, and toast notifications.
- **`src/App.jsx`:** Main application layout component handling session state, active tabs, search, filtering, and modal triggers.
- **`firebase.json` & `.firebaserc`:** Configuration files defining deployment rules and project target for Firebase Hosting.

---

## 12. Environment Configuration

CampusEvent connects to Firebase using Vite client-side environment variables defined in a local `.env` file.

### Required Variable Schema

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> [!IMPORTANT]
> **Security Notice:** The local `.env` file contains sensitive parameters and is strictly excluded from version control via `.gitignore`. Never commit actual API keys or credentials to public repositories. Standard configuration templates are provided in `.env.example`.

---

## 13. Local Installation

Follow these steps to set up and run CampusEvent locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Satwikvheusiav/online-event-registration.git
   ```

2. **Navigate to Project Directory**
   ```bash
   cd online-event-registration
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in the project root based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. **Configure Firebase Credentials**
   Open `.env` and replace placeholders with valid Firebase project credentials obtained from the Firebase Console.

6. **Launch Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to view the application.

---

## 14. Production Build

To compile the application into production-ready static assets:

```bash
npm run build
```

The build process invokes Vite to bundle and minify JavaScript, CSS, and HTML assets into the `/dist` output directory.

---

## 15. Firebase Hosting Deployment

Deploying the compiled application to Firebase Hosting requires the Firebase CLI.

### Deployment Commands

```bash
# 1. Authenticate with Firebase CLI
firebase login

# 2. Select active Firebase project target
firebase use campusevent-5abbc

# 3. Build production bundle
npm run build

# 4. Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Production Application URL
- **Live Application:** [https://campusevent-5abbc.web.app](https://campusevent-5abbc.web.app)

---

## 16. Testing

The application underwent rigorous manual and end-to-end integration verification prior to release, covering the following scopes:

- **Firebase Authentication:** User registration, email/password validation, login, persistent session state, and logout functionality.
- **Event Browsing & Discovery:** Live rendering of event lists, category-based filtering, and title search queries.
- **Event Registration & Validation:** Registration flow, duplicate registration blocking, and capacity enforcement.
- **Registration Cancellation & Seat Restoration:** Instant cancellation, item deletion from user view, and automatic `availableSeats` restoration.
- **My Registrations View:** Correct association of registered events with logged-in user credentials.
- **Admin Functionality:** Dashboard rendering, complete Event CRUD operations, and attendee roster generation.
- **Cloud Firestore Persistence:** Verification of real-time multi-client document creation, updates, and deletes.
- **Production Build & Deployment Verification:** Build validation via `npm run build` and production verification on Firebase Hosting.

> [!NOTE]
> **Resolved Issue:** During initial cancellation testing, a Firestore transaction bug was identified where document reference locks failed to resolve during cancellation. The transaction handling logic was refactored in `registrationService.js` to ensure clean atomic state transitions, verified upon subsequent testing.

---

## 17. Security Considerations

The following security standards and practices are maintained:

- **Version Control Exclusions:** Sensitive files (`.env`, `node_modules/`, `dist/`) are explicitly excluded from Git indexing using `.gitignore`.
- **Template Provisioning:** Baseline environment requirements are documented safely in `.env.example` using placeholder values.
- **Client-Side Auth State:** User authentication states are tokenized and validated through Firebase Authentication handlers.
- **Data Persistence Security:** Cloud Firestore stores records under structured schemas (`users`, `events`, `registrations`).

> [!NOTE]
> **Firestore Security Rules:** Server-side Firestore Security Rules (`firestore.rules`) are enforced on the Firebase Cloud Backend. Because security rules are managed within the Firebase Console / Cloud Portal, local source file verification of rule contents could not be evaluated directly from repository files.

---

## 18. Cloud Strategy / Syllabus Alignment

CampusEvent directly implements key concepts taught in the **Cloud Strategy Planning and Management** course curriculum:

- **Cloud Applications & Platforms:** Transitioning from localized/manual software to a multi-tenant cloud-native Web Application.
- **Cloud Architecture & Strategy:** Utilizing serverless computing patterns to reduce infrastructure overhead, capital expenditure (CapEx), and operational expenditure (OpEx).
- **Cloud Databases:** Leveraging managed NoSQL databases (Cloud Firestore) for dynamic scaling and multi-region availability.
- **Public Cloud Services:** Integrating Platform-as-a-Service (PaaS) and Backend-as-a-Service (BaaS) offerings from Google Firebase.
- **Service-Oriented Architecture:** Structuring front-end capabilities around decoupled modular micro-services (`authService`, `eventService`, `registrationService`).
- **IT as a Service (ITaaS):** Delivering on-demand campus registration capabilities to end users via web-accessible software services.

---

## 19. Vibe Coding / AI-Assisted Development

CampusEvent was developed using **Antigravity IDE**, an advanced AI-assisted coding environment. The AI agent contributed across multiple phases of the project lifecycle:

- **Rapid Prototyping & UI Design:** Scaffolded responsive React components styled with Tailwind CSS.
- **Service Abstraction:** Generated clean service modules for Firebase Authentication and Firestore interaction.
- **Debugging & Issue Resolution:** Assisted in diagnosing and fixing Firestore transaction locking issues during cancellation testing.
- **Build & Deployment Prep:** Verified build scripts, configuration parameters, and static asset generation for production hosting.

---

## 20. Important Development Prompts

Development was structured across three major prompt categories:

1. **Frontend Development & UI Design:**
   *Prompts focused on crafting responsive layouts, component hierarchy, category filters, modals, and Tailwind CSS themes.*
2. **Backend & Firebase Integration:**
   *Prompts focused on setting up Firebase initialization, authentication logic, Firestore schemas, and atomic transaction routines.*
3. **Testing, Debugging, & Deployment:**
   *Prompts focused on conducting end-to-end testing, debugging transaction edge cases, optimizing Vite build output, and deploying to Firebase Hosting.*

---

## 21. Deployment & Links

- **Live Application:** [https://campusevent-5abbc.web.app](https://campusevent-5abbc.web.app)
- **GitHub Repository:** [https://github.com/Satwikvheusiav/online-event-registration](https://github.com/Satwikvheusiav/online-event-registration)

---

## 22. Future Improvements

Planned future enhancements for CampusEvent include:

- **Automated Email Notifications:** Triggering confirmation emails and schedule updates upon registration via Cloud Functions for Firebase.
- **QR-Code Event Check-in:** Generating unique QR passes for registered students for seamless on-site check-in scanning.
- **Event Reminders & Calendar Sync:** Allowing students to export event schedules directly to Google Calendar or Apple Calendar.
- **Analytics & Reporting Dashboard:** Providing organizers with graphic charts tracking registration velocity, attendance rates, and category popularity.
- **Digital Certificate Generation:** Automatically issuing participation certificates to attendees following event completion.

---

## 23. Author

- **Student:** Satwik Sadana
- **Register Number:** RA2311028010051

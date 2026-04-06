# 📊 Task Monitor - Enterprise Task & Goal Management

A modern, enterprise-level task and goal management application built with React, Vite, and Tailwind CSS. Streamline your productivity with intuitive task tracking and goal monitoring.

## ✨ Features

### 🎯 Dashboard
- Real-time analytics and statistics
- Task status overview
- Progress tracking for goals
- Visual trending and insights
- Quick access to key metrics

### ✅ Task Management
- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Status Tracking**: Pending, In Progress, Completed states
- **Priority Levels**: Low, Medium, High priority classification
- **Due Date Management**: Set and track deadlines
- **Quick Actions**: Start or complete tasks with one click
- **Smart Filtering**: Filter by status and priority

### 🎪 Goal Management
- **Yearly Goals**: Set annual objectives with progress tracking
- **Monthly Goals**: Break down goals into monthly milestones
- **Progress Visualization**: Beautiful progress bars and indicators
- **Target Tracking**: Monitor current vs. target values
- **Deadline Management**: Set and track completion deadlines

### 🎨 User Experience
- **Responsive Design**: Perfectly optimized for all devices
- **Modern UI**: Built with Tailwind CSS
- **Smooth Interactions**: Loading states and transitions
- **Error Handling**: User-friendly error messages
- **Authentication**: Secure token-based login
- **Intuitive Navigation**: Sidebar + top navigation

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd task-monitor-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API endpoint
# VITE_API_URL=http://localhost:8080

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Architecture

```
src/
├── api/                 # API integration layer
│   ├── axiosConfig.js   # Axios setup with interceptors
│   ├── authApi.js       # Authentication endpoints
│   ├── taskApi.js       # Task CRUD operations
│   ├── monthlyGoalApi.js # Monthly goals API
│   ├── yearlyGoalApi.js  # Yearly goals API
│   └── dashboardApi.js   # Dashboard analytics
├── components/          # Reusable React components
│   ├── Common.jsx       # Button, Card, Input, Badge
│   ├── Modal.jsx        # Modal dialogs
│   ├── Layout.jsx       # Navbar, Sidebar, MainLayout
│   ├── DataDisplay.jsx  # Table, StatsCard, ProgressBar
│   ├── Form.jsx         # Form inputs and helpers
│   └── index.js         # Component exports
├── context/             # React Context
│   └── AuthContext.jsx  # Authentication context
├── hooks/               # Custom React Hooks
│   ├── useCustom.js    # useForm, useFetch, useAsync
│   └── index.js         # Hook exports
├── pages/               # Page components
│   ├── Login.jsx        # Authentication
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Tasks.jsx        # Task management
│   ├── MonthlyGoals.jsx # Monthly goals
│   └── YearlyGoals.jsx  # Yearly goals
├── routes/              # Route configuration
│   ├── AppRoutes.jsx    # All routes
│   └── ProtectedRoutes.jsx # Route protection
├── utils/               # Utility functions
│   └── helpers.js       # Date, validation utilities
├── App.jsx              # App component
└── main.jsx             # Entry point
```

## 🔧 API Endpoints

The application expects these endpoints from the backend:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Current user info

### Tasks
```
GET    /api/tasks              # Get all tasks
GET    /api/tasks/:id          # Get task by ID
POST   /api/tasks              # Create task
PUT    /api/tasks/:id          # Update task
PUT    /api/tasks/:id/start    # Start task
PUT    /api/tasks/:id/complete # Complete task
DELETE /api/tasks/:id          # Delete task
```

### Yearly Goals
```
GET    /api/yearly-goals       # Get all
GET    /api/yearly-goals/:id   # Get by ID
POST   /api/yearly-goals       # Create
PUT    /api/yearly-goals/:id   # Update
DELETE /api/yearly-goals/:id   # Delete
```

### Monthly Goals
```
GET    /api/monthly-goals              # Get all
GET    /api/monthly-goals/:yearlyGoalId # Get by yearly goal
POST   /api/monthly-goals              # Create
PUT    /api/monthly-goals/:id          # Update
DELETE /api/monthly-goals/:id          # Delete
```

### Dashboard
```
GET /api/dashboard/stats      # Get statistics
GET /api/dashboard/overview   # Get overview
GET /api/dashboard/task-stats # Task statistics
GET /api/dashboard/goal-stats # Goal statistics
```

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI Framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **Axios** | HTTP client |
| **React Router v7** | Client-side routing |
| **Lucide React** | Icons |
| **Context API** | State management |

## 📋 Component Examples

### Using the Button Component
```jsx
import { Button } from './components';

<Button variant="primary" size="md">
  Click Me
</Button>
```

Variants: `primary`, `secondary`, `danger`
Sizes: `sm`, `md`, `lg`

### Using the Form Hook
```jsx
import { useForm } from './hooks';

const form = useForm(
  { email: '', password: '' },
  handleSubmit
);

<input 
  name="email"
  value={form.values.email}
  onChange={form.handleChange}
/>
```

### Using the useFetch Hook
```jsx
const { data, isLoading, error } = useFetch(
  () => taskApi.getAll(),
  []
);
```

### Using the Modal Component
```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create Task"
  footerButtons={<Button>Save</Button>}
>
  Modal content here
</Modal>
```

## 🔐 Authentication

The app uses token-based authentication:

1. User logs in with credentials
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. 401 responses redirect to login
6. Token is cleared on logout

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Success**: Green
- **Warning**: Yellow
- **Danger**: Red

### Components
- **Card**: White background with shadow
- **Button**: Full-width or inline with hover effects
- **Input**: Consistent styling with focus states
- **Badge**: For status indicators
- **Table**: Responsive with hover effects

## 📱 Responsive Design

- **Mobile**: Single column layout
- **Tablet**: Multi-column with sidebar collapse
- **Desktop**: Full featured layout with fixed sidebar

## 🚦 Environment Variables

Create a `.env` file:
```
VITE_API_URL=http://localhost:8080
```

## 📦 Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Commit with descriptive messages
4. Create pull request

## 📄 License

MIT License - feel free to use this in your projects!

## 💬 Support

For issues or questions:
1. Check the [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed docs
2. Create an issue in the repository
3. Contact the development team

---

**Built with ❤️ for productive teams**


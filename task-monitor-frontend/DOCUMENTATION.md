# Task Monitor Frontend

A modern, enterprise-level task and goal management application built with React, Vite, and Tailwind CSS.

## Features

### Dashboard
- **Analytics Overview**: Real-time statistics and metrics
- **Task Summary**: Quick view of task status distribution
- **Goal Tracking**: Monitor progress on yearly and monthly goals
- **Progress Charts**: Visual representation of productivity trends
- **Quick Stats**: Key performance indicators at a glance

### Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Status Tracking**: Pending, In Progress, Completed
- **Priority Levels**: Low, Medium, High
- **Due Dates**: Set and track task deadlines
- **Bulk Actions**: Complete or start multiple tasks
- **Filtering**: Filter tasks by status and priority

### Goal Management
- **Yearly Goals**: Set annual objectives with progress tracking
- **Monthly Goals**: Break down goals by month
- **Progress Bars**: Visual progress indicators
- **Target Tracking**: Monitor current vs. target values
- **Deadline Management**: Set and track deadlines

### User Experience
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Modern UI**: Built with Tailwind CSS for a polished look
- **Authentication**: Secure login with token-based auth
- **Navigation**: Intuitive sidebar and top navigation
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Confirmation Dialogs**: Safe delete operations

## Project Structure

```
src/
├── api/              # API integration layer
│   ├── axiosConfig.js
│   ├── authApi.js
│   ├── taskApi.js
│   ├── monthlyGoalApi.js
│   ├── yearlyGoalApi.js
│   └── dashboardApi.js
├── components/       # Reusable React components
│   ├── Common.jsx    # Button, Card, Input, Badge, etc.
│   ├── Modal.jsx     # Modal and Confirmation dialogs
│   ├── Layout.jsx    # Navbar, Sidebar, MainLayout
│   ├── DataDisplay.jsx # Table, StatsCard, ProgressBar
│   ├── Form.jsx      # Form components and inputs
│   └── index.js      # Component exports
├── context/          # React Context
│   └── AuthContext.jsx
├── hooks/            # Custom React hooks
│   ├── useCustom.js  # useForm, useFetch, useAsync, etc.
│   └── index.js      # Hook exports
├── pages/            # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Tasks.jsx
│   ├── MonthlyGoals.jsx
│   └── YearlyGoals.jsx
├── routes/           # Route configuration
│   ├── AppRoutes.jsx
│   └── ProtectedRoutes.jsx
├── utils/            # Utility functions
│   └── helpers.js    # Date, string, validation utilities
├── App.jsx           # Main App component
├── main.jsx          # Entry point
└── index.css         # Global styles with Tailwind
```

## Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Icons**: Lucide React
- **State Management**: React Context + Hooks

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd task-monitor-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Update .env with your API endpoint**
```
VITE_API_URL=http://localhost:8080
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## API Endpoints Expected

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/start` - Start task
- `PUT /api/tasks/:id/complete` - Complete task
- `DELETE /api/tasks/:id` - Delete task

### Monthly Goals
- `GET /api/monthly-goals` - Get all monthly goals
- `GET /api/monthly-goals/:yearlyGoalId` - Get monthly goals for yearly goal
- `POST /api/monthly-goals` - Create monthly goal
- `PUT /api/monthly-goals/:id` - Update monthly goal
- `DELETE /api/monthly-goals/:id` - Delete monthly goal

### Yearly Goals
- `GET /api/yearly-goals` - Get all yearly goals
- `GET /api/yearly-goals/:id` - Get yearly goal by ID
- `POST /api/yearly-goals` - Create yearly goal
- `PUT /api/yearly-goals/:id` - Update yearly goal
- `DELETE /api/yearly-goals/:id` - Delete yearly goal

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/overview` - Get overview data
- `GET /api/dashboard/task-stats` - Get task statistics
- `GET /api/dashboard/goal-stats` - Get goal statistics

## Component Documentation

### Common Components

#### Button
```jsx
<Button variant="primary" size="md">Click me</Button>
```
Variants: `primary`, `secondary`, `danger`
Sizes: `sm`, `md`, `lg`

#### Card
```jsx
<Card>
  <p>Card content</p>
</Card>
```

#### Input
```jsx
<Input 
  label="Email"
  type="email"
  placeholder="your@email.com"
  error={errorMessage}
/>
```

#### Modal
```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  footerButtons={<Button>Save</Button>}
>
  Modal content
</Modal>
```

#### Table
```jsx
<Table
  data={items}
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', render: (value) => <Badge>{value}</Badge> }
  ]}
  actions={(row) => <button>Edit</button>}
/>
```

### Custom Hooks

#### useForm
```jsx
const form = useForm(initialValues, onSubmit);
// form.values, form.errors, form.handleChange, form.handleSubmit, form.reset
```

#### useFetch
```jsx
const { data, isLoading, error, refetch } = useFetch(fetchFunction, dependencies);
```

#### useAsync
```jsx
const { execute, status, response, error } = useAsync(asyncFunction, immediate);
```

#### useLocalStorage
```jsx
const [value, setValue] = useLocalStorage('key', initialValue);
```

## Authentication Flow

1. User enters credentials on Login page
2. API call to `/api/auth/login` endpoint
3. Token stored in localStorage
4. User redirected to Dashboard
5. Token automatically included in all subsequent requests via axios interceptor
6. If 401 response, user redirected to login and token cleared

## Styling

Global styles are defined in `src/index.css` using Tailwind CSS. The design system includes:

- **Colors**: Primary blue, secondary purple, with semantic reds/greens/yellows
- **Spacing**: Consistent 4px base unit
- **Typography**: Clear hierarchy with bold headers
- **Components**: Pre-styled with utility classes in CSS layers

### Custom Classes

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.card` - White card with shadow
- `.input` - Consistent input styling
- `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger`

## Performance Optimizations

- Lazy component loading via React.lazy
- Debounced form input validation
- Optimized re-renders with useCallback
- Efficient data fetching with caching
- CSS pruning via Tailwind's tree-shaking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with descriptive messages
4. Create a pull request

## License

MIT

## Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for productive teams**

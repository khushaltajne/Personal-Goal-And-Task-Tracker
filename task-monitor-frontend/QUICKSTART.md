# 🚀 Quick Start Guide

Get your Task Monitor frontend up and running in minutes!

## 1️⃣ Installation (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

This installs:
- React 19
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)
- React Router (routing)
- Lucide React (icons)

### Step 2: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update API URL
# VITE_API_URL=http://localhost:8080
```

### Step 3: Start Development Server
```bash
npm run dev
```

Your app is now running at `http://localhost:5173`

## 2️⃣ First Time Setup

### 📝 Demo Credentials
Use these for testing:
- Email: `demo@example.com`
- Password: `password123`

### 🗂️ Project Structure
- `/src` - Source code
- `/src/pages` - Main pages
- `/src/components` - Reusable components
- `/src/api` - API integration
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions

## 3️⃣ Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Login | `/` | Authentication |
| Dashboard | `/dashboard` | Overview & analytics |
| Tasks | `/tasks` | Task management |
| Monthly Goals | `/monthly-goals` | Monthly objectives |
| Yearly Goals | `/yearly-goals` | Annual goals |

## 4️⃣ Common Tasks

### Creating a Task
1. Navigate to **Tasks** page
2. Click **"New Task"** button
3. Fill in task details
4. Click **"Save Task"**

### Creating a Goal
1. Go to **Yearly Goals** or **Monthly Goals**
2. Click **"New Goal"** button
3. Enter goal details and target value
4. Click **"Save Goal"**

### Tracking Progress
1. View goals with progress bars
2. Progress bars auto-update based on current value
3. Color-coded status indicators

### Viewing Analytics
1. Go to **Dashboard**
2. See statistics cards
3. Monitor progress trends
4. View recent activities

## 5️⃣ Troubleshooting

### Issue: Can't login
**Solution**: Verify backend is running and API URL is correct in `.env`

### Issue: Tasks not loading
**Solution**: Check browser console for errors, verify API endpoint

### Issue: Styling looks broken
**Solution**: Run `npm install` again to ensure Tailwind is installed

### Issue: Port 5173 already in use
**Solution**: Vite will automatically use the next available port

## 6️⃣ Development Tips

### 🔥 Hot Module Replacement
Changes to files automatically reload - no manual refresh needed!

### 🐛 Debugging
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Use React DevTools extension for component inspection

### 📝 Adding a New Component
1. Create file in `/src/components/`
2. Export from `/src/components/index.js`
3. Import and use in pages

### 🔌 Adding a New API Endpoint
1. Create method in `/src/api/` file
2. Use in component with `useFetch` hook
3. Handle loading/error states

## 7️⃣ Building for Production

### Create Optimized Build
```bash
npm run build
```

This creates `/dist` folder with optimized production bundle.

### Preview Production Build
```bash
npm run preview
```

Test the production build locally before deploying.

### Deploy to Hosting
Options:
- **Vercel**: Connected to GitHub repo
- **Netlify**: Same as Vercel
- **AWS S3**: Upload dist folder
- **Docker**: Containerize for deployment

## 8️⃣ Backend Integration

### Expected Backend Response Format

**Login Response** (POST /api/auth/login)
```json
{
  "accessToken": "eyJhbGc...",
  "name": "User Name"
}
```

**Task Response** (GET /api/tasks)
```json
{
  "data": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "...",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-03-15"
    }
  ]
}
```

**Goal Response** (GET /api/yearly-goals)
```json
{
  "data": [
    {
      "id": 1,
      "title": "Goal Title",
      "description": "...",
      "targetValue": 100,
      "currentValue": 45,
      "deadline": "2026-12-31",
      "status": "active"
    }
  ]
}
```

## 9️⃣ Performance Tips

1. **Use devtools**: `npm run dev` includes Vite devtools
2. **Check bundle size**: `npm run build` shows size info
3. **Optimize images**: Use next-gen formats
4. **Lazy load routes**: Already implemented in Router
5. **Monitor API calls**: Check Network tab in DevTools

## 🔟 Learning Resources

### React
- [React Official Docs](https://react.dev)
- [React Hooks Guide](https://react.dev/reference/react)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind Components](https://tailwindcss.com/components)

### Vite
- [Vite Guide](https://vitejs.dev/guide/)

### Axios
- [Axios Documentation](https://axios-http.com/docs/intro)

## 📞 Support & Help

### Check Documentation
- [README.md](./README.md) - Main docs
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Detailed component docs
- [FEATURES.md](./FEATURES.md) - Feature list

### Debug Issues
1. Check browser console
2. Look at Network tab for API errors
3. Review source code
4. Check component documentation

### Report Issues
Create an issue in the repository with:
- Description of problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/error messages

---

**Happy Coding! 🎉**

# Portfolio Admin Panel

A React-based admin panel for managing your portfolio website's content.

## Features

### ✅ Phase 1 (Complete)
- **Authentication System**
  - Password-based login with environment variable configuration
  - Protected routes with automatic redirect to login
  - Persistent authentication using localStorage
  - Smooth Framer Motion animations
  - Beautiful gradient UI matching portfolio aesthetic

- **Admin Layout**
  - Responsive sidebar navigation
  - Dashboard with stats overview
  - Clean, modern design with Inter font
  - Dark sidebar with gradient accents

- **Pages Structure**
  - Dashboard - Overview of portfolio metrics
  - Case Studies - Manage case study content (coming soon)
  - Posts - Manage blog posts (coming soon)
  - Page Content - Edit main portfolio pages (coming soon)
  - Availability - Update availability status (coming soon)
  - Settings - Admin panel configuration (coming soon)

### 🚧 Phase 2 (Upcoming)
- Supabase database integration
- CRUD operations for case studies
- Blog post management with rich text editor
- Page content editing
- Image upload functionality
- Availability status toggle

## Getting Started

### Prerequisites
- Node.js 14+ and npm

### Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and set your admin password:
```
REACT_APP_ADMIN_PASSWORD=your_secure_password_here
```

### Development

Start the development server:
```bash
npm start
```

The admin panel will open at `http://localhost:3000/admin`

### Default Credentials

For local development, the default password is set in your `.env` file:
- Password: `admin123` (change this in .env)

## Project Structure

```
admin/
├── public/
│   └── index.html
├── src/
│   ├── admin/
│   │   ├── auth/
│   │   │   ├── AuthContext.jsx    # Authentication context provider
│   │   │   ├── Login.jsx          # Login page with Framer Motion
│   │   │   └── Login.css          # Login page styles
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx    # Main layout with sidebar
│   │   │   ├── AdminNav.jsx       # Sidebar navigation
│   │   │   ├── ProtectedRoute.jsx # Route protection wrapper
│   │   │   ├── AdminLayout.css
│   │   │   └── AdminNav.css
│   │   └── pages/
│   │       ├── Dashboard.jsx      # Dashboard page
│   │       ├── CaseStudies.jsx    # Case studies management
│   │       ├── Posts.jsx          # Blog posts management
│   │       ├── PageContent.jsx    # Page content editor
│   │       ├── Availability.jsx   # Availability status
│   │       ├── Settings.jsx       # Admin settings
│   │       └── Dashboard.css
│   ├── services/
│   │   ├── api.js                 # Axios instance
│   │   └── auth.js                # Auth service functions
│   ├── utils/
│   │   └── constants.js           # Routes and API endpoints
│   ├── App.js                     # Main app with routing
│   ├── App.css                    # Global styles
│   └── index.js                   # React entry point
├── .env.example                   # Environment variables template
├── .env                          # Your environment variables (git-ignored)
├── .gitignore
├── package.json
└── README.md
```

## Technology Stack

- **React 18.2.0** - UI framework
- **React Router DOM 6.21.0** - Client-side routing
- **Framer Motion 10.18.0** - Smooth animations
- **Axios 1.6.5** - HTTP client
- **React Hook Form 7.49.3** - Form management
- **React Quill 2.0.0** - Rich text editor
- **Lucide React 0.307.0** - Icon library
- **React Hot Toast 2.4.1** - Toast notifications
- **Supabase 2.39.3** - Backend as a service (upcoming)
- **date-fns 3.0.6** - Date utilities

## Authentication Flow

1. User visits `/admin/*` route
2. `ProtectedRoute` checks `isAuthenticated` from `AuthContext`
3. If not authenticated, redirect to `/admin/login`
4. User enters password
5. `AuthContext.login()` validates against `REACT_APP_ADMIN_PASSWORD`
6. On success, sets `localStorage` and navigates to dashboard
7. On subsequent visits, auth persists via localStorage

## Styling

- **Font**: Inter (Google Fonts)
- **Color Scheme**: Gradient theme (#667eea → #764ba2)
- **Layout**: Sidebar navigation with content area
- **Responsive**: Mobile-friendly design
- **Animations**: Framer Motion for smooth transitions

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_ADMIN_PASSWORD` | Admin login password | ✅ Yes |
| `REACT_APP_GLOBAL_CASE_STUDY_PASSWORD` | Password for case study access | Optional |
| `REACT_APP_SUPABASE_URL` | Supabase project URL | Phase 2 |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anonymous key | Phase 2 |
| `REACT_APP_API_BASE_URL` | Production API base URL | Optional |

## Build for Production

Build the app:
```bash
npm run build
```

The optimized production build will be in the `build/` folder.

## Deployment

### Option 1: Netlify Subdomain
- Deploy to `admin.your-domain.com`
- Set environment variables in Netlify dashboard
- Build command: `cd admin && npm run build`
- Publish directory: `admin/build`

### Option 2: Vercel
- Import the `/admin` folder as a separate project
- Add environment variables in Vercel dashboard
- Framework preset: Create React App

## Security Notes

- **Environment Variables**: Never commit `.env` to git
- **Password Storage**: Use a strong password in production
- **HTTPS**: Always use HTTPS in production for secure password transmission
- **Authentication**: Phase 1 uses client-side password validation (suitable for single admin)
- **Phase 2**: Will implement server-side authentication with Supabase

## Troubleshooting

### npm install fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Change port
PORT=3001 npm start
```

### Build errors
```bash
# Clear cache
rm -rf node_modules/.cache
npm start
```

## Next Steps

1. **Connect Supabase**
   - Create Supabase project
   - Set up database schema
   - Add environment variables

2. **Implement CRUD Operations**
   - Case studies: Create, edit, delete
   - Blog posts: Full management
   - Page content: Live editing

3. **Add Features**
   - Image uploads to Supabase Storage
   - Draft/publish workflow
   - Content preview
   - Analytics integration

## Support

For issues or questions, refer to the main portfolio repository or contact the developer.

## License

This admin panel is part of your portfolio project.

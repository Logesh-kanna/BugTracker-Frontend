# BugTracker Frontend

Angular 15 single-page application providing the UI for both the Admin panel and the Bug Tracker product. Communicates with the Admin Service (port 8081) and Product Service (port 8082) via REST APIs.

## Features

**Admin Panel**
- Admin authentication (sign in)
- Dashboard with overview metrics
- Client company management (onboarding requests, approve/disable)
- User and admin management (list, enable/disable accounts)
- Profile management

**Bug Tracker (Product)**
- User registration and authentication
- Project management (create, list, delete)
- Bug lifecycle management (create, assign, update status)
- Bug detail view with image attachments
- Team member management
- User profile

## Tech Stack

- Angular 15.2.0
- TypeScript 4.9.4
- Angular Material 14 (UI components)
- Chart.js (dashboard charts)
- SweetAlert2 (notifications and confirmations)
- RxJS (reactive data streams)
- Angular CLI 15.2.11

## Project Structure

```
src/app/
├── admin/
│   ├── auth/               # Admin sign-in
│   ├── dashboard/          # Admin overview (ManagerComponent)
│   ├── user-management/    # Admin/user list and status controls
│   ├── client-management/  # Client company management
│   ├── profile/            # Admin profile
│   └── sidenav/, navbar/   # Admin layout components
├── product/
│   ├── auth/               # User sign-up and sign-in
│   ├── dashboard/          # Bug tracker overview
│   ├── project-management/ # Project list and creation
│   ├── bug-management/     # Bug list, detail, creation
│   ├── user-management/    # Team member management
│   ├── profile/            # User profile
│   └── sidenav/, navbar/   # Product layout components
├── home/                   # Landing page
├── not-supported/          # Mobile device warning
└── shared/
    ├── cloudinary/         # Image upload service
    ├── local-storage/      # Auth token management
    └── sweet-alert/        # SweetAlert2 wrapper
```

## Routes

| Path | Component | Guard |
|------|-----------|-------|
| `/home` | HomeComponent | — |
| `/admin/signin` | Admin SigninComponent | — |
| `/admin/dashboard` | ManagerComponent | AdminAuthGuard |
| `/admin/user-management` | UserManagementComponent | AdminAuthGuard |
| `/admin/client-management` | ClientManagementComponent | AdminAuthGuard |
| `/admin/profile` | Admin ProfileComponent | AdminAuthGuard |
| `/bugtracker/signup` | Product SignupComponent | — |
| `/bugtracker/signin` | Product SigninComponent | — |
| `/bugtracker/dashboard` | DashboardComponent | ProductAuthGuard |
| `/bugtracker/project` | ProjectComponent | ProductAuthGuard |
| `/bugtracker/project/bugs` | ProjectBugsComponent | ProductAuthGuard |
| `/bugtracker/bugs` | BugsComponent | ProductAuthGuard |
| `/bugtracker/bug/info` | BugInfoComponent | ProductAuthGuard |
| `/bugtracker/user-management` | UserManagementComponent | ProductAdminGuard |
| `/bugtracker/profile` | Product ProfileComponent | ProductAuthGuard |

## Getting Started

### Prerequisites

- Node.js 16+
- Angular CLI 15: `npm install -g @angular/cli@15`

### Install dependencies

```bash
npm install
```

### Development server

```bash
ng serve
```

Runs on `http://localhost:4200`. API calls are proxied via `proxy.conf.json`:

| Prefix | Target |
|--------|--------|
| `/api1` | `http://localhost:8081` (Admin Service) |
| `/api2` | `http://localhost:8082` (Product Service) |

### Production build

```bash
ng build
```

Output is in the `dist/` directory.

## Environment Configuration

`src/environments/environment.ts` — development:

```typescript
export const environment = {
  production: false,
  adminApiUrl: 'http://localhost:4200/api1/api/',
  productApiUrl: 'http://localhost:4200/api2/api/'
};
```

`src/environments/environment.prod.ts` — production:

```typescript
export const environment = {
  production: true,
  adminApiUrl: 'https://bugtracker-admin.onrender.com/api/',
  productApiUrl: 'https://bugtracker-9i69.onrender.com/api'
};
```

## Docker

The Dockerfile uses a multi-stage build — Angular build + Nginx serve:

```bash
# Build image
docker build -t bugtracker-frontend .

# Run container
docker run -p 80:80 bugtracker-frontend
```

The app is served on port 80 in the container.

## Auth Guards

| Guard | Description |
|-------|-------------|
| `AdminAuthGuard` | Protects admin panel routes; redirects to `/admin/signin` |
| `ProductAuthGuard` | Protects product routes; redirects to `/bugtracker/signin` |
| `ProductAdminGuard` | Restricts manager-only features within the product |
| `ScreensizeGuard` | Redirects to `/not-supported` on mobile screen sizes |

## Image Uploads

Bug attachments are uploaded directly to Cloudinary from the browser using a configured cloud name and unsigned upload preset. No server-side upload handling is needed.

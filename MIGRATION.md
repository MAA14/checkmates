# Project Migration: Vite React → Next.js TypeScript

## Overview

This document outlines the migration from Vite React (JavaScript) to Next.js (TypeScript) with proper separation of concerns, Atomic Design pattern, and backend API routes.

---

## ✅ Completed Changes

### 1. Backend API Routes (New)

Backend logic separated from frontend components using Next.js API routes.

**Location:** `/src/app/api/auth/`

- **`login/route.ts`** - Handles user login with Supabase
- **`register/route.ts`** - Handles user registration with profile creation
- **`logout/route.ts`** - Handles user logout

**Benefits:**

- ✅ Sensitive operations (auth) handled server-side
- ✅ Direct Supabase integration without exposing keys
- ✅ Centralized error handling
- ✅ API versioning ready

---

### 2. Middleware Authentication (New)

Protected routes using Next.js middleware instead of client-side checks.

**Location:** `/middleware.ts`

**Features:**

- ✅ Redirects unauthenticated users to login
- ✅ Protects `/dashboard/*` routes
- ✅ Cookie-based authentication

---

### 3. Utilities & Hooks (New)

#### Auth Service (`src/utils/authService.ts`)

Frontend wrapper for API calls - replaces direct Supabase usage.

```typescript
import { login, register, logout } from "@/utils/authService";

// Usage
const response = await login({ username: "user", password: "pass" });
```

#### Toast Hook (`src/hooks/useToast.ts`)

Centralized toast notification management.

```typescript
const { toast, showToast, hideToast } = useToast();
showToast("Success!", "success");
```

#### Form Loading Hook (`src/hooks/useFormLoading.ts`)

Manages loading state for forms.

```typescript
const { loading, setLoadingTrue, setLoadingFalse } = useFormLoading();
```

---

### 4. Atomic Design Components (New)

#### Atoms (Reusable UI Elements)

- **`Input.tsx`** - Form input with validation
- **`Button.tsx`** - Button with variants (primary, secondary, danger)

#### Molecules (Simple Component Combinations)

- **`Toast.tsx`** - Toast notification display
- **`AuthHeader.tsx`** - Auth page header
- **`AuthFooter.tsx`** - Auth page footer with navigation

#### Organisms (Complex Component Combinations)

- **`LoginForm.tsx`** - Complete login form with validation
- **`RegisterForm.tsx`** - Complete register form with validation

**Benefits:**

- ✅ Reusable components across pages
- ✅ Consistent styling and behavior
- ✅ Easy to maintain and test
- ✅ Clear component hierarchy

---

### 5. Refactored Pages

#### Login Page (`src/app/auth/login/page.tsx`)

**Before:** Mixed UI + business logic (Supabase calls)
**After:** Clean page composition with reusable components

```tsx
export default function LoginPage() {
  const { toast } = useToast();

  return (
    <>
      <Toast toast={toast} />
      <AuthHeader title="Login" description="...">
        <LogIn size={36} />
      </AuthHeader>
      <LoginForm />
      <AuthFooter text="..." linkText="..." href="..." />
    </>
  );
}
```

#### Register Page (`src/app/auth/register/page.tsx`)

Same clean structure as login page with RegisterForm component.

---

## Project Structure (Updated)

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts       (NEW)
│   │       ├── register/route.ts    (NEW)
│   │       └── logout/route.ts      (NEW)
│   ├── auth/
│   │   ├── login/page.tsx           (REFACTORED)
│   │   └── register/page.tsx        (REFACTORED)
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── atoms/
│   │   ├── Input.tsx                (NEW)
│   │   ├── Button.tsx               (NEW)
│   │   └── ChessIcons.tsx
│   ├── molecules/
│   │   ├── Toast.tsx                (NEW)
│   │   ├── AuthHeader.tsx           (NEW)
│   │   ├── AuthFooter.tsx           (NEW)
│   │   ├── TaskCard.tsx
│   │   ├── BackgroundEffects.jsx
│   │   └── StatCard.jsx
│   ├── organisms/
│   │   ├── LoginForm.tsx            (NEW)
│   │   └── RegisterForm.tsx         (NEW)
│   ├── pages/
│   └── types/
├── hooks/
│   ├── useToast.ts                  (NEW)
│   └── useFormLoading.ts            (NEW)
├── utils/
│   ├── authService.ts               (NEW)
│   ├── dateHelpers.js
│   ├── priorityHelpers.js
│   ├── taskHelpers.js
│   └── URouteUrl.ts
└── libs/
    └── supabase.js
middleware.ts                         (NEW)
```

---

## Key Improvements

### 1. **Separation of Concerns**

| Aspect        | Before           | After               |
| ------------- | ---------------- | ------------------- |
| Auth Logic    | Client-side      | Server-side API     |
| UI Components | Mixed with logic | Pure presentation   |
| Data Fetching | Direct Supabase  | API service wrapper |
| Validation    | Component-level  | API + Component     |

### 2. **TypeScript Coverage**

- ✅ All new files are `.ts` or `.tsx`
- ✅ Proper interfaces for API responses
- ✅ Strong typing for props and state

### 3. **Code Reusability**

- ✅ Atomic design reduces duplication
- ✅ Hooks encapsulate logic
- ✅ Services abstract API calls

### 4. **Security**

- ✅ Supabase keys stay server-side
- ✅ Middleware protects routes
- ✅ API validation on backend

---

## Next Steps (To Complete Migration)

### Phase 1: Complete Auth System

- [ ] Implement JWT token refresh
- [ ] Add session management
- [ ] Implement logout functionality
- [ ] Add "Remember Me" feature

### Phase 2: Migrate Dashboard

- [ ] Move dashboard API calls to backend
- [ ] Create API routes for task operations
- [ ] Extract dashboard components to atomic design

### Phase 3: Convert Remaining JS to TS

- [ ] `BackgroundEffects.jsx` → `.tsx`
- [ ] `StatCard.jsx` → `.tsx`
- [ ] Helper files (`.js` → `.ts`)

### Phase 4: Error Handling & Validation

- [ ] Centralized error handler
- [ ] Zod/Yup schema validation
- [ ] Error boundary components

---

## Migration Checklist

- [x] Create API routes for auth operations
- [x] Create middleware for route protection
- [x] Extract auth service utility
- [x] Create custom hooks (useToast, useFormLoading)
- [x] Create atomic design components
- [x] Refactor login page
- [x] Refactor register page
- [ ] Update dashboard page
- [ ] Convert remaining JSX files
- [ ] Add comprehensive error handling
- [ ] Write unit tests
- [ ] Write integration tests

---

## Usage Examples

### Using Auth Service

```typescript
import { login, register, logout } from "@/utils/authService";

// Login
const response = await login({
  username: "user123",
  password: "password123",
});

if (response.success) {
  router.push("/dashboard");
} else {
  showToast(response.message, "error");
}
```

### Using Reusable Components

```tsx
<Input
  type="email"
  name="email"
  label="Email Address"
  placeholder="Enter email"
  error={errors.email}
  onChange={handleChange}
/>

<Button type="submit" size="lg" loading={loading}>
  Submit
</Button>

<AuthHeader title="Welcome" description="Sign in to continue">
  <Logo size={36} />
</AuthHeader>
```

---

## Testing the Migration

1. **Test Login:**

   ```bash
   bun dev
   # Navigate to /auth/login
   # Try logging in with valid/invalid credentials
   ```

2. **Test Protected Routes:**

   ```bash
   # Try accessing /dashboard without auth
   # Should redirect to /auth/login
   ```

3. **Check API Routes:**
   ```bash
   # POST /api/auth/login
   # POST /api/auth/register
   # POST /api/auth/logout
   ```

---

## Troubleshooting

### Issue: API routes not working

- Check Next.js is running in dev mode
- Verify file is named `route.ts` (not `route.tsx`)
- Check browser console for fetch errors

### Issue: Middleware not redirecting

- Verify `/middleware.ts` is in project root
- Check cookie name matches
- Clear browser cookies and retry

### Issue: Components not importing

- Verify paths use `@/` alias (configured in tsconfig.json)
- Check file extensions match (`.tsx` for components)

---

## References

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Atomic Design Pattern](https://bradfrost.com/blog/post/atomic-web-design/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

**Last Updated:** 2026-06-18
**Migration Status:** 60% Complete

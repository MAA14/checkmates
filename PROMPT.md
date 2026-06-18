analyze my project this project is based on Vite React Javascript and I already migrate some of the project into NextJs Typescript

Continue the migration or convertion from jsx to tsx and following my structure folders create clean code for Atomic Design React and separate the Front-End logic and Back-End logic using NextJs Back-End and Middleware since this project from Vite that only use for Front-End so the Back-End logic still in Front-End I want it separated now

Rules :

1. For code that has the same function must be generate as utils
2. For React Component must be following atomic design structure and everything must be unite in /pages folder for every pages view
3. Break down each component in pages.tsx into reusable components that can be used between pages
4. From supabase logic like handleLogin, handleLogout, userAuth by supabase must be handled via Back-End not Front End so break down the logic for supabase and create Back-End path for them
5. Use Middleware for authenticated user to access /dashboard/\*

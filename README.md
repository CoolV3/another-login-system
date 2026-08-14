# Another Login System

## What is it?
This is a template for a simple login and sign up system. And please just use it for small projects because its not production ready.



## Features
This project contains a login and sign up system and an account settings page. 
Its located under `/dashboard/settings`. There you can change your email and name, view all your active sessions, and change your password.



## How to integrate with your own application
First clone the repository with 
```bash
git clone https://github.com/CoolV3/another-login-system
cd another-login-system
```
Install all dependencies with
```bash
pnpm install
```
After that edit the file `env.example`. Fill in there your postgresql database connection. Then rename the file to `.env`.
Then run the following commands to sync your database with prisma.
```bash
pnpm dlx prisma migrate deploy
pnpm dlx prisma generate
```

Then you can build your application on top. You can get information about the user with the function `getCurrentUser()`.
This function returns the userId, Email, and Name from the current User.
One session is active for 7 days by default. You can customize the time in the file `/app/actions/auth.ts` under the variable `sessionDuration`.
The Route `/dashboard` and all subroutes are only accessible when the user is logged in. In `/dashboard` you can build your custom application that needs auth.

Then run the development server with:

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the application.



## Tech Stack
- Next.js Framework
- Database: Prisma v7 with Postgresql
- Argon2ID for password hashing
- TailwindCSS for styling

## Why I built it?
Because I wanted to learn more about Databases with next.js and how prisma works.
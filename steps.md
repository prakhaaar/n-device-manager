#created a next js 15 version
#installed shadcn framer motion react lucide
#installed auth0 faced problems with setting up the routes use
===>Verified package was installed (npm ls)
===>Checked package.json exports to find correct import paths
===>Examined TypeScript definitions (client.d.ts) to discover available methods
===>Found middleware() method which handles all auth routes automatically,the middleware() method automatically handles all OAuth routes (login, logout, callback, me) in the catch-all [...auth0] route

#designing the private page
#created dashboard/page.tsx
#protected route to access after login
now well do database and api creation work
#4 — Collecting User Metadata (Full Name + Phone Number)

#collecting phone numbers and users metadata
created a route ==>
completeprofile inside the app
collect the user namme and phone number.
API Route
app/api/profile/complete/route.ts
Fix applied:
Switched to:
const session = await auth0.getSession();
Removed Edge runtime issues
Session validation works fine now
Result==>User profile data is stored in Redis successfully.

#5 — Designing the Private Page

           Created:dashboard/page.tsx
           This is the protected private page only accessible after login.
           It checks user session using:
           const session = await auth0.getSession();
           Loads Redis profile data for that user.
           If profile is incomplete → redirects to /completeprofile
           Result===>Private page structure ready , Auth guard implemented

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/products(.*)',
    '/blog(.*)',
    '/search(.*)',
    '/about',
    '/careers',
    '/contact',
    '/privacy',
    '/terms',
    '/license',
    '/author(.*)',
    '/glossary(.*)',
    '/uploads(.*)',
    '/offers(.*)',
    '/articles(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
    console.log('Proxy check:', request.nextUrl.pathname);
    if (!isPublicRoute(request)) {
        console.log('Protecting route:', request.nextUrl.pathname);
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals, static files, and the warehouse upload route
        '/((?!_next|api/warehouse/upload|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes except warehouse upload
        '/(api(?!/warehouse/upload)|trpc)(.*)',
    ],
};

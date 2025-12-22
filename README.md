# Warlock Publishing

A digital product marketplace built with Next.js, Shadcn UI, Clerk, and MongoDB.

## Features

- **Product Management**: Add and manage digital products.
- **GrooveSell Integration**: Automatic tracking pixel injection and embed code support.
- **Amazon Affiliate Support**: Link products to Amazon.
- **Custom Sales Pages**: Use custom HTML for product pages.
- **Authentication**: Secure user authentication with Clerk.
- **Search**: Find products by title, description, or category.

## Setup

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env.local` file in the root directory with the following variables:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    MONGODB_URI=mongodb://localhost:27017/warlock_publishing
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Admin Access

Navigate to `/admin` to manage products. You must be signed in.

## GrooveSell Integration

When adding a product, you can provide:
- **GrooveSell Tracking ID**: The ID from the tracking pixel URL (e.g., `85437`).
- **GrooveSell Embed Code**: The full embed code for the checkout button/form.

## Custom HTML

You can provide custom HTML content for a product page. This will override the standard layout, allowing you to build custom sales pages, upsell pages, or thank you pages.

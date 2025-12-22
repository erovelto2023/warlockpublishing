import { currentUser } from "@clerk/nextjs/server";

export async function isAdmin() {
    const user = await currentUser();
    if (!user) return false;

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return false;

    return user.emailAddresses.some(email => email.emailAddress === adminEmail);
}

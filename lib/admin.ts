import { currentUser } from "@clerk/nextjs/server";

export async function isAdmin() {
    let user = null;
    try {
        user = await currentUser();
    } catch (e) {
        return false;
    }
    
    if (!user) return false;

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return false;

    return user.emailAddresses.some(email => email.emailAddress === adminEmail);
}

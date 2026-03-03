import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./lib/db"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Authorize called with username: ", credentials?.username);
                if (!credentials?.username || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                const user = await db.user.findUnique({
                    where: { username: credentials.username as string }
                })

                if (!user) {
                    console.log("User not found in database for username: ", credentials.username);
                    return null;
                }

                console.log("User found. ID:", user.id, "Hash:", user.password_hash.substring(0, 10) + "...");

                const isValid = await bcrypt.compare(credentials.password as string, user.password_hash)
                if (!isValid) {
                    console.log("Password compare failed.");
                    return null;
                }

                console.log("Authorize successful!");
                return { id: user.id.toString(), name: user.username }
            }
        })
    ]
})

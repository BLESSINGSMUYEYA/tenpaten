import { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            role: Role
            managedUniversityId?: string | null
            id: string
            affiliateApproved?: boolean
            emailVerified?: Date | null
        } & DefaultSession["user"]
    }

    interface User {
        role: Role
        managedUniversityId?: string | null
        emailVerified?: Date | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: Role
        managedUniversityId?: string | null
        affiliateApproved?: boolean
        emailVerified?: Date | null
    }
}

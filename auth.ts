import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/app/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" }, // Use JWT for session to avoid database lookup on every request if preferred, or "database" for strict server-side
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    // In a real app, you would query the database here:
                    // const user = await prisma.user.findUnique({ where: { email } });
                    // if (!user) return null;
                    // const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
                    // if (passwordsMatch) return user;

                    // MOCK RETURN for development until DB is connected
                    if (email === 'sensei@karate-iks.com') {
                        return { id: '1', name: 'Sensei Miyagi', email: email, role: 'SENSEI' };
                    }
                    return { id: '2', name: 'Daniel San', email: email, role: 'STUDENT' };
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        }
    }
});

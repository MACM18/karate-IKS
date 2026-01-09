import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const role = (auth?.user as any)?.role;
            const isOnDashboard = nextUrl.pathname.startsWith('/student');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnLogin = nextUrl.pathname === '/login';

            // If on login page and already logged in, redirect to appropriate dashboard
            if (isOnLogin && isLoggedIn) {
                if (role === 'ADMIN' || role === 'SENSEI') {
                    return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
                }
                return NextResponse.redirect(new URL('/student/dashboard', nextUrl));
            }

            if (isOnAdmin) {
                if (isLoggedIn) {
                    return role === 'SENSEI' || role === 'ADMIN';
                }
                return false; // Redirect to login
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            return true;
        },
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
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

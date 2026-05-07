import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!

    authenticatedUser?: {
      userId: string;
      email: string;
      displayName: string;
    };
    isLoggedIn?: boolean;
    logInAttempts?: number;

    authenticatedAdmin?: {
      adminId: string;
      email: string;
      fullName: string;
    };
    isAdminLoggedIn?: boolean;

    currentUserId?: string;
  }
}

export {};

type UserAccountStatus = 'active' | 'suspended' | 'deactivated';
type UserRole = 'admin' | 'user';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      status: UserAccountStatus;
    }

    interface Request {
      user?: UserPayload;
      auth?: {
        token: string;
        exp?: number;
      };
    }
  }
}

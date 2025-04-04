import { User, Session } from 'next-auth'

export interface SessionInterface extends Session {
    user: User & {
      id: string;
      name: string;
      email: string;
      avatarUrl: string;
      image?: string
    };
  }
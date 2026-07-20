enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
  bio: string;
  avatar: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type AuthState = {
  accessToken: string | null;
  user: User | null;

  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

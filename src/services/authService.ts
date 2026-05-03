import { createId, readJson, removeStorage, writeJson } from "@/lib/storage";
import type { UserRecord } from "@/types/saas";

const USERS_KEY = "contentking.users";
const SESSION_KEY = "contentking.session";
const PENDING_SIGNUP_KEY = "contentking.pendingSignup";

interface StoredUser extends UserRecord {
  passwordToken: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupInput extends AuthCredentials {
  name: string;
}

export interface AuthSession {
  user: UserRecord;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function tokenFor(password: string) {
  if (typeof btoa === "function") {
    return btoa(password);
  }

  return password;
}

function publicUser(user: StoredUser): UserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt
  };
}

function readUsers() {
  return readJson<StoredUser[]>(USERS_KEY, []);
}

function writeUsers(users: StoredUser[]) {
  writeJson(USERS_KEY, users);
}

function writeSession(userId: string) {
  writeJson(SESSION_KEY, { userId });
}

export const authService = {
  async getSession(): Promise<AuthSession | null> {
    const session = readJson<{ userId: string } | null>(SESSION_KEY, null);
    if (!session) {
      return null;
    }

    const user = readUsers().find((item) => item.id === session.userId);
    return user ? { user: publicUser(user) } : null;
  },

  async signUp(input: SignupInput): Promise<AuthSession> {
    const email = normalizeEmail(input.email);
    const password = input.password.trim();
    const name = input.name.trim() || "ContentKing Creator";

    if (!email || !password) {
      throw new Error("Enter an email and password to create your account.");
    }

    const users = readUsers();
    const existing = users.find((item) => item.email === email);

    if (existing) {
      writeSession(existing.id);
      return { user: publicUser(existing) };
    }

    const now = new Date().toISOString();
    const user: StoredUser = {
      id: createId("usr"),
      name,
      email,
      role: users.length === 0 ? "admin" : "user",
      createdAt: now,
      lastLoginAt: now,
      passwordToken: tokenFor(password)
    };

    writeUsers([user, ...users]);
    writeSession(user.id);
    return { user: publicUser(user) };
  },

  async prepareSignUp(input: SignupInput) {
    const email = normalizeEmail(input.email);
    const password = input.password.trim();
    const name = input.name.trim() || "ContentKing Creator";

    if (!email || !password) {
      throw new Error("Enter an email and password to create your account.");
    }

    writeJson(PENDING_SIGNUP_KEY, { name, email, password });
  },

  async completePendingSignUp(): Promise<AuthSession | null> {
    const pendingSignup = readJson<SignupInput | null>(PENDING_SIGNUP_KEY, null);

    if (!pendingSignup) {
      return null;
    }

    const session = await this.signUp(pendingSignup);
    removeStorage(PENDING_SIGNUP_KEY);
    return session;
  },

  clearPendingSignUp() {
    removeStorage(PENDING_SIGNUP_KEY);
  },

  async signIn(input: AuthCredentials): Promise<AuthSession> {
    const email = normalizeEmail(input.email);
    const passwordToken = tokenFor(input.password.trim());
    const users = readUsers();
    const index = users.findIndex((item) => item.email === email);

    if (index < 0 || users[index].passwordToken !== passwordToken) {
      throw new Error("No matching account was found.");
    }

    const updatedUser = {
      ...users[index],
      lastLoginAt: new Date().toISOString()
    };
    const nextUsers = [...users];
    nextUsers[index] = updatedUser;
    writeUsers(nextUsers);
    writeSession(updatedUser.id);

    return { user: publicUser(updatedUser) };
  },

  async signOut() {
    removeStorage(SESSION_KEY);
  },

  async listUsers(): Promise<UserRecord[]> {
    return readUsers().map(publicUser);
  }
};

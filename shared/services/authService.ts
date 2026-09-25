import type { UserProfile, UserRole, RegisterPayload, LoginPayload, AuthResult } from '../types/auth';
import { env } from '../config/env';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

// Development mock account store for offline local testing
// Development mock account store for offline local testing
const DEV_MOCK_ACCOUNTS: Record<string, UserProfile & { password: string }> = {
  'customer@tronx.com': {
    id: 'mock-cust-01',
    email: 'customer@tronx.com',
    fullName: 'Lady Genevieve Sterling',
    phone: '+1 555-234-5678',
    role: 'CUSTOMER',
    createdAt: new Date().toISOString(),
    password: 'password123',
  },
  'admin@tronx.com': {
    id: 'mock-admin-01',
    email: 'admin@tronx.com',
    fullName: 'Director Julian Vance',
    phone: '+1 555-876-5432',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    password: 'password123',
  },
  'kitchen@tronx.com': {
    id: 'mock-kitch-01',
    email: 'kitchen@tronx.com',
    fullName: 'Chef de Cuisine Marcus Reid',
    phone: '+1 555-345-6789',
    role: 'KITCHEN',
    createdAt: new Date().toISOString(),
    password: 'password123',
  },
  'superadmin@tronx.com': {
    id: 'mock-super-01',
    email: 'superadmin@tronx.com',
    fullName: 'Grand Maitre Dominique',
    phone: '+1 555-999-8888',
    role: 'SUPER_ADMIN',
    createdAt: new Date().toISOString(),
    password: 'password123',
  },
  // Backward compatibility aliases
  'customer@craftsland.com': {
    id: 'mock-cust-01',
    email: 'customer@tronx.com',
    fullName: 'Lady Genevieve Sterling',
    phone: '+1 555-234-5678',
    role: 'CUSTOMER',
    createdAt: new Date().toISOString(),
    password: 'password123',
  },
  'admin@craftsland.com': {
    id: 'mock-admin-01',
    email: 'admin@tronx.com',
    fullName: 'Director Julian Vance',
    phone: '+1 555-876-5432',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    password: 'password123',
  },
  'kitchen@craftsland.com': {
    id: 'mock-kitch-01',
    email: 'kitchen@tronx.com',
    fullName: 'Chef de Cuisine Marcus Reid',
    phone: '+1 555-345-6789',
    role: 'KITCHEN',
    createdAt: new Date().toISOString(),
    password: 'password123',
  },
  'superadmin@craftsland.com': {
    id: 'mock-super-01',
    email: 'superadmin@tronx.com',
    fullName: 'Grand Maitre Dominique',
    phone: '+1 555-999-8888',
    role: 'SUPER_ADMIN',
    createdAt: new Date().toISOString(),
    password: 'password123',
  },
};

let devActiveUser: UserProfile | null = null;

export class AuthService {
  /**
   * Retrieve the current session from Supabase Auth.
   */
  static async getSession(): Promise<Session | null> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      return null;
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Failed to get Supabase session:', error.message);
      return null;
    }
    return data.session;
  }

  /**
   * Subscribe to Supabase Auth state changes.
   */
  static onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ): { unsubscribe: () => void } {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      return { unsubscribe: () => {} };
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  }

  /**
   * Authenticate user with verified Supabase credentials.
   */
  static async signIn(payload: LoginPayload): Promise<AuthResult> {
    const trimmedEmail = payload.email.trim().toLowerCase();

    // Development offline fallback
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const mockAcc = DEV_MOCK_ACCOUNTS[trimmedEmail];
      if (mockAcc && mockAcc.password === payload.password) {
        devActiveUser = {
          id: mockAcc.id,
          email: mockAcc.email,
          fullName: mockAcc.fullName,
          phone: mockAcc.phone,
          role: mockAcc.role,
          createdAt: mockAcc.createdAt,
        };
        return { user: devActiveUser };
      }
      return { user: null, error: 'Invalid email or password credentials.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: payload.password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'User record could not be retrieved.' };
    }

    const profile = await this.getProfileByUserId(data.user.id);
    return { user: profile };
  }

  /**
   * Register a new customer user. Roles are NEVER accepted from client.
   */
  static async signUp(payload: RegisterPayload): Promise<AuthResult> {
    const trimmedEmail = payload.email.trim().toLowerCase();

    // Development offline fallback
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      if (DEV_MOCK_ACCOUNTS[trimmedEmail]) {
        return { user: null, error: 'An account with this email address already exists.' };
      }
      const newMockUser: UserProfile = {
        id: `mock-cust-${Date.now()}`,
        email: trimmedEmail,
        fullName: payload.fullName.trim(),
        phone: payload.phone?.trim(),
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
      };
      DEV_MOCK_ACCOUNTS[trimmedEmail] = { ...newMockUser, password: payload.password };
      devActiveUser = newMockUser;
      return { user: newMockUser };
    }

    // Production Supabase Auth Sign Up
    // Notice: role is NOT passed in raw_user_meta_data. The database trigger forces CUSTOMER.
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName.trim(),
          phone: payload.phone?.trim() || null,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Registration failed. Please try again.' };
    }

    // Check if email confirmation is required by Supabase project
    if (data.user && !data.session) {
      return {
        user: null,
        requiresEmailVerification: true,
      };
    }

    // Profile is automatically created by the on_auth_user_created PostgreSQL trigger
    let profile = await this.getProfileByUserId(data.user.id);

    // Minor grace retry if trigger executes asynchronously
    if (!profile) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      profile = await this.getProfileByUserId(data.user.id);
    }

    return { user: profile };
  }

  /**
   * Terminate active Supabase session.
   */
  static async signOut(): Promise<void> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      devActiveUser = null;
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  }

  /**
   * Request password recovery reset link.
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();

    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      if (!DEV_MOCK_ACCOUNTS[trimmedEmail]) {
        return { success: false, error: 'No account registered with this email address.' };
      }
      return { success: true };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Authoritatively retrieve the verified user profile from public.profiles.
   */
  static async getCurrentProfile(): Promise<UserProfile | null> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      // Default to standard customer mock if no active session
      return devActiveUser || DEV_MOCK_ACCOUNTS['customer@tronx.com'];
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    return await this.getProfileByUserId(user.id);
  }

  /**
   * Fetch verified profile row by UUID with strict type assurance.
   */
  private static async getProfileByUserId(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone || undefined,
      role: data.role as UserRole,
      createdAt: data.created_at,
    };
  }
}


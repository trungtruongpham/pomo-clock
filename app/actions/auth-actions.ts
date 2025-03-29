"use server";

import { redirect } from "next/navigation";
import { ActionResponse } from "../../types/actions";
import { createServerSupabase } from "@/lib/supabase-server";

// Log in with email and password
export async function loginWithEmail(
  email: string,
  password: string
): Promise<ActionResponse> {
  const supabase = await createServerSupabase();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to log in",
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        sessionStatus: data.session ? "valid" : "missing",
      },
    };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred during login: " + err,
    };
  }
}

// Sign up with email and password
export async function signupWithEmail(
  email: string,
  password: string
): Promise<ActionResponse> {
  const supabase = await createServerSupabase();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/auth/confirm`,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to sign up",
      };
    }

    // For email confirmation
    if (data.user?.identities?.length === 0) {
      return {
        success: false,
        error: "This email is already registered. Please log in instead.",
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        message: "Check your email for the confirmation link",
      },
    };
  } catch (err) {
    console.error("Signup error:", err);
    return {
      success: false,
      error: "An unexpected error occurred during signup",
    };
  }
}

// Sign out
export async function signOut(): Promise<ActionResponse> {
  const supabase = await createServerSupabase();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return {
        success: false,
        error: error.message || "Failed to sign out",
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error signing out:", error);
    return {
      success: false,
      error: "Failed to sign out",
    };
  }
}

// Get current session
export async function getSession() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return data.session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Handle auth callback (for email verification)
export async function handleAuthCallback(token: string) {
  const supabase = await createServerSupabase();

  try {
    // Determine if this is a code or access_token
    // If it contains a period, it's likely an access_token (JWT format)
    if (token.includes(".")) {
      // Handle access_token
      const { error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: "",
      });

      if (error) {
        throw new Error(error.message);
      }
    } else {
      // Handle code
      const { error } = await supabase.auth.exchangeCodeForSession(token);

      if (error) {
        throw new Error(error.message);
      }
    }

    redirect("/");
  } catch (error) {
    console.error("Error handling auth callback:", error);
    redirect("/login?error=Could not verify authentication");
  }
}

// Resend confirmation email
export async function resendConfirmationEmail(
  email: string
): Promise<ActionResponse> {
  const supabase = await createServerSupabase();

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/auth/confirm`,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to resend confirmation email",
      };
    }

    return {
      success: true,
      data: { message: "Confirmation email sent. Please check your inbox." },
    };
  } catch (err) {
    console.error("Error resending confirmation:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

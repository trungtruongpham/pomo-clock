"use client";

import { useState } from "react";
import {
  loginWithEmail,
  resendConfirmationEmail,
} from "../../app/actions/auth-actions";
import Link from "next/link";

interface ConfirmationResponse {
  message: string;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResendMessage(null);
    setIsEmailNotConfirmed(false);
    setIsLoading(true);

    try {
      const result = await loginWithEmail(email, password);

      if (!result.success) {
        if (result.error?.includes("Email not confirmed")) {
          setIsEmailNotConfirmed(true);
          setError(
            "Please check your email inbox and confirm your email address before logging in"
          );
        } else {
          setError(result.error || "Failed to log in");
        }
        setIsLoading(false);
        return;
      }

      console.log("Login successful, refreshing and redirecting...");

      // Force a full page reload to ensure session is properly initialized
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  }

  async function handleResendConfirmation() {
    setIsResendingEmail(true);
    setResendMessage(null);
    setError(null);

    try {
      const result = await resendConfirmationEmail(email);
      if (result.success) {
        const data = result.data as ConfirmationResponse | undefined;
        setResendMessage(data?.message || "Confirmation email sent!");
      } else {
        setError(result.error || "Failed to resend confirmation email");
      }
    } catch (err) {
      setError("Failed to resend confirmation email: " + err);
    } finally {
      setIsResendingEmail(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Log in</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
          {isEmailNotConfirmed && (
            <div className="mt-2">
              <button
                onClick={handleResendConfirmation}
                disabled={isResendingEmail}
                className="text-blue-600 hover:underline font-medium"
              >
                {isResendingEmail ? "Sending..." : "Resend confirmation email"}
              </button>
            </div>
          )}
        </div>
      )}

      {resendMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md">
          {resendMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pomodoro hover:bg-pomodoro-darker text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

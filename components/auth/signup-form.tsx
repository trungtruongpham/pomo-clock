"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupWithEmail } from "../../app/actions/auth-actions";
import Link from "next/link";

interface SignupResponse {
  user: unknown;
  message: string;
}

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signupWithEmail(email, password);

      if (!result.success) {
        setError(result.error || "Failed to sign up");
        setIsLoading(false);
        return;
      }

      // Show success message
      const data = result.data as SignupResponse | undefined;
      setSuccess(
        data?.message ||
          "Account created successfully! Check your email to confirm your account."
      );
      setIsLoading(false);
    } catch (err) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8 shadow-xl">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
          Sign up
        </h1>
        <p className="text-sm text-black dark:text-gray-400">
          Create an account to track your productivity
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-md">
          {success}
        </div>
      )}

      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm text-gray-900 dark:text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700! bg-white dark:bg-black! px-3 py-2 text-sm text-gray-900 dark:text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [-webkit-appearance:none] [appearance:none]"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700! bg-white dark:bg-black! px-3 py-2 text-sm text-gray-900 dark:text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [-webkit-appearance:none] [appearance:none]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      ) : (
        <div className="text-center mt-4">
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium text-black dark:text-white hover:underline"
          >
            Go to login
          </button>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-black dark:text-white hover:underline font-medium"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

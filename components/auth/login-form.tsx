"use client";

import { useState } from "react";
import {
  loginWithEmail,
  resendConfirmationEmail,
} from "../../app/actions/auth-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-center">
          Login
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
              {isEmailNotConfirmed && (
                <div className="mt-2">
                  <Button
                    variant="link"
                    onClick={handleResendConfirmation}
                    disabled={isResendingEmail}
                    className="text-blue-600 dark:text-blue-400 p-0 h-auto font-medium"
                  >
                    {isResendingEmail
                      ? "Sending..."
                      : "Resend confirmation email"}
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {resendMessage && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400">
            <AlertDescription>{resendMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

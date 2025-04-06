import { SignupForm } from "../../components/auth/signup-form";
import { getSession } from "../actions/auth-actions";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  // Check if user is already logged in
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden no-scrollbar">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            PomoClock
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Create an account to track your productivity
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">PomoStudy</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create an account to track your productivity
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}

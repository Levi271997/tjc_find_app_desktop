import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "Login | True Jesus Church",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-brand-light px-4 py-16">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <Link href="/" className="font-heading text-sm font-semibold text-brand hover:underline">
          ← Back to home
        </Link>

        <h1 className="mt-6 font-heading text-3xl font-bold">Login</h1>
        <p className="mt-2 text-muted">Sign in to your account.</p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

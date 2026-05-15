import { signIn } from "@/auth";
import { FileText } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Welcome back to GrantWriter AI
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <form
            action={async () => {
              "use server";
              await signIn("institutional-sso", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl border border-transparent bg-blue-600 py-3 px-4 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md active:scale-[0.98]"
            >
              Sign in with Institutional SSO
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-500 font-medium">Or use admin access</span>
            </div>
          </div>

          <form
            action={async (formData) => {
              "use server";
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;
              try {
                await signIn("credentials", { email, password, redirectTo: "/dashboard" });
              } catch (error) {
                // Next.js redirect throws an error, which is expected behavior
                throw error;
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all"
                placeholder="admin@grantwriter.ai"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-xl border border-slate-900 bg-slate-900 py-3 px-4 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

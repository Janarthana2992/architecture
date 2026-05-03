"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/lib/api";
import { toast } from "@/components/ui/Toaster";
import { Toaster } from "@/components/ui/Toaster";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Lock } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }: FormValues) => {
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem("arch_admin_token", data.access_token);
      localStorage.setItem("arch_admin_name", data.admin_name);
      localStorage.setItem("arch_admin_email", data.admin_email);
      router.push("/admin");
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? "Invalid email or password";
      toast("error", msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian-900 px-4">
      <Toaster />
      <div className="w-full max-w-md">
        {/* Logo & branding */}
        <div className="text-center mb-12">
          <span className="font-serif text-3xl tracking-wide">
            <span className="text-gold-400">ETHOS</span>
            <span className="text-cream-200/60 ml-2">HABITATS</span>
          </span>
          <p className="mt-3 text-sm text-cream-200/40 tracking-wide">
            Socially Responsible Architecture
          </p>
        </div>

        <div className="bg-obsidian-800 border border-obsidian-600 p-8 sm:p-10">
          {/* Lock icon + heading */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
              <Lock size={16} className="text-gold-400" />
            </div>
            <div>
              <h1 className="font-sans text-lg font-medium text-cream-100">Admin Login</h1>
              <p className="text-xs text-cream-200/40">Sign in to manage your website</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs tracking-[0.1em] uppercase text-cream-200/50 mb-2">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="admin@ethoshabitats.com"
                className="w-full px-4 py-3 text-sm bg-obsidian-900 border border-obsidian-500 text-cream-100 placeholder:text-cream-200/20 focus:outline-none focus:border-gold-500 transition-colors duration-200"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs tracking-[0.1em] uppercase text-cream-200/50 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 text-sm bg-obsidian-900 border border-obsidian-500 text-cream-100 placeholder:text-cream-200/20 focus:outline-none focus:border-gold-500 transition-colors duration-200"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-200/30 hover:text-cream-100 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full mt-3"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-[10px] text-cream-200/25 tracking-wide uppercase">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}

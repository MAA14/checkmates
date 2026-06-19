"use client";

import { LogIn } from "lucide-react";
import BackgroundEffects from "@/components/molecules/BackgroundEffects";
import Toast from "@/components/molecules/Toast";
import AuthHeader from "@/components/molecules/AuthHeader";
import AuthFooter from "@/components/molecules/AuthFooter";
import LoginForm from "@/components/organisms/LoginForm";
import { routeUrl } from "@/utils/URouteUrl";
import { useToast } from "@/hooks/useToast";

/**
 * Login Page
 * Displays login form with background effects and toast notifications
 */
export default function LoginPage() {
  const { toast } = useToast();

  return (
    <div className="auth-page">
      <BackgroundEffects />

      <Toast toast={toast} />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        {/* Auth Header with Icon */}
        <AuthHeader title="Login" description="Masuk ke akun Checkmates">
          <LogIn size={36} />
        </AuthHeader>

        {/* Login Form */}
        <LoginForm />

        {/* Auth Footer with Register Link */}
        <AuthFooter
          text="Belum punya akun?"
          linkText="Daftar di sini"
          href={routeUrl.register}
        />
      </div>
    </div>
  );
}

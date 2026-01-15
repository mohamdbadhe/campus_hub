import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/state/AuthContext.jsx";
import { Mail, Lock, Chrome } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setSubmitting(true);

    try {
      await login(email.trim().toLowerCase(), password);
      navigate("/role-selection", { replace: true });
    } catch (err) {
      setErrMsg(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setErrMsg("");
    setSubmitting(true);
    
    try {
      // Redirect to backend Google OAuth endpoint
      // Backend will handle the OAuth flow and redirect back
      window.location.href = `${API_BASE}/api/auth/google/login`;
    } catch (err) {
      setErrMsg("Google sign-in failed. Please try again.");
      setSubmitting(false);
    }
  }

  // Auto-fill institutional email domain helper
  const handleEmailFocus = (e) => {
    if (!e.target.value && !email) {
      // Could prefill with @campus.edu if desired
      // setEmail("@campus.edu");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold text-xl shadow-lg">
            CF
          </div>
          <h1 className="mt-6 text-2xl md:text-3xl font-bold text-slate-900">
            Welcome to Campus Navigator
          </h1>
          <p className="mt-2 text-slate-500 text-sm md:text-base">
            Sign in to continue
          </p>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full border-2 border-slate-200 rounded-xl py-3.5 flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Chrome className="h-5 w-5 text-slate-700" />
          <span className="font-medium text-slate-700">Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <div className="text-slate-400 text-sm font-medium">OR</div>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Error Message */}
        {errMsg ? (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {errMsg}
          </div>
        ) : null}

        {/* Email/Password Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="border-2 border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-slate-300 focus-within:border-slate-900 transition-colors">
            <Mail className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              className="w-full outline-none text-slate-900 placeholder:text-slate-400"
              type="email"
              placeholder="user@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleEmailFocus}
              autoComplete="email"
              required
            />
          </div>

          <div className="border-2 border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-slate-300 focus-within:border-slate-900 transition-colors">
            <Lock className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              className="w-full outline-none text-slate-900 placeholder:text-slate-400"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl py-3.5 bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <Link
            to="/forgot-password"
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            Forgot password?
          </Link>
          <div className="text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-slate-900 font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/state/AuthContext.jsx";
import { Mail, Lock, User } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErrMsg("");

    if (password !== confirmPassword) {
      setErrMsg("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrMsg("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    try {
      await register(email.trim().toLowerCase(), password);
      navigate("/role-selection", { replace: true });
    } catch (err) {
      setErrMsg(err?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold text-xl shadow-lg">
            CF
          </div>
          <h1 className="mt-6 text-2xl md:text-3xl font-bold text-slate-900">
            Create Account
          </h1>
          <p className="mt-2 text-slate-500 text-sm md:text-base">
            Sign up to get started
          </p>
        </div>

        {/* Error Message */}
        {errMsg ? (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {errMsg}
          </div>
        ) : null}

        {/* Registration Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="border-2 border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-slate-300 focus-within:border-slate-900 transition-colors">
            <Mail className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              className="w-full outline-none text-slate-900 placeholder:text-slate-400"
              type="email"
              placeholder="user@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="border-2 border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-slate-300 focus-within:border-slate-900 transition-colors">
            <Lock className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              className="w-full outline-none text-slate-900 placeholder:text-slate-400"
              type="password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="border-2 border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-slate-300 focus-within:border-slate-900 transition-colors">
            <Lock className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              className="w-full outline-none text-slate-900 placeholder:text-slate-400"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl py-3.5 bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">Already have an account? </span>
          <Link
            to="/login"
            className="text-slate-900 font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

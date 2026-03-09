import React, { useState } from "react";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, BrainCircuit, ArrowRight, User } from "lucide-react";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await authService.register(username, email, password);

      toast.success("Account created successfully!");
      navigate("/login");

    } catch (err) {
      console.error("Register error:", err);

      const message = err.message || "Registration failed";
      setError(message);
      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 font-display">

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-30"></div>

      <div className="relative w-full max-w-md px-6">

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-10">

          {/* Header */}
          <div className="text-center mb-10">

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-300/50 mb-4">
              <BrainCircuit className="h-7 w-7 text-white" />
            </div>

            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
              Create account
            </h1>

            <p className="text-sm text-slate-500">
              Start your learning journey today
            </p>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div className="space-y-2">

              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Username
              </label>

              <div className="relative">

                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center 
                  ${focusedField === "username" ? "text-emerald-500" : "text-slate-400"}`}
                >
                  <User className="h-5 w-5" />
                </div>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="your username"
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                />

              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">

              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email
              </label>

              <div className="relative">

                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center 
                  ${focusedField === "email" ? "text-emerald-500" : "text-slate-400"}`}
                >
                  <Mail className="h-5 w-5" />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                />

              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">

              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>

              <div className="relative">

                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center 
                  ${focusedField === "password" ? "text-emerald-500" : "text-slate-400"}`}
                >
                  <Lock className="h-5 w-5" />
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                />

              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Sign up
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Sign in
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;
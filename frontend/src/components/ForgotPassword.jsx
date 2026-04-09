import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword({ email });
      setSuccess(data.message || "If this email exists, reset instructions were sent.");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-slate-800">Forgot Password</h1>
        <p className="text-slate-500 mt-1">Enter your email to receive reset instructions.</p>

        {error && <div className="mt-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
        {success && (
          <div className="mt-4 rounded-md bg-green-100 px-3 py-2 text-sm text-green-700">{success}</div>
        )}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-md bg-slate-900 text-white py-2.5 font-medium hover:bg-slate-800 transition disabled:opacity-60"
            type="submit"
          >
            {loading ? "Submitting..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Back to{" "}
          <Link className="text-blue-600 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

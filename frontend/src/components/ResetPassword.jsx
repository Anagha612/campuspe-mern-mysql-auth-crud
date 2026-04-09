import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authApi";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Reset token is missing. Open the link from your email.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword({ token, password });
      setSuccess(data.message || "Password reset successful.");
      setPassword("");
      setConfirmPassword("");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-slate-800">Reset Password</h1>
        <p className="text-slate-500 mt-1">Set a new password for your account.</p>

        {error && <div className="mt-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
        {success && (
          <div className="mt-4 rounded-md bg-green-100 px-3 py-2 text-sm text-green-700">{success}</div>
        )}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Minimum 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Re-enter password"
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-md bg-slate-900 text-white py-2.5 font-medium hover:bg-slate-800 transition disabled:opacity-60"
            type="submit"
          >
            {loading ? "Saving..." : "Reset Password"}
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

export default ResetPassword;

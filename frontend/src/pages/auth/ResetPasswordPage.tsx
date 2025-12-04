import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { resetPasswordApi } from "@/api/auth/auth.api";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get email and code from URL params
    const emailParam = searchParams.get("email");
    const codeParam = searchParams.get("code");

    if (emailParam) {
      setForm((prev) => ({ ...prev, email: decodeURIComponent(emailParam) }));
    }
    if (codeParam) {
      setForm((prev) => ({ ...prev, code: codeParam }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email) {
      toast.error("Email is required.");
      return;
    }
    if (!form.code) {
      toast.error("Recovery code is required.");
      return;
    }
    if (!form.newPassword) {
      toast.error("New password is required.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordApi({
        email: form.email,
        code: form.code,
        newPassword: form.newPassword,
      });
      toast.success("Password has been reset successfully. You can now login with your new password.");
      navigate("/auth/login");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to reset password.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full md:max-w-md px-4 md:px-8 py-8 shadow-2xl bg-primary rounded-2xl"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link
            to={"/"}
            className="font-poppins text-3xl font-bold text-yellow mb-2"
          >
            Fimanage
          </Link>
          <p className="text-white/50 text-sm">Set your new password</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <TextField
            type="email"
            name="email"
            placeholder="Email *"
            value={form.email}
            onChange={handleChange}
            required
            icon={<FiMail />}
          />

          {/* Recovery Code */}
          <TextField
            name="code"
            placeholder="Recovery Code *"
            value={form.code}
            onChange={handleChange}
            required
            icon={<FiLock />}
          />

          {/* New Password */}
          <TextField
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New Password *"
            value={form.newPassword}
            onChange={handleChange}
            required
            icon={<FiLock />}
            rightIcon={
              <button
                type="button"
                tabIndex={-1}
                className="text-yellow-400 hover:text-yellow-600 transition"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="text-lg" />
                ) : (
                  <FiEye className="text-lg" />
                )}
              </button>
            }
          />

          {/* Confirm Password */}
          <TextField
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password *"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            icon={<FiLock />}
            rightIcon={
              <button
                type="button"
                tabIndex={-1}
                className="text-yellow-400 hover:text-yellow-600 transition"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="text-lg" />
                ) : (
                  <FiEye className="text-lg" />
                )}
              </button>
            }
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full flex items-center justify-center gap-1"
          >
            <p className="text-white text-sm">Remember your password?</p>
            <button
              type="button"
              className="text-yellow text-sm cursor-pointer hover:underline"
              onClick={() => navigate("/auth/login")}
            >
              Login here
            </button>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "cursor-not-allowed opacity-80"
                  : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
              } w-full py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-500 text-white font-bold text-lg mt-2 shadow-md`}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <LoadingSmall /> : "Reset Password"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;


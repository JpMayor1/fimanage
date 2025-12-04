import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { forgotPasswordApi } from "@/api/auth/auth.api";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    setLoading(true);
    try {
      await forgotPasswordApi({ email });
      toast.success(
        "If an account with that email exists, a password reset code has been sent to your email."
      );
      navigate("/auth/login");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to send password reset code.";
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
          <p className="text-white/50 text-sm">Reset your password</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <TextField
            type="email"
            name="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            icon={<FiMail />}
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
              {loading ? <LoadingSmall /> : "Send Reset Code"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;


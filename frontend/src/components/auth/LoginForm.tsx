import { useAuthStore } from "@/stores/auth/useAuthStore";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

const LoginForm: React.FC = () => {
  const { loginAccount, loginLoading } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await loginAccount(formData);

    if (success) {
      setFormData({
        username: "",
        password: "",
      });
      navigate("/");
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Login Card */}
      <motion.div className="bg-primary rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="font-poppins text-3xl font-bold text-yellow mb-2">
            Fimanage
          </h1>
          <p className="text-white/50 text-sm">Sign in to your account</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-white/90" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className={`w-full pl-12 pr-4 py-4 font-inter bg-primary/50 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.username
                    ? "border-red focus:ring-red/50"
                    : "border-yellow focus:ring-yellow/50"
                }`}
              />
            </div>
            {errors.username && (
              <motion.p
                className="mt-2 text-sm text-red-300 font-inter"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.username}
              </motion.p>
            )}
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-white/90" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full pl-12 pr-12 py-4 font-inter bg-primary/50 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.password
                    ? "border-red focus:ring-red/50"
                    : "border-yellow focus:ring-yellow/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-yellow hover:text-white transition-colors"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                className="mt-2 text-sm text-red-300 font-inter"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.password}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full flex items-center justify-center gap-1"
          >
            <p className="text-white text-sm">Don't have an account?</p>
            <button
              type="button"
              className="text-yellow text-sm cursor-pointer hover:underline"
              onClick={() => navigate("/auth/register")}
            >
              Register here
            </button>
          </motion.div>

          {/* Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 font-poppins font-semibold text-white bg-gradient-to-r from-yellow to-yellow hover:opacity-90 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
              whileTap={{ scale: 0.98 }}
            >
              {loginLoading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;

import TextField from "@/components/custom/TextField";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FiAtSign, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { loginAccount, loginLoading } = useAuthStore();
  const [form, setForm] = useState<FormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await loginAccount(form);

    if (success) {
      setForm({
        username: "",
        password: "",
      });
      navigate("/");
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
          <h1 className="font-poppins text-3xl font-bold text-yellow mb-2">
            Fimanage
          </h1>
          <p className="text-white/50 text-sm">Sign in to your account</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <TextField
            name="username"
            placeholder="Username *"
            value={form.username}
            onChange={handleChange}
            required
            icon={<FiAtSign />}
          />

          {/* Password */}
          <TextField
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password *"
            value={form.password}
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
              className={`${
                loginLoading
                  ? "cursor-not-allowed opacity-80"
                  : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
              } w-full py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-500 text-white font-bold text-lg mt-2 shadow-md`}
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
    </div>
  );
};

export default LoginPage;

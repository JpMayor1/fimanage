import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import type { AccountType } from "@/types/account/account.type";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import {
  FiAtSign,
  FiEye,
  FiEyeOff,
  FiImage,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const { registerccount, loading } = useAuthStore();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<AccountType>>({
    profilePicture: null,
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    username: "",
    password: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleProfilePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await registerccount(form);

    if (success) {
      setForm({
        profilePicture: null,
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        email: "",
        username: "",
        password: "",
        address: "",
      });
      navigate("/home/dashboard");
    }
  };
  return (
    <div className="h-full w-full flex items-start justify-center px-4 pt-5 pb-20 overflow-y-scroll no-scrollbar">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full md:max-w-md px-4 md:px-8 py-8 shadow-2xl bg-primary rounded-2xl"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-4"
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
          <p className="text-white/50 text-sm">Register an account</p>
        </motion.div>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-4"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-2">
            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
              <div className="w-20 h-20 md:w-30 md:h-30 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center overflow-hidden shadow hover:ring-2 hover:ring-yellow-400 transition">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiImage className="text-4xl text-yellow-400" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </div>
            </div>
          </div>
          {/* Names */}
          <div className="flex gap-2">
            <TextField
              name="firstName"
              placeholder="First Name *"
              value={form.firstName}
              onChange={handleChange}
              required
              icon={<FiUser />}
            />
            <TextField
              name="middleName"
              placeholder="Middle Name"
              value={form.middleName}
              onChange={handleChange}
              icon={<FiUser />}
            />
          </div>
          <div className="flex gap-2">
            <TextField
              name="lastName"
              placeholder="Last Name *"
              value={form.lastName}
              onChange={handleChange}
              required
              icon={<FiUser />}
            />
            <TextField
              name="suffix"
              placeholder="Suffix"
              value={form.suffix}
              onChange={handleChange}
              icon={<FiUser />}
            />
          </div>

          {/* Address */}
          <TextField
            type="address"
            name="address"
            placeholder="Address *"
            value={form.address}
            onChange={handleChange}
            required
            icon={<IoLocationOutline />}
          />

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
                className="text-yellow-400 hover:text-yellow-600 transition cursor-pointer"
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

          <div className="w-full flex items-center justify-center gap-1">
            <p className="text-white text-sm">Already have an account?</p>
            <button
              type="button"
              className="text-yellow text-sm cursor-pointer hover:underline"
              onClick={() => navigate("/auth/login")}
            >
              Login here
            </button>
          </div>

          <motion.button
            disabled={loading}
            type="submit"
            whileTap={{ scale: 0.97 }}
            className={`${
              loading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-500 text-white font-bold text-lg mt-2 shadow-md`}
          >
            {loading ? <LoadingSmall /> : "Register"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

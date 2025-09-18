import AnimatedBackground from "@/components/animations/AnimatedBackground";
import RegisterForm from "@/components/auth/RegisterForm";
import React from "react";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen w-screen relative flex items-center justify-center overflow-y-scroll no-scrollbar">
      <AnimatedBackground />
      <div className="relative z-10 w-full flex items-center justify-center p-3">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;

import AnimatedBackground from "@/components/animations/AnimatedBackground";
import LoginForm from "@/components/auth/LoginForm";
import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 w-full flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;

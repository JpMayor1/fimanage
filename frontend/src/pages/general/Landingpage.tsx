import { usePWAInstall } from "@/hooks/usePWAInstall";
import { motion } from "framer-motion";
import {
  FaArrowDown,
  FaArrowUp,
  FaBalanceScale,
  FaChartLine,
  FaDollarSign,
  FaReceipt,
  FaShieldAlt,
  FaSync,
} from "react-icons/fa";
import { MdArrowForward, MdDashboard, MdTrendingUp } from "react-icons/md";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { canInstall, promptInstall } = usePWAInstall();

  const features = [
    {
      title: "Sources Management",
      description:
        "Track income, expenses, and balances across multiple money sources with real-time updates.",
      icon: <FaDollarSign className="text-3xl" />,
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/40",
    },
    {
      title: "Transaction Tracking",
      description:
        "Record and categorize all financial activities including income, expenses, transfers, and payments.",
      icon: <FaReceipt className="text-3xl" />,
      color: "from-green-500/20 to-emerald-500/20 border-green-500/40",
    },
    {
      title: "Dept & Receiving",
      description:
        "Manage what you owe and what others owe you with due dates, interest tracking, and status monitoring.",
      icon: <FaBalanceScale className="text-3xl" />,
      color: "from-yellow/20 to-amber-500/20 border-yellow/40",
    },
    {
      title: "Dashboard Analytics",
      description:
        "Visualize your financial health with comprehensive charts, trends, and insights at a glance.",
      icon: <MdDashboard className="text-3xl" />,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/40",
    },
    {
      title: "Daily Expense Limits",
      description:
        "Set and monitor daily spending limits with real-time tracking and alerts to stay on budget.",
      icon: <MdTrendingUp className="text-3xl" />,
      color: "from-red-500/20 to-orange-500/20 border-red-500/40",
    },
    {
      title: "Comprehensive Reports",
      description:
        "Generate detailed financial reports with PDF export for any period - weekly, monthly, or yearly.",
      icon: <FaChartLine className="text-3xl" />,
      color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/40",
    },
  ];

  return (
    <div className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden relative bg-gradient-to-b from-zinc-950 via-black to-zinc-950 no-scrollbar">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-yellow/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-10 flex justify-between items-center px-4 md:px-8 py-4 md:py-6 border-b border-white/10 backdrop-blur-sm bg-zinc-950/50">
        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-yellow drop-shadow-lg"
        >
          FIManage
        </motion.h1>

        <motion.nav
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-3 md:gap-4 items-center"
        >
          <Link
            to="/auth/login"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20 text-white text-sm sm:text-base hover:bg-white/10 hover:border-yellow/50 transition-all cursor-pointer backdrop-blur-sm"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-yellow text-black font-semibold text-sm sm:text-base hover:bg-yellow/90 hover:shadow-lg hover:shadow-yellow/50 transition-all cursor-pointer"
          >
            Get Started
          </Link>
        </motion.nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-80px)] px-4 md:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow/10 border border-yellow/30 text-yellow text-sm font-medium mb-4"
          >
            <FaShieldAlt />
            <span>Secure Financial Management</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              Take Control of
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow via-yellow to-amber-400 bg-clip-text text-transparent">
              Your Finances
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed px-4">
            A comprehensive financial management system that helps you track
            sources, manage transactions, monitor debts and receivings, and
            generate detailed reports. Your financial future, simplified.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            {canInstall ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={promptInstall}
                className="inline-flex items-center gap-2 bg-yellow text-black px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-yellow/90 hover:shadow-2xl hover:shadow-yellow/50 transition-all cursor-pointer"
              >
                Install App{" "}
                <MdArrowForward className="text-base sm:text-lg md:text-xl" />
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-2 bg-yellow text-black px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-yellow/90 hover:shadow-2xl hover:shadow-yellow/50 transition-all cursor-pointer"
                >
                  Get Started{" "}
                  <MdArrowForward className="text-base sm:text-lg md:text-xl" />
                </Link>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 md:gap-8 pt-8 max-w-2xl mx-auto"
          >
            {[
              {
                icon: <FaArrowDown className="text-income" />,
                label: "Income",
              },
              {
                icon: <FaArrowUp className="text-expense" />,
                label: "Expense",
              },
              {
                icon: <FaBalanceScale className="text-balance" />,
                label: "Balance",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="text-2xl">{stat.icon}</div>
                <span className="text-white/60 text-sm font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4"
            >
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4"
            >
              Everything you need to manage your finances effectively, all in
              one place.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${feature.color} border backdrop-blur-sm hover:shadow-2xl transition-all cursor-pointer group`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-4 text-yellow">{feature.icon}</div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-yellow/10 via-yellow/5 to-transparent border border-yellow/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow/20 border border-yellow/40 mb-6"
          >
            <FaSync className="text-yellow text-2xl" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 px-4">
            Ready to Transform Your Financial Management?
          </h2>
          <p className="text-white/70 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of users who are taking control of their finances
            with FIManage. Start your journey today.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 bg-yellow text-black px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-yellow/90 hover:shadow-2xl hover:shadow-yellow/50 transition-all cursor-pointer"
            >
              Start Free{" "}
              <MdArrowForward className="text-base sm:text-lg md:text-xl" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-zinc-950/50 backdrop-blur-sm py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} FIManage. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>Built with</span>
            <span className="text-yellow">❤️</span>
            <span>for better financial management</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

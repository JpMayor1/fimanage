import { usePWAInstall } from "@/hooks/usePWAInstall";
import { motion } from "framer-motion";
import { FaChartPie, FaMoneyBillWave, FaWallet } from "react-icons/fa6";
import { MdArrowForward } from "react-icons/md";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { canInstall, promptInstall } = usePWAInstall();

  return (
    <div className="text-white h-screen flex flex-col font-sans overflow-y-scroll no-scrollbar">
      {/* Navbar */}
      <header className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6 border-b border-gray-700">
        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg md:text-3xl font-extrabold tracking-wide text-yellow drop-shadow-lg"
        >
          Fimanage
        </motion.h1>

        <motion.nav
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-3 md:gap-6 items-center"
        >
          <Link
            to="/auth/login"
            className="px-3 py-1 md:px-4 md:py-2 rounded-lg border border-yellow text-yellow hover:bg-yellow hover:text-black transition"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="px-3 py-1 md:px-4 md:py-2 rounded-lg bg-yellow text-black hover:opacity-90 transition"
          >
            Register
          </Link>
        </motion.nav>
      </header>
      {/* Hero Section */}
      <section className="flex flex-1 flex-col md:flex-row items-center justify-center px-8 py-20 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-6 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Manage Your Finances{" "}
            <span className="text-yellow drop-shadow-lg">Smarter</span>
          </h2>
          <p className="text-base md:text-lg text-gray-300">
            Take control of your money with real-time tracking, smart budgeting,
            and reports for your income, expenses, savings, and investments.
            Your financial future starts here.
          </p>

          {/* If app install available → show Install button */}
          {canInstall ? (
            <button
              onClick={promptInstall}
              className="inline-flex items-center gap-2 bg-yellow text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg hover:shadow-yellow/50"
            >
              Install App <MdArrowForward className="text-xl" />
            </button>
          ) : (
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 bg-yellow text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg hover:shadow-yellow/50"
            >
              Get Started <MdArrowForward className="text-xl" />
            </Link>
          )}
        </motion.div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20 px-8 ">
        {" "}
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16"
        >
          {" "}
          Features Built for the Future{" "}
        </motion.h3>{" "}
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {" "}
          {[
            {
              title: "Expense Tracking",
              desc: "Track every transaction with clarity and precision.",
              icon: <FaMoneyBillWave className="text-yellow text-4xl" />,
            },
            {
              title: "Budget Planning",
              desc: "Set financial goals and stay ahead with smart budgeting.",
              icon: <FaWallet className="text-yellow text-4xl" />,
            },
            {
              title: "Reports & Insights",
              desc: "Visualize spending patterns with futuristic analytics.",
              icon: <FaChartPie className="text-yellow text-4xl" />,
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-primary p-8 rounded-2xl shadow-lg hover:shadow-yellow/30 text-center"
            >
              {" "}
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>{" "}
              <h4 className="text-xl font-semibold text-yellow">
                {" "}
                {feature.title}{" "}
              </h4>{" "}
              <p className="mt-2 text-gray-300">{feature.desc}</p>{" "}
            </motion.div>
          ))}{" "}
        </div>{" "}
      </section>
      {/* Footer */}
      <footer className="bg-primary py-6 text-center text-gray-500 border-t border-gray-700">
        © {new Date().getFullYear()} Fimanage. Built with passion 🚀
      </footer>
    </div>
  );
}

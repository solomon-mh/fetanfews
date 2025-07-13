import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowRight,
  Zap,
  ShoppingCart,
  RefreshCw,
  Users,
  Rocket,
  Shield,
  Layers,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const services = [
  {
    title: "Smart Inventory",
    description:
      "Automated stock tracking with AI-powered predictions and expiry alerts.",
    icon: <Layers className="w-6 h-6" />,
    color: "bg-indigo-100 dark:bg-indigo-900/50",
    hoverColor: "hover:bg-indigo-200 dark:hover:bg-indigo-800/50",
  },
  {
    title: "Advanced Analytics",
    description:
      "Real-time sales dashboards with customer behavior insights and forecasting.",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "bg-blue-100 dark:bg-blue-900/50",
    hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800/50",
  },
  {
    title: "Expiry Prevention",
    description:
      "Automated alerts and smart recommendations to minimize expired stock.",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-amber-100 dark:bg-amber-900/50",
    hoverColor: "hover:bg-amber-200 dark:hover:bg-amber-800/50",
  },
  {
    title: "Customer Intelligence",
    description: "Personalized recommendations based on purchase history.",
    icon: <Users className="w-6 h-6" />,
    color: "bg-emerald-100 dark:bg-emerald-900/50",
    hoverColor: "hover:bg-emerald-200 dark:hover:bg-emerald-800/50",
  },
  {
    title: "E-Commerce Platform",
    description: "Seamless online ordering with prescription uploads.",
    icon: <ShoppingCart className="w-6 h-6" />,
    color: "bg-purple-100 dark:bg-purple-900/50",
    hoverColor: "hover:bg-purple-200 dark:hover:bg-purple-800/50",
  },
  {
    title: "Network Integration",
    description: "Real-time stock sharing across your pharmacy network.",
    icon: <RefreshCw className="w-6 h-6" />,
    color: "bg-rose-100 dark:bg-rose-900/50",
    hoverColor: "hover:bg-rose-200 dark:hover:bg-rose-800/50",
  },
];

const efficiencyData = [
  { service: "Inventory", hoursSaved: 40, color: "#6366F1" },
  { service: "Analytics", hoursSaved: 30, color: "#3B82F6" },
  { service: "Compliance", hoursSaved: 20, color: "#F59E0B" },
  { service: "E-Commerce", hoursSaved: 25, color: "#8B5CF6" },
];

const stats = [
  { value: "95%", label: "Customer Satisfaction" },
  { value: "40%", label: "Time Savings" },
  { value: "30%", label: "Revenue Growth" },
  { value: "100+", label: "Pharmacies Served" },
];

export default function ServicesPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-24 text-gray-800 dark:text-gray-100 px-4 sm:px-6 min-h-screen space-y-20">
      {/* Animated Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center space-y-6 max-w-4xl mx-auto"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full mb-4"
        >
          <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
            Next-Gen Pharmacy Solutions
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400"
        >
          Transform Your Pharmacy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          AI-powered solutions to streamline operations, boost sales, and
          enhance patient care.
        </motion.p>
      </motion.section>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center"
          >
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Interactive Services Cards */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
      >
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
            onHoverStart={() => setHoveredIndex(idx)}
            onHoverEnd={() => setHoveredIndex(null)}
            className={`relative p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden ${service.color} ${service.hoverColor} transition-all duration-300`}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-black/20"
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm mb-4">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {service.icon}
                </motion.div>
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                {service.description}
              </p>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm"
              >
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Animated Chart Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-6xl mx-auto border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold mb-2"
          >
            Operational Efficiency Gains
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Average monthly hours saved by our pharmacy partners
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={efficiencyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(156, 163, 175, 0.2)"
              />
              <XAxis
                dataKey="service"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280" }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.97)",
                  borderColor: "rgba(209, 213, 219, 0.5)",
                  borderRadius: "0.75rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  padding: "1rem",
                }}
                itemStyle={{ color: "#1E293B" }}
                labelStyle={{ fontWeight: 600, color: "#1E293B" }}
              />
              <Bar
                dataKey="hoursSaved"
                radius={[8, 8, 0, 0]}
                animationDuration={1800}
              >
                {efficiencyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: `drop-shadow(0 4px 8px ${entry.color}40)`,
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.section>

      {/* Glowing CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-90 dark:opacity-100"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative z-10 p-10 text-center space-y-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white"
            whileHover={{ scale: 1.02 }}
          >
            Ready for Digital Transformation?
          </motion.h2>
          <motion.p
            className="text-indigo-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Schedule a demo to see our platform in action.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket className="w-5 h-5" />
              Get Started
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

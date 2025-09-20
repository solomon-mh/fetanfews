import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaChartLine,
  FaUserShield,
  FaBoxes,
  FaRegChartBar,
} from "react-icons/fa";
import { RiMedicineBottleLine } from "react-icons/ri";
import TestimonialsSection from "../../components/TestimonialSection";

const growthData = [
  { name: "Jan", pharmacies: 20 },
  { name: "Feb", pharmacies: 40 },
  { name: "Mar", pharmacies: 70 },
  { name: "Apr", pharmacies: 100 },
  { name: "May", pharmacies: 150 },
  { name: "Jun", pharmacies: 220 },
];

const pieData = [
  { name: "Medication Tracking", value: 400 },
  { name: "Inventory Management", value: 300 },
  { name: "Customer Analytics", value: 300 },
  { name: "Sales Optimization", value: 200 },
];

const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"];

export default function AboutUsPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0icmdiYSg3OSwgNzAsIDIyOSwgMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-20 dark:opacity-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full mb-6"
          >
            <RiMedicineBottleLine className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
              Pharmacy Innovation
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 mb-6">
            Empowering Pharmacies, <br />
            Enhancing Patient Care
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            We build intelligent solutions that transform pharmacy operations —
            smarter inventory, personalized care, and real-time business
            insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Join Our Growing Network
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: (
                <FaBoxes className="text-4xl text-indigo-600 dark:text-indigo-400" />
              ),
              title: "Smart Inventory",
              desc: "AI-powered stock management with automated expiry alerts and reordering.",
              color: "bg-indigo-50 dark:bg-indigo-900/20",
            },
            {
              icon: (
                <FaRegChartBar className="text-4xl text-indigo-600 dark:text-indigo-400" />
              ),
              title: "Business Analytics",
              desc: "Comprehensive dashboards tracking profits, top products, and market trends.",
              color: "bg-blue-50 dark:bg-blue-900/20",
            },
            {
              icon: (
                <FaUserShield className="text-4xl text-indigo-600 dark:text-indigo-400" />
              ),
              title: "Patient Insights",
              desc: "Understand medication adherence and personalize patient recommendations.",
              color: "bg-purple-50 dark:bg-purple-900/20",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className={`${feature.color} p-8 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all`}
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Charts Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12"
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine className="text-indigo-600 dark:text-indigo-400 text-2xl" />
              <h2 className="text-2xl font-bold">Network Growth</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(156, 163, 175, 0.2)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.97)",
                    borderColor: "rgba(209, 213, 219, 0.5)",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pharmacies"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#4F46E5" }}
                  activeDot={{
                    r: 7,
                    stroke: "#4F46E5",
                    strokeWidth: 2,
                    fill: "#fff",
                  }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="text-indigo-600 dark:text-indigo-400 text-2xl" />
              <h2 className="text-2xl font-bold">Platform Capabilities</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  animationDuration={1500}
                >
                  {pieData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.97)",
                    borderColor: "rgba(209, 213, 219, 0.5)",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
            Trusted by Pharmacy Professionals
          </h2>
        </motion.div>
        <TestimonialsSection />
      </section>

      {/* CTA Footer */}
      <section className="relative py-20 px-6 dark:text-white ">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-600 opacity-50 dark:opacity-40 z-0"></div>
        <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] dark:opacity-30"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center z-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 z-12">
            Ready to Transform Your Pharmacy?
          </h2>
          <p className="text-xl dark:text-indigo-100 mb-8">
            Join hundreds of pharmacies revolutionizing their operations with
            our platform.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition-all"
          >
            Schedule a Demo
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}

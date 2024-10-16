import React from "react";
import { Book, Lightbulb, Users, LucideIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPageRoute: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.authState.isLoggedIn
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <main className="container mx-auto pt-16 px-4">
        <motion.section className="text-center mb-12" variants={itemVariants}>
          <motion.h1
            className="text-5xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Interpreter Vocabulary Lexicon
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Your comprehensive resource for understanding and creating a lexicon
            of medical terminology
          </motion.p>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
        >
          <FeatureCard
            icon={Book}
            title="Vocabulary Map"
            description="Access a vast database of medical terms, diseases, and conditions."
          />
          <FeatureCard
            icon={Lightbulb}
            title="Learn"
            description="Expand your knowledge with interactive lessons and study materials."
          />
          <FeatureCard
            icon={Users}
            title="Community Suggestions"
            description="Contribute and learn from a community of medical professionals and students."
          />
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-8 mb-12"
        >
          {isAuthenticated ? (
            <div className="grid place-items-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Explore Medical Terminology
              </h3>
              <p className="text-gray-600 mb-4">
                Access our comprehensive Vocabulary Map to explore, learn, and
                master medical terminology at your own pace.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/vocabulary-map"
                  className="bg-[#5e67aa] text-white px-6 py-3 rounded-lg hover:bg-[#4a5396] transition duration-300 font-semibold inline-block"
                >
                  Explore the Vocabulary Map →
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 place-items-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 ">
                Join Our Community
              </h3>
              <p className="text-gray-600 mb-4">
                Register or log in to access our comprehensive Vocabulary Map and
                start your journey in mastering medical terminology.
              </p>
            </div>
          )}
        </motion.section>
      </main>
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
    >
      <motion.div
        className="text-[#5e67aa] mb-4 justify-center flex"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Icon size={32} />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default LandingPageRoute;
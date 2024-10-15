import React from "react";
import { Book, Lightbulb, Users, LucideIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";

const LandingPageRoute: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.authState.isLoggedIn
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto pt-16 px-4">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Interpreter Vocabulary Lexicon
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive resource for understanding and creating a lexicon
            of medical terminology
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
        </section>

        {isAuthenticated ? (
          <section className="bg-white rounded-lg shadow-md p-8 mb-12 grid ">
            <div className=" grid place-items-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Explore Medical Terminology
              </h3>
              <p className="text-gray-600 mb-4">
                Access our comprehensive Vocabulary Map to explore, learn, and
                master medical terminology at your own pace.
              </p>
              <Link
                to="/vocabulary-map"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300 font-semibold inline-block"
              >
                Explore the Vocabulary Map →
              </Link>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Join Our Community
            </h3>
            <p className="text-gray-600 mb-4">
              Register or log in to access our comprehensive Vocabulary Map and
              start your journey in mastering medical terminology.
            </p>
          </section>
        )}
      </main>
    </div>
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
    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300 ">
      <div className="text-gray-600 mb-4 justify-center flex">
        <Icon size={48} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default LandingPageRoute;

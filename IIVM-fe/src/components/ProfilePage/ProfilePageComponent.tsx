import React from "react";
import { User, Briefcase, Book, BookOpen } from "lucide-react";
import { Button } from "../UI/Button";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";

interface ProfileData {
  username: string;
  email: string;
  user_type: string;
}

interface ProfileDashboardProps {
  data: ProfileData;
  onLogout: () => void;
  savedVocabulary: VocabularyItemInterface[];
  selectedLanguage: string
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  data,
  onLogout,
  savedVocabulary,
  selectedLanguage
}) => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-l from-white to-[#a09edd] p-6 text-black">
          <div className="flex items-center">
            <User size={64} className="mr-4" />
            <div>
              <h1 className="text-3xl font-bold">{data.username}</h1>
              <p className="text-xl">{data.email}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
              <Briefcase className="mr-2" /> Role
            </h2>
            <p className="text-lg text-gray-600">{data.user_type}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
              <Book className="mr-2" /> Saved Vocabulary
            </h2>
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {savedVocabulary.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <BookOpen size={20} className="mr-3 text-indigo-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{item.term}</p>
                      <p className="text-sm text-gray-600">
                        {item.primary_translations[selectedLanguage] || "Translation not available"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onLogout}
              label="Logout"
              className="bg-red-500 text-white hover:bg-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
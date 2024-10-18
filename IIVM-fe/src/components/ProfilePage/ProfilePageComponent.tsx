import React, { useState } from "react";
import { User, Briefcase, Lock } from "lucide-react";
import { Button } from "../UI/Button";

interface ProfileData {
  username: string;
  email: string;
  user_type: string;
}

interface ProfileDashboardProps {
  data: ProfileData;
  onLogout: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => void;
}

export const ProfilePageComponent: React.FC<ProfileDashboardProps> = ({
  data,
  onLogout,
  onChangePassword,
}) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = () => {
    onChangePassword(currentPassword, newPassword);
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#7c85c7] to-[#a09edd] p-8 text-white">
          <div className="flex items-center">
            <User size={64} className="mr-6" />
            <div>
              <h1 className="text-4xl font-bold mb-2">{data.username}</h1>
              <p className="text-xl">{data.email}</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
              <Briefcase className="mr-2" /> Role
            </h2>
            <p className="text-lg text-gray-600">{data.user_type}</p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Lock className="mr-2" /> Change Password
            </h2>
            {isChangingPassword ? (
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="currentPassword"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7c85c7]"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="newPassword"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7c85c7]"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    onClick={() => setIsChangingPassword(false)}
                    label="Cancel"
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                  />
                  <Button
                    onClick={handleChangePassword}
                    label="Save"
                    className="bg-[#7c85c7] text-white hover:bg-[#6c75b7]"
                  />
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsChangingPassword(true)}
                label="Change Password"
                className="bg-[#7c85c7] text-white hover:bg-[#6c75b7]"
                disabled={true}
              />
            )}
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

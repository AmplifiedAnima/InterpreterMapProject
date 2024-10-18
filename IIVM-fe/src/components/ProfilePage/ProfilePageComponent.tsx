import React, { useState } from "react";
import { User, Briefcase, Lock } from "lucide-react";
import { Button } from "../UI/Button";
import { useFormValidation } from "../../utils/useFormValidation"; // Ensure this path is correct
import { passwordChangeSchema } from "../../interfaces/passwordChangeSchema"; // Ensure this path is correct
import { Input } from "../UI/InputPlaceholder";
import { motion } from "framer-motion"; // Importing motion from framer-motion

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

  // Use the validation hook with the defined schema
  const { values, errors, handleChange, handleSubmit } = useFormValidation(
    passwordChangeSchema,
    { currentPassword: "", newPassword: "", confirmPassword: "" }
  );

  const handleChangePassword = () => {
    // Call the password change function
    onChangePassword(values.currentPassword, values.newPassword);
    setIsChangingPassword(false);

    // Reset values after change
    handleChange({
      target: { name: "currentPassword", value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
    handleChange({
      target: { name: "newPassword", value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
    handleChange({
      target: { name: "confirmPassword", value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
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
              <motion.form
                onSubmit={handleSubmit(handleChangePassword)}
                className="w-1/4 mx-auto flex flex-col items-center"
                initial={{ opacity: 0, y: -20 }} // Initial state
                animate={{ opacity: 1, y: 0 }} // Animate to this state
                exit={{ opacity: 0, y: -20 }} // State when exiting
                transition={{ duration: 0.3 }} // Transition duration
              >
                <div className="mb-4 w-full">
                  <label
                    htmlFor="currentPassword"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Current Password
                  </label>
                  <Input
                    type="password"
                    name="currentPassword"
                    value={values.currentPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#7c85c7]`}
                  />
                  {errors?.currentPassword && (
                    <p className="text-red-600">{errors.currentPassword}</p>
                  )}
                </div>
                <div className="mb-4 w-full">
                  <label
                    htmlFor="newPassword"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    New Password
                  </label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#7c85c7]`}
                  />
                  {errors?.newPassword && (
                    <p className="text-red-600">{errors.newPassword}</p>
                  )}
                </div>
                <div className="mb-6 w-full">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#7c85c7]`}
                  />
                  {errors?.confirmPassword && (
                    <p className="text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-4 w-full">
                  <Button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    label="Cancel"
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                  />
                  <Button
                    type="submit"
                    label="Save"
                    className="bg-[#7c85c7] text-white hover:bg-[#6c75b7]"
                  />
                </div>
              </motion.form>
            ) : (
              <Button
                onClick={() => setIsChangingPassword(true)}
                label="Change Password"
                className="bg-[#7c85c7] text-white hover:bg-[#6c75b7]"
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

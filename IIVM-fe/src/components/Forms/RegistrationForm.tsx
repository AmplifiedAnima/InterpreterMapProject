import React from "react";
import { useFormValidation } from "../../utils/useFormValidation";
import { userRegistrationSchema } from "../../interfaces/userRegistrationSchema";
import { UserRegistrationData } from "../../redux/auth/authTypes";
import { Input as InputPlaceholder } from "./../UI/InputPlaceholder";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface RegistrationFormProps {
  onSubmit: (data: UserRegistrationData) => void;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: {
    error: string;
    details: Record<string, string[]>;
  } | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  status,
  error,
}) => {
  const {
    values,
    errors: validationErrors,
    handleChange,
    handleSubmit,
  } = useFormValidation<UserRegistrationData>(userRegistrationSchema, {
    user_type: "interpreter",
  });

  const navigate = useNavigate();

  const renderError = (field: keyof UserRegistrationData) => {
    const validationError = validationErrors?.[field];
    const serverError = error?.details?.[field]?.[0];
    const errorMessage = validationError || serverError;

    return errorMessage ? (
      <div className="bg-[#ffe1e6] rounded-md mt-1 flex justify-center items-center p-2">
        <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
      </div>
    ) : null;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className="mt-2 space-y-2"
      >
        <div className="w-full max-w-xs mx-auto my-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            {/* Username field */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm font-bold mb-2 text-center"
              >
                Username
              </label>
              <InputPlaceholder
                id="username"
                type="text"
                name="username"
                disabled={status === "succeeded"}
                value={values.username || ""}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {renderError("username")}
            </div>

            {/* Email field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2 text-center"
              >
                Email
              </label>
              <InputPlaceholder
                id="email"
                type="email"
                name="email"
                disabled={status === "succeeded"}
                value={values.email || ""}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {renderError("email")}
            </div>

            {/* Password field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2 text-center"
              >
                Password
              </label>
              <InputPlaceholder
                id="password"
                type="password"
                name="password"
                value={values.password || ""}
                disabled={status === "succeeded"}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              {renderError("password")}
            </div>

            <div className="flex items-center justify-center">
              <Button
                type="submit"
                disabled={status === "loading" || status === "succeeded"}
                className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                  status === "succeeded" &&
                  "bg-green-500 text-white hover:bg-green-400"
                }`}
              >
                {(status === "loading" && "Registering...") ||
                status === "succeeded"
                  ? "Success"
                  : "Register"}
              </Button>
            </div>

            {status !== "succeeded" && error?.error && (
              <p className="text-red-500 text-xs italic mt-4 text-center">
                {error.error}
              </p>
            )}
          </form>
          {status !== "succeeded" && (
            <div className="text-center mt-4">
              <p className="text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login-user")}
                  className="text-purple-600 hover:underline focus:outline-none font-bold"
                >
                  Click here to log in
                </button>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegistrationForm;
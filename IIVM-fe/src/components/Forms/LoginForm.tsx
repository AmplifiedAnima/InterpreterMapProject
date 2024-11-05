import React from "react";
import { useFormValidation } from "../../utils/useFormValidation";
import { userLoginSchema } from "../../interfaces/userLoginSchema";
import { UserLoginData } from "../../redux/auth/authTypes";
import { Input as InputPlaceholder } from "./../UI/InputPlaceholder";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface LoginFormProps {
  onSubmit: (data: UserLoginData) => void;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  details: Record<string, string[]>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  status,
  error,
  details,
}) => {
  const { values, errors, handleChange, handleSubmit } =
    useFormValidation<UserLoginData>(userLoginSchema);

  const navigate = useNavigate();

  const renderError = (field: keyof UserLoginData) => {
    const error = errors?.[field];
    return error ? (
      <div className="bg-[#ffe1e6] rounded-md mt-1 flex justify-center items-center p-2">
        <p className="text-red-600 text-sm font-medium">{error}</p>
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              />
              {renderError("username")}
              {details.username && (
                <p className="text-red-500 text-xs italic mt-1">
                  {details.username[0]}
                </p>
              )}
            </div>
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
                disabled={status === "succeeded"}
                value={values.password || ""}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              {renderError("password")}
              {details.password && (
                <p className="text-red-500 text-xs italic mt-1">
                  {details.password[0]}
                </p>
              )}
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
                {(status === "loading" && "Logging in...") ||
                status === "succeeded"
                  ? "Success"
                  : "Login"}
              </Button>
            </div>
            {status !== "succeeded" && error && (
              <p className="text-red-500 text-xs italic mt-4 text-center">
                {error}
              </p>
            )}
            {status !== "succeeded" && details.non_field_errors && (
              <p className="text-red-500 text-xs italic mt-4 text-center">
                {details.non_field_errors[0]}
              </p>
            )}
          </form>
          {status !== "succeeded" && (
            <div className="text-center mt-4">
              <p className="text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/create-user-profile")}
                  className="text-purple-600 hover:underline focus:outline-none font-bold"
                >
                  Click here to sign up
                </button>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginForm;
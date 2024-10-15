import React, { useEffect } from "react";
import { useFormValidation } from "../../utils/useFormValidation";
import { userRegistrationSchema } from "../../interfaces/userRegistrationSchema";
import { UserRegistrationData } from "../../redux/auth/authTypes";
import { Input as InputPlaceholder } from "./../UI/InputPlaceholder";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";

interface RegistrationFormProps {
  onSubmit: (data: UserRegistrationData) => void;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: {
    error: string;
    details: Record<string, string[]>;
  } | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, status, error }) => {
  const { values, errors: validationErrors,resetErrors, handleChange, handleSubmit } =
    useFormValidation<UserRegistrationData>(userRegistrationSchema, { user_type: "interpreter" });
    
  const navigate = useNavigate();
    
  useEffect(() => {
    resetErrors();
  }, []);

  return (
    <div className="w-full max-w-xs mx-auto my-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Username field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2 text-center">
            Username 
          </label>
          <InputPlaceholder
            id="username"
            type="text"
            name="username"
            value={values.username || ""}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {validationErrors?.username && (
            <p className="text-red-500 text-xs italic mt-1">{validationErrors.username}</p>
          )}
          {error?.details?.username && (
            <p className="text-red-500 text-xs italic mt-1">{error.details.username[0]}</p>
          )}
        </div>

        {/* Email field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 text-center">
            Email 
          </label>
          <InputPlaceholder
            id="email"
            type="email"
            name="email"
            value={values.email || ""}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {validationErrors?.email && (
            <p className="text-red-500 text-xs italic mt-1">{validationErrors.email}</p>
          )}
          {error?.details?.email && (
            <p className="text-red-500 text-xs italic mt-1">{error.details.email[0]}</p>
          )}
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 text-center">
            Password 
          </label>
          <InputPlaceholder
            id="password"
            type="password"
            name="password"
            value={values.password || ""}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
          {validationErrors?.password && (
            <p className="text-red-500 text-xs italic">{validationErrors.password}</p>
          )}
          {error?.details?.password && (
            <p className="text-red-500 text-xs italic mt-1">{error.details.password[0]}</p>
          )}
        </div>
        
        <div className="flex items-center justify-center">
          <Button
            type="submit"
            disabled={status === "loading"}
            className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {status === "loading" ? "Registering..." : "Register"}
          </Button>
        </div>
        
        {error?.error && <p className="text-red-500 text-xs italic mt-4 text-center">{error.error}</p>}
      </form>
      
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
    </div>
  );
};

export default RegistrationForm;
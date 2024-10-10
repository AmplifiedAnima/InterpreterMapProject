import React from "react";
import { useFormValidation } from "../../utils/useFormValidation";
import { userLoginSchema } from "../../interfaces/userLoginSchema";
import { UserLoginData } from "../../redux/auth/authTypes";
import { Input as InputPlaceholder } from "./../UI/InputPlaceholder";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSubmit: (data: UserLoginData) => void;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, status, error }) => {
  const { values, errors, handleChange, handleSubmit } =
    useFormValidation<UserLoginData>(userLoginSchema);
    
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-xs mx-auto my-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
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
          {errors?.username && (
            <p className="text-red-500 text-xs italic mt-1">{errors.username}</p>
          )}
        </div>
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
          {errors?.password && (
            <p className="text-red-500 text-xs italic">{errors.password}</p>
          )}
        </div>
        
        <div className="flex items-center justify-center">
          <Button
            type="submit"
            disabled={status === "loading"}
            className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </Button>
        </div>
        
        {error && <p className="text-red-500 text-xs italic mt-4 text-center">{error}</p>}
      </form>
      
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
    </div>
  );
};

export default LoginForm;
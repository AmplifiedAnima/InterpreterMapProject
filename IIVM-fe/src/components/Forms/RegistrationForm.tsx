// components/RegistrationForm.tsx
import React from "react";
import { useFormValidation } from "../../utils/useFormValidation";
import { userRegistrationSchema } from "../../interfaces/userRegistrationSchema";
import { UserRegistrationData } from "../../redux/auth/authTypes";
import { Input as InputPlaceholder } from "./../UI/InputPlaceholder";
import { Button } from "../UI/Button";
interface Props {
  onSubmit: (data: UserRegistrationData) => void;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const RegistrationForm: React.FC<Props> = ({ onSubmit, status, error }) => {
  const { values, errors, handleChange, handleSubmit } =
    useFormValidation<UserRegistrationData>(userRegistrationSchema);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[100%] grid justify-center"
    >
      <div className="py-2">
        <label htmlFor="username" className="flex justify-center my-2">
          Username:
        </label>
        <InputPlaceholder
          id="username"
          type="text"
          name="username"
          value={values.username || ""}
          onChange={handleChange}
        />
        {errors?.username && (
          <p className="text-red-600 flex justify-center ">{errors.username}</p>
        )}
      </div>

      <div className="py-2">
        <label htmlFor="email" className="flex justify-center  my-2">
          Email:
        </label>
        <InputPlaceholder
          id="email"
          type="email"
          name="email"
          value={values.email || ""}
          onChange={handleChange}
        />
        {errors?.email && (
          <p className="text-red-600 flex justify-center ">{errors.email}</p>
        )}
      </div>

      <div className="py-2">
        <label htmlFor="password " className="flex justify-center  my-2">
          Password:
        </label>
        <InputPlaceholder
          id="password"
          type="password"
          name="password"
          value={values.password || ""}
          onChange={handleChange}
        />
        {errors?.password && (
          <p className="text-red-600 flex justify-center">{errors.password}</p>
        )}
      </div>

      <Button type="submit" disabled={status === "loading"} className=" my-8">
        {status === "loading" ? "Registering..." : "Register"}
      </Button>

      {error && <p>{error}</p>}
    </form>
  );
};

export default RegistrationForm;

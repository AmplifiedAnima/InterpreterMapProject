import { useState } from "react";
import { ZodSchema } from "zod";
export const useFormValidation = <T>(schema: ZodSchema<T>, initialValues: Partial<T> = {}) => {
  const [values, setValues] = useState<T>({ ...initialValues } as T);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>> | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validate = () => {
    const result = schema.safeParse(values);
    if (!result.success) {
      const errorMessages = result.error.formErrors.fieldErrors;
      setErrors(errorMessages as Partial<Record<keyof T, string>>);
      return false;
    }
    setErrors(null);
    return true;
  };

  const handleSubmit = (callback: (values: T) => void) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      callback(values);
    }
  };



  return { values, errors, handleChange, handleSubmit };
};
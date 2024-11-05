import { z } from "zod";

export const userRegistrationSchema = z.object({
  username: z.string().min(1, "Username is required").refine(val => !val.includes('@'), {
    message: "Username should not be an email address"
  }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  user_type: z.enum(['interpreter'])
});

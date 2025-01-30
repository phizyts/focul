import { z } from "zod";

export const SignUpSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Please fill in all required fields" })
		.email({ message: "Invalid email address" }),
	name: z
		.string()
		.min(1, { message: "Please fill in all required fields" })
		.min(3, { message: "Name must be at least 3 characters long" }),
	password: z
		.string()
		.min(1, { message: "Please fill in all required fields" })
		.min(8, { message: "Password must be at least 8 characters long" }),
});

export const LoginSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Please fill in all required fields" })
		.email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(1, { message: "Please fill in all required fields" }),
});

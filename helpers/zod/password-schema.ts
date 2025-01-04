import { z } from "zod";

export const PasswordSchema = z.object({
	newPassword: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" })
		.max(30, { message: "Password must be at most 30 characters long" }),
});

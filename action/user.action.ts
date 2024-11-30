import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { Lang } from "@prisma/client";
import { headers } from "next/headers";
import { uploadImage } from "./server.action";
import { PasswordSchema } from "@/helpers/zod/password-schema";

export const getUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session?.user;
};

export const setPassword = async (newPassword: string) => {
	try {
		const validatedPassword = PasswordSchema.parse({ newPassword });

		const response = await fetch('/api/user/password', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(validatedPassword),
		});

		if (!response.ok) {
			throw new Error('Failed to set password');
		}

		return response.json();
	} catch (error) {
		console.error("Error setting password:", error);
		throw error;
	}
};

export const updatePassword = async (currentPassword: string, newPassword: string) => {
	try {
		const response = await fetch('/api/user/password/update', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ currentPassword, newPassword }),
		});

		if (!response.ok) {
			throw new Error('Failed to update password');
		}

		return response.json();
	} catch (error) {
		console.error("Error updating password:", error);
		throw error;
	}
};

export const getLinkedAccounts = async () => {
	try {
		const accounts = await auth.api.listUserAccounts({
			headers: await headers(),
		});

		if (!accounts) return [];
		return accounts.map(account => account.provider);
	} catch (error) {
		console.error("Error fetching linked accounts:", error);
		return [];
	}
};

export const updateProfilePicture = async (imagePath: string) => {
	const user = await getUser();
	const imageUrl = await uploadImage(imagePath);
	await prisma.user.update({
		where: { id: user?.id },
		data: {
			image: imageUrl,
		},
	});
	return;
};

export const onBoardUser = async (image: string, language: Lang) => {
	const user = await getUser();
	await prisma.user.update({
		where: { id: user?.id },
		data: {
			image,
			language: language.toLowerCase() as Lang,
			onboarded: true,
		},
	});
	return;
};

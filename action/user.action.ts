import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { Lang } from "@prisma/client";
import { headers } from "next/headers";

export const getUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session?.user;
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

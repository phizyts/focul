"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { linkedAccounts } from "@prisma/client";
import { headers } from "next/headers";

export const getUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) return { success: false, message: "Unauthorized" };
	return {
		success: true,
		message: "User fetched successfully",
		data: session.user,
	};
};

export const setPassword = async (newPassword: string) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (user.passwordSet)
		return { success: false, message: "Password already set" };
	try {
		await auth.api.setPassword({
			headers: await headers(),
			body: { newPassword },
		});

		await prisma.user.update({
			where: { id: user.id },
			data: {
				passwordSet: true,
			},
		});

		return { success: true, message: "Password set successfully" };
	} catch (error) {
		console.error("Error setting password:", error);
		return { success: false, message: "Error setting password" };
	}
};

export const getLinkedAccounts = async () => {
	const { success } = await getUser();
	if (!success) return { success: false, message: "Unauthorized" };
	try {
		const accounts = await auth.api.listUserAccounts({
			headers: await headers(),
		});

		if (!accounts)
			return {
				success: true,
				message: "Accounts fetched successfully",
				data: [],
			};
		return {
			success: true,
			message: "Accounts fetched successfully",
			data: accounts.map(account => account.provider),
		};
	} catch (error) {
		console.error("Error fetching linked accounts:", error);
		return { success: false, message: "Error fetching linked accounts" };
	}
};

export const getNotifications = async () => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	try {
		const notifications = await prisma.notification.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return {
			success: true,
			message: "Notifications fetched successfully",
			data: notifications,
		};
	} catch (error) {
		console.error("Error fetching notifications:", error);
		return { success: false, message: "Error fetching notifications" };
	}
};

export const onBoardUser = async () => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	try {
		await prisma.user.update({
			where: { id: user.id },
			data: {
				onboarded: true,
			},
		});
		return {
			success: true,
			message: "User onboarded successfully",
		};
	} catch (error) {
		console.error("Error onboarding user:", error);
		return { success: false, message: "Error onboarding user" };
	}
};

export const fetchAndUpdateLinkedAccounts = async () => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	try {
		const { data: accounts } = await getLinkedAccounts();
		const linkedAccounts = accounts
			?.filter(
				(account: any) =>
					account === "google" || account === "github" || account === "discord",
			)
			.map(
				(account: string) => account.charAt(0).toUpperCase() + account.slice(1),
			);

		await prisma.user.update({
			where: { id: user.id },
			data: {
				linkedAccounts: {
					set: linkedAccounts as linkedAccounts[],
				},
			},
		});

		return {
			success: true,
			message: "Linked accounts fetched and updated successfully",
		};
	} catch (error) {
		console.error("Error fetching and updating linked accounts:", error);
		return {
			success: false,
			message: "Error fetching and updating linked accounts",
		};
	}
};

export const getAllGradingPolicy = async (withAGPId = false) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	try {
		const foundPolicies = await prisma.user.findUnique({
			where: { id: user.id },
			select: {
				agpId: withAGPId,
				gradingPolicy: {
					include: {
						assignmentTypes: true,
					},
				},
			},
		});
		if (foundPolicies?.gradingPolicy.length === 0)
			return {
				success: true,
				message: "No grading policies found",
				data: null,
			};
		return {
			success: true,
			message: "Grading policies fetched successfully",
			data: foundPolicies,
		};
	} catch (error) {
		console.error("Error fetching grading policies:", error);
		return { success: false, message: "Error fetching grading policies" };
	}
};

import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
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

export const getNotifications = async (user: any) => {
	try {
		if (!user) {
			return [];
		}
		const notifications = await prisma.notification.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return notifications;
	} catch (error) {
		return [];
	}
};

export const onBoardUser = async (userId: string) => {
	if (!userId) return;
	await prisma.user.update({
		where: { id: userId },
		data: {
			onboarded: true,
		},
	});
	return;
};

export const getAllGradingPolicy = async (
	userId: string,
	withAGPId = false,
) => {
	if (!userId) return;
	const foundPolicies = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			agpId: withAGPId,
			gradingPolicy: {
				include: {
					assignmentTypes: true,
				},
			},
		},
	});
	if (foundPolicies?.gradingPolicy.length === 0) return null;
	return foundPolicies;
};

export const initializeGradingPolicy = async (userId: string) => {
	if (!userId) return;
	const [hstatGradingPolicy, customGradingPolicy] = await Promise.all([
		prisma.gradingPolicy.create({
			data: {
				userId,
				name: "HSTAT",
				scale: {
					A: { max: 100, min: 90 },
					B: { max: 89, min: 80 },
					C: { max: 79, min: 70 },
					D: { max: 69, min: 60 },
					F: { max: 59, min: 0 },
				},
			},
		}),
		prisma.gradingPolicy.create({
			data: {
				userId,
				name: "Custom",
				scale: {
					A: { max: 100, min: 90 },
					B: { max: 89, min: 80 },
					C: { max: 79, min: 70 },
					D: { max: 69, min: 60 },
					F: { max: 59, min: 0 },
				},
			},
		}),
	]);
	await prisma.assignmentType.createMany({
		data: [
			{
				name: "Homework",
				gradingPolicyId: hstatGradingPolicy.id,
				weight: 20,
			},
			{
				name: "Classwork",
				gradingPolicyId: hstatGradingPolicy.id,
				weight: 30,
			},
			{
				name: "Summative Assessment",
				gradingPolicyId: hstatGradingPolicy.id,
				weight: 50,
			},
		],
	});
	await prisma.user.update({
		where: { id: userId },
		data: {
			agpId: customGradingPolicy.id,
		},
	});
	return;
};

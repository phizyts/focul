"use server";
import { prisma } from "@/prisma";
import { Tasks, TaskStatus } from "@prisma/client";

export async function getAllTasks(userId: string, status?: TaskStatus) {
	if (!userId) return;
	try {
		const tasks = await prisma.tasks.findMany({
			where: {
				userId,
				status,
			},
		});
		return tasks;
	} catch (error) {
		console.error("Error fetching tasks:", error);
		return [];
	}
}

export async function getTask(taskId: string) {
	try {
		const task = await prisma.tasks.findUnique({
			where: {
				id: taskId,
			},
		});
		return task;
	} catch (error) {
		console.error("Error fetching task:", error);
		return null;
	}
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
	try {
		await prisma.tasks.update({
			where: {
				id: taskId,
			},
			data: {
				status,
			},
		});
		return true;
	} catch (error) {
		console.error("Error updating task status:", error);
		return false;
	}
}

export async function createTask(
	title: string,
	dueDate: Date,
	userId: string,
	description?: string,
) {
	try {
		await prisma.tasks.create({
			data: {
				title,
				description,
				dueDate,
				userId,
			},
		});
		return true;
	} catch (error) {
		console.error("Error creating task:", error);
		return false;
	}
}

export async function updateTask(
	taskId: string,
	title: string,
	dueDate: Date,
	userId: string,
	description?: string,
) {
	try {
		await prisma.tasks.update({
			where: {
				id: taskId,
			},
			data: {
				title,
				description,
				dueDate,
				userId,
			},
		});
		return true;
	} catch (error) {
		console.error("Error updating task:", error);
		return false;
	}
}

export const deleteTask = async (taskId: string) => {
	"use server";
	try {
		await prisma.tasks.delete({
			where: {
				id: taskId,
			},
		});
		return true;
	} catch (error) {
		console.error("Prisma error:", error);
		return false;
	}
};

export const checkOverdueTasks = async () => {
	try {
		const tasks = await prisma.tasks.findMany({
			where: {
				AND: [
					{
						dueDate: {
							lte: new Date(),
						},
					},
					{
						status: "Pending",
					},
				],
			},
		});

		return tasks;
	} catch (error) {
		console.error("Prisma error:", error);
		return null;
	}
};

export const updateAllTaskStatus = async (
	tasks: Tasks[],
	status: TaskStatus,
) => {
	try {
		for (const task of tasks) {
			await prisma.tasks.update({
				where: { id: task.id },
				data: { status },
			});
		}
		return true;
	} catch (error) {
		console.error("Prisma error:", error);
		return false;
	}
};

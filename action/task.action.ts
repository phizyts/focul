"use server";
import { prisma } from "@/prisma";
import { Tasks, TaskStatus } from "@prisma/client";
import { getUser } from "./user.action";

export async function getAllTasks(status?: TaskStatus) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	try {
		const tasks = await prisma.tasks.findMany({
			where: {
				userId: user.id,
				status,
			},
		});
		return {
			success: true,
			message: "Tasks fetched successfully",
			data: tasks,
		};
	} catch (error) {
		console.error("Error fetching tasks:", error);
		return { success: false, message: "Error fetching tasks" };
	}
}

export async function getTask(taskId: string) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!taskId) return { success: false, message: "Missing required fields" };
	try {
		const task = await prisma.tasks.findUnique({
			where: {
				id: taskId,
			},
		});
		return {
			success: true,
			message: "Task fetched successfully",
			data: task,
		};
	} catch (error) {
		console.error("Error fetching task:", error);
		return { success: false, message: "Error fetching task" };
	}
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!taskId || !status)
		return { success: false, message: "Missing required fields" };
	try {
		const task = await prisma.tasks.update({
			where: {
				id: taskId,
			},
			data: {
				status,
			},
		});
		return {
			success: true,
			message: "Task status updated successfully",
			data: task,
		};
	} catch (error) {
		console.error("Error updating task status:", error);
		return { success: false, message: "Error updating task status" };
	}
}

export async function createTask(
	title: string,
	dueDate: Date,
	description?: string,
) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!title || !dueDate)
		return { success: false, message: "Missing required fields" };
	try {
		const task = await prisma.tasks.create({
			data: {
				title,
				description,
				dueDate,
				userId: user.id,
			},
		});
		return {
			success: true,
			message: "Task created successfully",
			data: task,
		};
	} catch (error) {
		console.error("Error creating task:", error);
		return { success: false, message: "Error creating task" };
	}
}

export async function updateTask(
	taskId: string,
	title: string,
	dueDate: Date,
	description?: string,
) {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!taskId || !title || !dueDate)
		return { success: false, message: "Missing required fields" };
	try {
		const task = await prisma.tasks.update({
			where: {
				id: taskId,
			},
			data: {
				title,
				description,
				dueDate,
				userId: user.id,
			},
		});
		return {
			success: true,
			message: "Task updated successfully",
			data: task,
		};
	} catch (error) {
		console.error("Error updating task:", error);
		return { success: false, message: "Error updating task" };
	}
}

export const deleteTask = async (taskId: string) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (!taskId) return { success: false, message: "Missing required fields" };
	try {
		const task = await prisma.tasks.delete({
			where: {
				id: taskId,
			},
		});
		return {
			success: true,
			message: "Task deleted successfully",
			data: task,
		};
	} catch (error) {
		console.error("Prisma error:", error);
		return { success: false, message: "Error deleting task" };
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

		return {
			success: true,
			message: "Tasks fetched successfully",
			data: tasks,
		};
	} catch (error) {
		console.error("Prisma error:", error);
		return { success: false, message: "Error fetching tasks" };
	}
};

export const updateAllTaskStatus = async (
	tasks: Tasks[],
	status: TaskStatus,
) => {
	if (!tasks || !status) return { success: false, message: "Missing fields" };
	try {
		for (const task of tasks) {
			await prisma.tasks.update({
				where: { id: task.id },
				data: { status },
			});
		}
		return {
			success: true,
			message: "Task status updated successfully",
		};
	} catch (error) {
		console.error("Prisma error:", error);
		return { success: false, message: "Error updating task status" };
	}
};

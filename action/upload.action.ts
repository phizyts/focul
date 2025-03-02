"use server";

import { v2 as cloudinary } from "cloudinary";
import { getUser } from "./user.action";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

export const upload = async (file: File) => {
	const { success } = await getUser();
	if (!success) return { success: false, message: "Unauthorized" };
	if (!file) {
		return {
			success: false,
			message: "No file uploaded",
		};
	}
	try {
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

		const result = await cloudinary.uploader.upload(base64String, {
			use_filename: true,
			unique_filename: true,
			overwrite: true,
			transformation: [{ crop: "fill", gravity: "face" }, { radius: "max" }],
		});

		return {
			success: true,
			message: "Image uploaded successfully",
			data: result,
		};
	} catch (error) {
		console.error("Failed to upload image:", error);
		return {
			success: false,
			message: "Failed to upload image to Cloudinary",
		};
	}
};

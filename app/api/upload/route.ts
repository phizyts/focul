import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json(
				{ message: "No file uploaded" },
				{ status: 400 },
			);
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

		const result = await cloudinary.uploader.upload(base64String, {
			use_filename: true,
			unique_filename: true,
			overwrite: true,
			transformation: [{ crop: "fill", gravity: "face" }, { radius: "max" }],
		});

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("Failed to upload image:", error);
		return NextResponse.json(
			{ message: "Failed to upload image to Cloudinary" },
			{ status: 500 },
		);
	}
}

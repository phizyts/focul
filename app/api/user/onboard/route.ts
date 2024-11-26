import { createCourse } from '@/action/course.action';
import { uploadImage } from '@/action/server.action';
import { getUser, onBoardUser } from '@/action/user.action';
import { CourseType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { image, language, courses } = await req.json();
		const user = await getUser();

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		if (user.onboarded) {
			return NextResponse.json(
				{ error: 'User already onboarded' },
				{ status: 400 },
			);
		}

		const imageUrl = await uploadImage(image);

		await onBoardUser(imageUrl, language);

		await Promise.all(
			courses.map((course: { name: string; type: CourseType }) =>
				createCourse(course.name, course.type),
			),
		);

		return NextResponse.json(
			{ message: 'Onboarding complete' },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error during onboarding:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}

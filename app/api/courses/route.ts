import { createCourse } from '@/action/course.action';
import { getUser } from '@/action/user.action';
import { CourseType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { name } = await req.json();
	const user = await getUser();
	const userId = user?.id;

	if (!userId) {
		return NextResponse.json(
			{ error: 'User not authenticated' },
			{ status: 401 },
		);
	}

	try {
		createCourse(name, userId as CourseType);

		return NextResponse.json(
			{ message: 'Course created successfully' },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error creating course:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

import { auth } from '@/lib/auth'
import { prisma } from '@/prisma'
import { Lang } from '@prisma/client'
import { headers } from 'next/headers'
import { uploadImage } from './server.action'

export const getUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	return session?.user
}

export const updateProfilePicture = async (imagePath: string) => {
	const user = await getUser()
	const imageUrl = await uploadImage(imagePath)
	await prisma.user.update({
		where: { id: user?.id },
		data: {
			image: imageUrl,
		},
	})
	return
}

export const onBoardUser = async (image: string, language: Lang) => {
	const user = await getUser()
	await prisma.user.update({
		where: { id: user?.id },
		data: {
			image,
			language: language.toLowerCase() as Lang,
			onboarded: true,
		},
	})
	return
}

'use client';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import CourseModal from './_components/CourseModal';
import { AddCourseForm } from './_components/AddCourseForm';
import { EditCourseForm } from './_components/EditCourseForm';
import { uploadImage } from '@/action/server.action';
import { useRouter } from 'next/navigation';

interface Course {
	name: string;
	type: string;
}

interface Props {
	setParentLoading: (loading: boolean) => void;
}

const OnboardingForm = ({ setParentLoading }: Props) => {
	const router = useRouter();
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedLanguage, setSelectedLanguage] = useState('English');
	const [url, setUrl] = useState('/uploadpfp.png');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

	const handleAddCourse = (newCourse: Course) => {
		setCourses([...courses, newCourse]);
	};

	const handleRemoveAll = () => {
		setCourses([]);
	};

	const handleCourseClick = (course: Course) => {
		setSelectedCourse(course);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setSelectedCourse(null);
		setIsModalOpen(false);
	};

	const completeOnBoard = async () => {
		setParentLoading(true);
		try {
			let imageUrl = url;
			if (selectedFile) {
				imageUrl = await uploadImage(selectedFile);
			}
			await fetch('/api/user/onboard', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					image: imageUrl,
					language: selectedLanguage.toLowerCase(),
					courses: courses.map(course => ({
						name: course.name,
						type: course.type,
					})),
				}),
			});
			router.push('/dashboard');
			setParentLoading(false);
		} catch (error) {
			setParentLoading(false);
			console.error('Error during onboarding:', error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];
		if (file) {
			setSelectedFile(file);
			const objectUrl = URL.createObjectURL(file);
			setUrl(objectUrl);
		}
	};

	useEffect(() => {
		const getUserImage = async () => {
			const session = await authClient.getSession();
			let imageUrl = session.data?.user?.image ?? '';
			if (imageUrl !== '') {
				if (imageUrl.includes('=s96-c')) {
					imageUrl = imageUrl.replace('=s96-c', '');
				}
				return imageUrl;
			}
			return null;
		};

		getUserImage().then(userImage => {
			if (userImage) {
				setUrl(userImage);
			}
		});
	}, []);

	return (
		<>
			<div className="w-full flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-8 md:mt-5 max-w-[902px]">
				<div className="w-full px-5 md:pr-0">
					<div className="flex flex-col items-center gap-8 mt-5 md:mt-0 border-border border rounded-[10px] w-full p-6">
						<div className="flex items-center justify-between w-full">
							<h2>Upload Profile Picture</h2>
							<h3 className="text-muted text-xs">Optional*</h3>
						</div>
						<div className="flex flex-col items-center w-full">
							<Image
								src={url}
								alt="Profile"
								width={120}
								height={120}
								className="rounded-full object-cover w-[120px] h-[120px]"
							/>
						</div>
						<label className="cursor-pointer flex gap-2 items-center justify-center py-2 my-2 h-[44px] w-full rounded-[10px] border border-border hover:bg-[#1F2324] duration-200">
							<input type="file" className="hidden" onChange={handleChange} />
							<Image src="/upload.svg" alt="Upload" width={18} height={18} />
							Upload
						</label>
					</div>
				</div>
				<div className="w-full px-5 md:pl-0">
					<div className="flex flex-col gap-2 border-border border rounded-[10px] w-full p-6 h-full">
						<div className="flex items-center justify-between w-full">
							<h2>Add Courses</h2>
							<button
								className="text-muted text-xs flex items-center gap-1"
								onClick={handleRemoveAll}
							>
								<Image
									src="removeall.svg"
									width={12}
									height={12}
									alt="remove all"
								/>{' '}
								Remove All
							</button>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 gap-4 mt-2">
							{courses.map((course, index) => (
								<button
									key={index}
									className="flex gap-2 items-center py-2 px-5 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]"
									onClick={() => handleCourseClick(course)}
								>
									<Image
										src="/courseicon.svg"
										alt="Add"
										width={20}
										height={20}
									/>
									<span className="truncate">{course.name}</span>
								</button>
							))}
							{courses.length < 8 && (
								<button
									className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]"
									onClick={() => setIsModalOpen(true)}
								>
									<Image src="/add.svg" alt="Add" width={20} height={20} />
									<span className="truncate">Add Course</span>
								</button>
							)}
						</div>
					</div>
				</div>
				<div className="w-full px-5 md:pr-0">
					<div className="flex flex-col gap-2 border-border border rounded-[10px] w-full p-6">
						<div className="flex items-center justify-between w-full">
							<h2>Account Security</h2>
							<h3 className="text-muted text-xs flex gap-1">Recommended*</h3>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 gap-4 mt-2">
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<Image
									src="/twofactor.svg"
									alt="twofactor"
									width={20}
									height={20}
								/>
								<span className="truncate">Two-Factor</span>
							</button>
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<Image src="/google.svg" alt="google" width={20} height={20} />
								<span className="truncate">Link Google</span>
							</button>
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<Image src="/github.svg" alt="github" width={20} height={20} />
								<span className="truncate">Link Github</span>
							</button>
							<button className="flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px]">
								<Image src="/phone.svg" alt="phone" width={20} height={20} />
								<span className="truncate">Link Phone</span>
							</button>
						</div>
					</div>
				</div>
				<div className="w-full px-5 md:pl-0">
					<div className="flex flex-col gap-2 border-border border rounded-[10px] w-full p-6">
						<div className="flex items-center justify-between w-full">
							<h2>Preferred Language</h2>
							<h3 className="text-muted text-xs flex gap-1">Optional*</h3>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 gap-4 mt-2">
							{['English', 'Chinese', 'Spanish', 'French'].map(language => (
								<button
									key={language}
									className={`flex gap-2 items-center justify-center py-2 px-3 w-full h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 text-[15px] ${selectedLanguage === language ? 'bg-[#1F2324]' : ''}`}
									onClick={() => setSelectedLanguage(language)}
								>
									<span className="truncate">{language}</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full justify-center py-8 px-16">
				<button
					className="w-[300px] py-2 px-8 h-[44px] rounded-[10px] bg-primary duration-200 mt-2"
					onClick={completeOnBoard}
				>
					Complete
				</button>
			</div>
			{isModalOpen && (
				<CourseModal isOpen={isModalOpen} onClose={closeModal}>
					{selectedCourse ? (
						<EditCourseForm
							course={selectedCourse}
							onSubmit={updatedCourse => {
								if (updatedCourse) {
									setCourses(
										courses.map(c =>
											c.name === selectedCourse.name ? updatedCourse : c,
										),
									);
								} else {
									setCourses(
										courses.filter(c => c.name !== selectedCourse.name),
									);
								}
								closeModal();
							}}
							onClose={closeModal}
						/>
					) : (
						<AddCourseForm onSubmit={handleAddCourse} onClose={closeModal} />
					)}
				</CourseModal>
			)}
		</>
	);
};
export default OnboardingForm;

import { upload } from "@/action/upload.action";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const ProfileSettings = () => {
	const { data: session } = authClient.useSession();
	const [url, setUrl] = useState<string>(
		session?.user?.image || "/uploadpfp.png",
	);
	const [imageFile, setimageFile] = useState<File | null>(null);
	const [name, setName] = useState<string>("");
	const [location, setLocation] = useState<string>("");
	const [aboutMe, setAboutMe] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const MAX_FILE_SIZE = 10 * 1024 * 1024;
	const acceptedTypes = ["image/jpeg", "image/png"];

	const uploadImage = async () => {
		let file = imageFile as File;
		if (file) {
			try {
				const { data: result } = await upload(file);
				if (result) {
					await authClient.updateUser({
						image: result.secure_url,
					});

					return {
						success: true,
						message: "Image uploaded successfully",
						data: result.secure_url,
					};
				} else {
					return {
						success: false,
						message: "Failed to upload image to Cloudinary",
					};
				}
			} catch (err) {
				toast.error("Image failed to upload");
				setUrl("/uploadpfp.png");
				setimageFile(null);
				return {
					success: false,
					message: "Failed to upload image to Cloudinary",
				};
			}
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (!session?.user?.emailVerified) {
				toast.error("Email not verified");
				return;
			}
			setIsLoading(true);
			const updates: {
				name?: string;
				location?: string;
				imageFile?: File;
				aboutMe?: string;
			} = {
				...(name && { name }),
				...(location && { location }),
				...(imageFile && { imageFile }),
				...(aboutMe && { aboutMe }),
			};
			if (Object.keys(updates).length > 0) {
				await authClient.updateUser(updates);
				imageFile && (await uploadImage());
				toast.success("User updated successfully!");
			}
		} catch (error) {
			toast.error("Error updating user");
		} finally {
			setName("");
			setLocation("");
			setAboutMe("");
			setimageFile(null);
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];
		if (file) {
			if (file.size > MAX_FILE_SIZE) {
				toast.error("File size must be less than 10MB");
				e.target.value = "";
				return;
			}
			if (!acceptedTypes.includes(file.type)) {
				toast.error("Only JPG and PNG files are allowed");
				return;
			}
			setimageFile(file);
			const objectUrl = URL.createObjectURL(file);
			setUrl(objectUrl);
		}
	};

	return (
		<div className="h-full flex flex-col relative">
			<h1 className="text-xl font-medium">Profile Settings</h1>
			<div className="flex flex-1 flex-col">
				<div className="flex flex-col xs:flex-row justify-between xs:items-center">
					{session === null || session === undefined ? (
						<div className="flex items-center gap-4 mt-8">
							<div className="w-[98px] h-[98px] rounded-full bg-gray-700 animate-pulse"></div>
							<div className="flex flex-col gap-2">
								<div className="h-[20px] w-24 bg-gray-700 rounded animate-pulse"></div>
								<div className="h-[20px] w-44 bg-gray-700 rounded animate-pulse"></div>
								<div className="h-[20px] w-36 bg-gray-700 rounded animate-pulse"></div>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center xss:flex-row gap-4 mt-4">
							<label className="relative flex items-center justify-center rounded-full w-[98px] h-[98px] cursor-pointer group">
								<Image
									src={url}
									alt="Profile"
									width={98}
									height={98}
									className="object-cover xss:w-[90px] xss:h-[90px] xs:w-[98px] xs:h-[98px] w-[98px] h-[98px] sm:w-[98px] sm:h-[98px] rounded-full transition-all duration-200 group-hover:brightness-75"
								/>
								<input
									type="file"
									name="file"
									disabled={!session.user.emailVerified}
									onChange={handleChange}
									className="hidden"
								/>
								<i className="ri-upload-2-fill ri-xl absolute text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
							</label>
							<div className="flex flex-col items-center xss:items-start gap-1">
								<h3 className="font-medium">Profile Picture</h3>
								<p className="text-muted text-xs">PNG, JEPG under 10MB</p>
							</div>
						</div>
					)}
					<label className="h-[35px] flex gap-2 py-2 px-4 rounded-[8px] xs:w-fit w-full justify-center items-center duration-200 text-primary cursor-pointer border hover:bg-[#F5F5F5] border-border text-sm mt-2">
						<input
							type="file"
							name="file"
							className="hidden"
							onChange={handleChange}
							disabled={!session?.user.emailVerified}
						/>
						<i className="ri-upload-2-fill"></i>
						Upload
					</label>
				</div>
				<form
					className="flex flex-col gap-3 mt-5 flex-grow"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col gap-2">
						<label htmlFor="name" className="w-fit">
							Name
						</label>
						<input
							type="text"
							name="name"
							id="name"
							onChange={e => setName(e.target.value)}
							value={name}
							placeholder={name || session?.user?.name || "Enter Name"}
							className="bg-transparent w-full py-2 px-4 h-[35px] text-sm border rounded-[8px] border-border disabled:cursor-not-allowed"
							disabled={!session?.user.emailVerified}
						/>
					</div>
					<div className="w-full flex flex-col gap-2">
						<label htmlFor="email" className="w-fit">
							Email
						</label>
						<input
							type="text"
							name="email"
							id="email"
							placeholder={session?.user?.email || "Enter Email"}
							className="bg-[#F5F5F5] w-full py-2 px-4 h-[35px] text-sm border rounded-[8px] border-border disabled:cursor-not-allowed"
							disabled={true}
						/>
						<p className="text-muted text-xs font-light">
							Email cannot be changed
						</p>
					</div>
					<div className="w-full flex flex-col gap-2">
						<label htmlFor="location" className="w-fit">
							Location
						</label>
						<input
							type="text"
							name="location"
							id="location"
							placeholder={session?.user?.location || "Enter Location"}
							className="bg-transparent w-full py-2 px-4 h-[35px] text-sm border rounded-[8px] border-border disabled:cursor-not-allowed"
							onChange={e => setLocation(e.target.value)}
							value={location}
							disabled={!session?.user.emailVerified}
						/>
					</div>
					<div className="w-full flex flex-col gap-2 flex-grow">
						<label htmlFor="about" className="w-fit">
							About Me
						</label>
						<textarea
							name="about"
							id="about"
							placeholder={session?.user?.aboutMe || "Enter About Me"}
							className="bg-transparent w-full py-2 px-4 flex-grow text-sm border rounded-[8px] border-border resize-none overflow-auto disabled:cursor-not-allowed"
							onChange={e => setAboutMe(e.target.value)}
							value={aboutMe}
							disabled={!session?.user.emailVerified}
						/>
					</div>
					{(name !== "" || location !== "" || aboutMe !== "" || imageFile) && (
						<PrimaryButton
							text="Save"
							type="submit"
							extraClasses="absolute !w-fit top-0 right-0 !m-0"
							extraAttributes={{
								disabled: isLoading,
							}}
							isLoading={isLoading}
						/>
					)}
				</form>
			</div>
		</div>
	);
};
export default ProfileSettings;

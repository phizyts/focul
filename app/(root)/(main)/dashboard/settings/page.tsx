"use client";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Settings() {
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(false);
	const [url, setUrl] = useState("/uploadpfp.png");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { data: session, isPending } = authClient.useSession();

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
			let imageUrl = session.data?.user?.image ?? "";
			if (imageUrl !== "") {
				if (imageUrl.includes("=s96-c")) {
					imageUrl = imageUrl.replace("=s96-c", "");
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
		<div className="flex flex-col gap-8">
			<div className="flex justify-between items-center w-full rounded-lg border border-border p-6">
				<div>
					<div>
						<h2 className="flex gap-2 items-center text-xl font-medium mb-2">
							<i className="ri-settings-4-fill ri-md"></i>Account
						</h2>
						<p className="text-muted">
							Manage your profile details and contact information.
						</p>
					</div>
					{isPending || !session ? (
						<div className="flex items-center gap-4 mt-8">
							<div className="w-[120px] h-[120px] rounded-full bg-gray-700 animate-pulse"></div>
							<div className="flex flex-col gap-1">
								<div className="h-[20px] w-24 bg-gray-700 rounded animate-pulse"></div>
								<div className="h-[20px] w-44 bg-gray-700 rounded animate-pulse"></div>
								<div className="h-[20px] w-36 bg-gray-700 rounded animate-pulse"></div>
							</div>
						</div>
					) : (
						<div className="flex items-center gap-4 mt-8">
							<Image
								src={url}
								alt="Profile"
								width={120}
								height={120}
								className="rounded-full object-cover w-[120px] h-[120px]"
							/>
							<div>
								<h3 className="text-xl font-medium">{session?.user?.name}</h3>
								<p className="text-muted">{session?.user?.email}</p>
								<p className="text-muted text-sm">{session?.user?.location}</p>
							</div>
						</div>
					)}
				</div>
				<button className="cursor-pointer text-muted font-medium flex gap-2 items-center justify-center py-2 my-2 h-[44px] px-6 rounded-[10px] border border-border hover:bg-[#1F2324] duration-200">
					<i className="ri-pencil-fill ri-lg"></i>
					Edit
				</button>
			</div>
			<div className="flex w-full flex-col rounded-lg border border-border p-6">
				<div>
					<h2 className="flex gap-2 items-center text-xl font-medium mb-2">
						<i className="ri-shield-fill ri-md"></i>Privacy & Security
					</h2>
					<p className="text-muted">
						Control your security settings and connected accounts.
					</p>
				</div>
			</div>
			<div className="flex w-full flex-col rounded-lg border border-border p-6">
				<div>
					<h2 className="flex gap-2 items-center text-xl font-medium mb-2">
						<i className="ri-brush-4-fill ri-md"></i>Preferences
					</h2>
					<p className="text-muted">
						Adjust your language and personal settings.
					</p>
				</div>
			</div>
		</div>
	);
}

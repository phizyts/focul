"use client";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Session } from "better-auth";

const EditAccountModal = dynamic(() =>
	import("@/components/ui/modal/modals/EditAccountModal").then(
		mod => mod.default,
	),
);

const PrivacySecurityModal = dynamic(() =>
	import("@/components/ui/modal/modals/PrivacySecurityModal").then(
		mod => mod.default,
	),
);

const PreferencesModal = dynamic(() =>
	import("@/components/ui/modal/modals/PreferencesModal").then(
		mod => mod.default,
	),
);

export default function Settings() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { data: session } = authClient.useSession() as {
		data: (Session & { user?: any; expires: string }) | null;
	};
	const [url, setUrl] = useState(
		session?.user?.image
			? session.user.image.includes("=s96-c")
				? session.user.image.replace("=s96-c", "")
				: session.user.image
			: "/uploadpfp.png",
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];
		if (file) {
			setSelectedFile(file);
			const objectUrl = URL.createObjectURL(file);
			setUrl(objectUrl);
		}
	};

	useEffect(() => {
		if (session?.user?.image) {
			const imageUrl = session.user.image.includes("=s96-c")
				? session.user.image.replace("=s96-c", "")
				: session.user.image;
			setUrl(imageUrl);
		}
	}, [session?.user?.image]);

	const [showEditAccount, setShowEditAccount] = useState(false);
	const [showPrivacySecurity, setShowPrivacySecurity] = useState(false);
	const [showPreferences, setShowPreferences] = useState(false);

	return (
		<>
			<div className="flex flex-col gap-8 overflow-y-auto h-full">
				<div className="flex flex-col sm:flex-row justify-between sm:items-center w-full rounded-lg border border-border p-6">
					<div>
						<div>
							<h2 className="flex gap-2 items-center text-xl font-medium mb-2">
								<i className="ri-settings-4-fill ri-md"></i>Account
							</h2>
							<p className="text-muted">
								Manage your profile details and contact information.
							</p>
						</div>
						{session === null || session === undefined ? (
							<div className="flex items-center gap-4 mt-8">
								<div className="w-[120px] h-[120px] rounded-full bg-gray-700 animate-pulse"></div>
								<div className="flex flex-col gap-2">
									<div className="h-[20px] w-24 bg-gray-700 rounded animate-pulse"></div>
									<div className="h-[20px] w-44 bg-gray-700 rounded animate-pulse"></div>
									<div className="h-[20px] w-36 bg-gray-700 rounded animate-pulse"></div>
								</div>
							</div>
						) : (
							<div className="flex flex-col items-center xss:flex-row gap-4 mt-8">
								<div className="relative flex items-center justify-center rounded-full w-[120px] h-[120px] cursor-pointer group">
									<Image
										src={url}
										alt="Profile"
										width={120}
										height={120}
										className="object-cover xss:w-[100px] xss:h-[100px] xs:w-[120px] xs:h-[120px] w-[120px] h-[120px] sm:w-[120px] sm:h-[120px] rounded-full transition-all duration-200 group-hover:brightness-75"
									/>
									<i className="ri-upload-2-fill ri-xl absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
								</div>
								<div className="flex flex-col items-center xss:items-start gap-1">
									<h3 className="text-xl font-medium">{session?.user?.name}</h3>
									<p className="text-muted">{session?.user?.email}</p>
									<p className="text-muted text-sm">
										{session?.user?.location}
									</p>
								</div>
							</div>
						)}
					</div>
					<button
						onClick={() => setShowEditAccount(true)}
						className="cursor-pointer mt-5 sm:mt-2 text-muted font-medium flex gap-2 items-center justify-center py-2 mb-2 h-[44px] px-6 rounded-[10px] border border-border hover:bg-[#1F2324] duration-200"
					>
						<i className="ri-pencil-fill ri-lg"></i>
						Edit
					</button>
				</div>
				<div className="flex flex-col sm:flex-row justify-between sm:items-center w-full rounded-lg border border-border p-6">
					<div>
						<div>
							<h2 className="flex gap-2 items-center text-xl font-medium mb-2">
								<i className="ri-shield-fill ri-md"></i>Privacy & Security
							</h2>
							<p className="text-muted">
								Control your security settings and connected accounts.
							</p>
						</div>
						{!session || session === null || session === undefined ? (
							<div className="flex flex-col gap-4 mt-5">
								<div className="h-[24px] w-44 bg-gray-700 rounded animate-pulse"></div>
								<div className="h-[24px] w-28 bg-gray-700 rounded animate-pulse"></div>
								<div className="h-[24px] w-72 bg-gray-700 rounded animate-pulse"></div>
								<div className="h-[24px] w-52 bg-gray-700 rounded animate-pulse"></div>
							</div>
						) : (
							<div className="flex flex-col gap-4 mt-5">
								<h4 className="text-muted font-medium">
									Email:{" "}
									<span className="text-white font-normal">
										{session?.user?.emailVerified === true
											? "Verified"
											: "Not Verified"}
									</span>
								</h4>
								<h4 className="text-muted font-medium">
									Password:{" "}
									<span className="text-white font-normal">
										{session?.user?.passwordSet === true ? "Set" : "Not Set"}
									</span>
								</h4>
								<h4 className="text-muted font-medium">
									Two-Factor Authentication:{" "}
									<span className="text-white font-normal">
										{session?.user?.twoFactorEnabled === true
											? "Enabled"
											: "Not Enabled"}
									</span>
								</h4>
								<h4 className="text-muted font-medium">
									Accounts Linked:{" "}
									<span className="text-white font-normal">
										{session?.user?.linkedAccounts?.length > 0
											? session?.user?.linkedAccounts.join(", ")
											: "None"}
									</span>
								</h4>
							</div>
						)}
					</div>
					<button
						onClick={() => setShowPrivacySecurity(true)}
						className="cursor-pointer mt-5 sm:mt-2 text-muted font-medium flex gap-2 items-center justify-center py-2 mb-2 h-[44px] px-6 rounded-[10px] border border-border hover:bg-[#1F2324] duration-200"
					>
						<i className="ri-pencil-fill ri-lg"></i>
						Edit
					</button>
				</div>
				<div className="flex flex-col sm:flex-row justify-between sm:items-center w-full rounded-lg border border-border p-6">
					<div>
						<div>
							<h2 className="flex gap-2 items-center text-xl font-medium mb-2">
								<i className="ri-brush-4-fill ri-md"></i>Preferences
							</h2>
							<p className="text-muted">
								Adjust your language and personal settings.
							</p>
						</div>
						{!session || session === null || session === undefined ? (
							<div className="flex flex-col gap-4 mt-5">
								<div className="h-[24px] w-44 bg-gray-700 rounded animate-pulse"></div>
								<div className="h-[24px] w-28 bg-gray-700 rounded animate-pulse"></div>
								<div className="h-[24px] w-72 bg-gray-700 rounded animate-pulse"></div>
							</div>
						) : (
							<div className="flex flex-col gap-4 mt-5">
								<h4 className="text-muted font-medium">
									Language:{" "}
									<span className="text-white font-normal">
										{session?.user?.language?.charAt(0).toUpperCase() +
											session?.user?.language?.slice(1)}
									</span>
								</h4>
								<h4 className="text-muted font-medium">
									Theme: <span className="text-white font-normal">Dark</span>
								</h4>
								<h4 className="text-muted font-medium">
									Time Zone:{" "}
									<span className="text-white font-normal">
										Eastern Time (UTC-5)
									</span>
								</h4>
							</div>
						)}
					</div>
					<button
						onClick={() => setShowPreferences(true)}
						className="cursor-pointer mt-5 sm:mt-2 text-muted font-medium flex gap-2 items-center justify-center py-2 mb-2 h-[44px] px-6 rounded-[10px] border border-border hover:bg-[#1F2324] duration-200"
					>
						<i className="ri-pencil-fill ri-lg"></i>
						Edit
					</button>
				</div>
			</div>

			<EditAccountModal
				isOpen={showEditAccount}
				onClose={() => setShowEditAccount(false)}
				session={session}
			/>
			<PrivacySecurityModal
				isOpen={showPrivacySecurity}
				onClose={() => setShowPrivacySecurity(false)}
				session={session}
			/>
			<PreferencesModal
				isOpen={showPreferences}
				onClose={() => setShowPreferences(false)}
				session={session}
			/>
		</>
	);
}

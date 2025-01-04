import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useState } from "react";

const SecuritySettings = () => {
	const { data: session } = authClient.useSession();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [show2FAPasswordForm, setShow2FAPasswordForm] = useState(false);
	const [password2FA, setPassword2FA] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleVerifyEmail = async () => {
		setIsLoading(true);
		try {
			if (!session?.user?.emailVerified && session?.user?.email) {
				await authClient.sendVerificationEmail({
					email: session?.user?.email,
				});
			}
		} catch (error) {
			console.error("Error sending verification email:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			return;
		}
		if (!session?.user?.emailVerified) {
			return;
		}

		setIsLoading(true);
		try {
			if (session?.user?.passwordSet) {
				await authClient.changePassword({
					newPassword,
					currentPassword,
					revokeOtherSessions: true,
				});
			} else {
				const response = await fetch("/api/user/setpassword", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ newPassword }),
				});

				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.error || "Failed to set password");
				}
			}
			setShowPasswordForm(false);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			console.error("Failed to change password:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handle2FAPasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		if (!session?.user?.emailVerified) {
			return;
		}
		try {
			if (session?.user?.twoFactorEnabled) {
				await authClient.twoFactor.disable({
					password: password2FA,
				});
			} else {
				await authClient.twoFactor.enable({
					password: password2FA,
				});
			}
			setShow2FAPasswordForm(false);
			setPassword2FA("");
		} catch (error) {
			console.error("Error toggling 2FA:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggle2FA = () => {
		if (!session?.user?.emailVerified || !session?.user?.passwordSet) {
			return;
		}
		setShow2FAPasswordForm(true);
		setShowPasswordForm(false);
	};

	return (
		<div className="h-full flex flex-col relative">
			<h1 className="text-xl font-medium">Security Settings</h1>
			<div className="flex flex-1 flex-col gap-5 mt-4">
				<div className="flex flex-wrap justify-between items-center">
					<div className="max-w-[325px]">
						<h2 className="font-medium">Email Verification</h2>
						<p className="text-muted text-sm">
							Verify your email address to unlock full access to all features.
						</p>
					</div>
					{session?.user?.emailVerified ? (
						<p className="text-sm text-primary mt-1 flex gap-1">
							<i className="ri-checkbox-circle-fill text-green-600"></i>
							Verified
						</p>
					) : (
						<SecondaryButton
							text="Send Email"
							icon="ri-mail-send-fill"
							onClick={handleVerifyEmail}
							disabled={isLoading}
							extraClasses="flex gap-1 items-center"
						/>
					)}
				</div>
				<div className="flex justify-between items-center">
					<div className="max-w-[325px]">
						<h2 className="font-medium">Two-Factor Authentication</h2>
						<p className="text-muted text-sm">
							Add an extra layer of security to your account by enabling 2FA.
						</p>
					</div>
					{!show2FAPasswordForm ? (
						<SecondaryButton
							text={session?.user?.twoFactorEnabled ? "Disable" : "Enable"}
							icon="ri-lock-fill"
							extraClasses="flex gap-1 items-center disabled:cursor-not-allowed"
							onClick={handleToggle2FA}
							disabled={
								isLoading ||
								!session?.user?.emailVerified ||
								(!session?.user?.passwordSet &&
									!session?.user?.twoFactorEnabled)
							}
						/>
					) : (
						<SecondaryButton
							text="Cancel"
							icon={`ri-close-fill`}
							extraClasses="flex gap-1 items-center disabled:cursor-not-allowed"
							onClick={() => {
								setShow2FAPasswordForm(false);
								setPassword2FA("");
							}}
						/>
					)}
				</div>
				{show2FAPasswordForm && (
					<form onSubmit={handle2FAPasswordSubmit} className="space-y-4">
						<div className="flex flex-col gap-2">
							<label htmlFor="name" className="w-fit">
								Password
							</label>
							<input
								type="password"
								name="name"
								id="name"
								value={password2FA}
								onChange={e => setPassword2FA(e.target.value)}
								placeholder="Enter Your Password"
								className="bg-transparent w-full py-2 px-4 h-[35px] text-sm border rounded-[8px] border-border"
							/>
						</div>
						<div className="flex gap-3">
							<div className="flex gap-3">
								<SecondaryButton
									text={
										isLoading
											? "Loading..."
											: session?.user?.twoFactorEnabled
												? "Disable"
												: "Enable"
									}
									icon={`ri-${session?.user?.twoFactorEnabled ? "shield-cross-fill" : "shield-check-fill"}`}
									extraClasses="flex gap-1 items-center !mt-0"
									type="submit"
									disabled={
										isLoading ||
										!session?.user?.emailVerified ||
										(!session?.user?.passwordSet &&
											!session?.user?.twoFactorEnabled)
									}
								/>
							</div>
							<div className="flex gap-3">
								<SecondaryButton
									text="Cancel"
									icon={`ri-close-fill`}
									extraClasses="flex gap-1 items-center !mt-0"
									onClick={() => {
										setShow2FAPasswordForm(false);
										setPassword2FA("");
									}}
								/>
							</div>
						</div>
					</form>
				)}
				<div className="flex justify-between items-center">
					<div className="max-w-[325px]">
						<h2 className="font-medium">
							{session?.user?.passwordSet ? "Change" : "Set"} Password
						</h2>
						<p className="text-muted text-sm">
							Change or create a new password for your account.
						</p>
					</div>
					{!showPasswordForm ? (
						<SecondaryButton
							text={session?.user?.passwordSet ? "Change" : "Set"}
							icon="ri-lock-fill"
							extraClasses="flex gap-1 items-center disabled:cursor-not-allowed"
							disabled={
								isLoading ||
								!session?.user?.emailVerified ||
								!session?.user?.twoFactorEnabled
							}
							onClick={() => {
								setShowPasswordForm(true);
								setShow2FAPasswordForm(false);
							}}
						/>
					) : (
						<SecondaryButton
							text="Cancel"
							icon={`ri-close-fill`}
							extraClasses="flex gap-1 items-center disabled:cursor-not-allowed"
							onClick={() => {
								setShowPasswordForm(false);
								setPassword2FA("");
							}}
						/>
					)}
				</div>
				{showPasswordForm && (
					<form onSubmit={handlePasswordChange} className="space-y-4">
						{session?.user?.passwordSet && (
							<div className="flex flex-col gap-2">
								<label htmlFor="name" className="w-fit">
									Current Password
								</label>
								<input
									type="password"
									name="name"
									id="name"
									value={currentPassword}
									onChange={e => setCurrentPassword(e.target.value)}
									placeholder="Enter Your Password"
									className="bg-transparent w-full py-2 px-4 h-[35px] text-sm border rounded-[8px] border-border"
								/>
							</div>
						)}
						<div className="flex flex-col gap-2">
							<label htmlFor="name" className="w-fit">
								New Password
							</label>
							<input
								type="password"
								name="name"
								id="name"
								value={newPassword}
								onChange={e => setNewPassword(e.target.value)}
								placeholder="Enter Your Password"
								className="bg-transparent w-full py-2 px-4 h-[35px] text-sm border rounded-[8px] border-border"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label htmlFor="name" className="w-fit">
								Confirm Password
							</label>
							<input
								type="password"
								name="name"
								id="name"
								value={confirmPassword}
								onChange={e => setConfirmPassword(e.target.value)}
								placeholder="Enter Your Password"
								className="bg-transparent w-full py-2 px-4 h-[35px] text-sm border rounded-[8px] border-border"
							/>
						</div>
						<div className="flex gap-3">
							<div className="flex gap-3">
								<SecondaryButton
									text={
										isLoading
											? "Loading..."
											: session?.user?.passwordSet
												? "Change"
												: "Set"
									}
									icon={`ri-save-fill`}
									extraClasses="flex gap-1 items-center !mt-0"
									type="submit"
									disabled={
										isLoading ||
										!session?.user?.emailVerified ||
										!session?.user?.twoFactorEnabled
									}
								/>
							</div>
							<div className="flex gap-3">
								<SecondaryButton
									text="Cancel"
									icon={`ri-close-fill`}
									extraClasses="flex gap-1 items-center !mt-0"
									onClick={() => {
										setShowPasswordForm(false);
									}}
								/>
							</div>
						</div>
					</form>
				)}
				<div className="flex flex-col justify-between">
					<div className="max-w-[325px]">
						<h2 className="font-medium">Linked Accounts</h2>
						<p className="text-muted text-sm">
							Connect and manage your linked accounts for seamless access.
						</p>
					</div>
					<div className="flex flex-col gap-3 mt-3">
						<div className="flex gap-1 items-center justify-between">
							<div className="flex gap-2 items-center">
								<Image src="/google.svg" alt="Google" width={22} height={22} />
								<span className="text-sm">
									Google
									<p className="text-muted text-xs">
										Link your account with Google
									</p>
								</span>
							</div>
							<SecondaryButton
								text={
									session?.user?.linkedAccounts?.includes("Google")
										? "Linked"
										: "Link"
								}
								icon="ri-links-fill"
								extraClasses="flex gap-1 items-center disabled:cursor-not-allowed"
								disabled={
									!session?.user?.emailVerified ||
									session?.user?.linkedAccounts?.includes("Google")
								}
								onClick={async () => {
									await authClient.linkSocial({
										provider: "google",
										callbackURL: "/api/user/callback",
									});
								}}
							/>
						</div>
						<div className="flex gap-1 items-center justify-between">
							<div className="flex gap-1 items-center">
								<Image src="/github.svg" alt="Github" width={24} height={24} />
								<span className="text-sm">
									Github
									<p className="text-muted text-xs">
										Link your account with Github
									</p>
								</span>
							</div>
							<SecondaryButton
								text={
									session?.user?.linkedAccounts?.includes("Github")
										? "Linked"
										: "Link"
								}
								icon="ri-links-fill"
								extraClasses="flex gap-1 items-center disabled:cursor-not-allowed"
								disabled={
									!session?.user?.emailVerified ||
									session?.user?.linkedAccounts?.includes("Github")
								}
								onClick={async () => {
									await authClient.linkSocial({
										provider: "github",
										callbackURL: "/api/user/callback",
									});
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SecuritySettings;

import { Session } from "next-auth";
import { Modal } from "../Modal";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PrivacySecurityModalProps {
	isOpen: boolean;
	onClose: () => void;
	session: (Session & { user?: any }) | null;
}

const PrivacySecurityModal: React.FC<PrivacySecurityModalProps> = ({
	isOpen,
	onClose,
	session,
}: PrivacySecurityModalProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [show2FAPasswordForm, setShow2FAPasswordForm] = useState(false);
	const [password2FA, setPassword2FA] = useState("");
	const router = useRouter();

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const isCallback = searchParams.get("callback");

		if (isCallback === "true") {
			fetch("/api/user/fetchaccounts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
		router.push("/settings");
	}, []);

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
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Privacy & Security">
			<div className="flex flex-col gap-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
				<div className="flex flex-col gap-2 rounded-lg border border-border p-6">
					<div className="flex gap-4">
						<div>
							<h3 className="text-lg font-medium">
								<i className="ri-mail-fill ri-lg text-white"></i> Email
								Verification
							</h3>
							{session?.user?.emailVerified ? (
								<p className="text-sm text-muted mt-1">
									<i className="ri-checkbox-circle-fill text-green-500"></i>{" "}
									Your email is verified
								</p>
							) : (
								<p className="text-sm text-muted mt-1">
									Verify your email address
								</p>
							)}
						</div>
					</div>
					{!session?.user?.emailVerified && (
						<button
							onClick={handleVerifyEmail}
							disabled={isLoading}
							className="w-full text-muted font-medium flex gap-2 items-center justify-center py-2 h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 disabled:opacity-50"
						>
							<i className="ri-mail-send-fill ri-lg"></i>
							Send Verification Email
						</button>
					)}
				</div>
				<div className="flex flex-col gap-2 rounded-lg border border-border p-6">
					<div className="flex gap-4 mb-4">
						<div>
							<h3 className="text-lg font-medium">
								<i className="ri-lock-fill ri-lg text-white"></i> Password
							</h3>
							<p className="text-sm text-muted">
								{session?.user?.passwordSet
									? "Change your password"
									: "Set up a password"}
							</p>
						</div>
					</div>
					{!showPasswordForm ? (
						<button
							onClick={() => setShowPasswordForm(true)}
							disabled={!session?.user?.emailVerified}
							className="w-full text-muted font-medium flex gap-2 items-center justify-center py-2 h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<i className="ri-lock-password-fill ri-lg"></i>
							{!session?.user?.emailVerified
								? "Verify email to set password"
								: session?.user?.passwordSet
									? "Change Password"
									: "Set Password"}
						</button>
					) : (
						<form onSubmit={handlePasswordChange} className="space-y-4">
							{session?.user?.passwordSet && (
								<div>
									<label className="text-sm text-muted">Current Password</label>
									<input
										type="password"
										value={currentPassword}
										onChange={e => setCurrentPassword(e.target.value)}
										className="w-full px-4 py-2 mt-1 bg-transparent border border-border rounded-lg focus:outline-none focus:border-white/50"
										required
									/>
								</div>
							)}
							<div>
								<label className="text-sm text-muted">New Password</label>
								<input
									type="password"
									value={newPassword}
									onChange={e => setNewPassword(e.target.value)}
									className="w-full px-4 py-2 mt-1 bg-transparent border border-border rounded-lg focus:outline-none focus:border-white/50"
									required
								/>
							</div>
							<div>
								<label className="text-sm text-muted">Confirm Password</label>
								<input
									type="password"
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
									className="w-full px-4 py-2 mt-1 bg-transparent border border-border rounded-lg focus:outline-none focus:border-white/50"
									required
								/>
							</div>
							<div className="flex gap-3">
								<button
									type="submit"
									disabled={isLoading}
									className="flex-1 text-muted font-medium flex gap-2 items-center justify-center py-2 h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 disabled:opacity-50"
								>
									<i className="ri-save-fill ri-lg"></i>
									{isLoading ? "Saving..." : "Save Password"}
								</button>
								<button
									type="button"
									onClick={() => setShowPasswordForm(false)}
									className="flex-1 text-muted font-medium flex gap-2 items-center justify-center py-2 h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200"
								>
									<i className="ri-close-fill ri-lg"></i>
									Cancel
								</button>
							</div>
						</form>
					)}
				</div>
				<div className="flex flex-col gap-2 rounded-lg border border-border p-6">
					<div className="flex gap-4 mb-4">
						<div>
							<h3 className="text-lg font-medium">
								<i className="ri-shield-keyhole-fill ri-lg text-white"></i>{" "}
								Two-Factor Authentication
							</h3>
							<p className="text-sm text-muted">
								{!session?.user?.emailVerified
									? "Verify your email to enable 2FA"
									: session?.user?.twoFactorEnabled
										? "2FA is enabled for your account"
										: !session?.user?.passwordSet
											? "Set a password first to enable 2FA"
											: "Add an extra layer of security"}
							</p>
						</div>
					</div>
					{show2FAPasswordForm ? (
						<form onSubmit={handle2FAPasswordSubmit} className="space-y-4">
							<div>
								<label className="text-sm text-muted">Enter Password</label>
								<input
									type="password"
									value={password2FA}
									onChange={e => setPassword2FA(e.target.value)}
									className="w-full px-4 py-2 mt-1 bg-transparent border border-border rounded-lg focus:outline-none focus:border-white/50"
									required
								/>
							</div>
							<div className="flex gap-3">
								<button
									type="submit"
									disabled={
										isLoading ||
										!session?.user?.emailVerified ||
										(!session?.user?.passwordSet &&
											!session?.user?.twoFactorEnabled)
									}
									className="flex-1 text-muted font-medium flex gap-2 items-center justify-center py-2 h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<i
										className={`ri-${session?.user?.twoFactorEnabled ? "shield-cross-fill" : "shield-check-fill"} ri-lg`}
									></i>
									{isLoading
										? "Processing..."
										: session?.user?.twoFactorEnabled
											? "Disable 2FA"
											: "Enable 2FA"}
								</button>
								<button
									type="button"
									onClick={() => {
										setShow2FAPasswordForm(false);
										setPassword2FA("");
									}}
									className="flex-1 text-muted font-medium flex gap-2 items-center justify-center py-2 h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200"
								>
									<i className="ri-close-fill ri-lg"></i>
									Cancel
								</button>
							</div>
						</form>
					) : (
						<button
							onClick={handleToggle2FA}
							disabled={
								isLoading ||
								!session?.user?.emailVerified ||
								(!session?.user?.passwordSet &&
									!session?.user?.twoFactorEnabled)
							}
							className="w-full text-muted font-medium flex gap-2 items-center justify-center py-2 h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<i
								className={`ri-${session?.user?.twoFactorEnabled ? "shield-cross-fill" : "shield-check-fill"} ri-lg`}
							></i>
							{session?.user?.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
						</button>
					)}
				</div>
				<div className="flex flex-col gap-2 rounded-lg border border-border p-6">
					<div className="flex gap-4 mb-4">
						<div>
							<h3 className="text-lg font-medium">
								<i className="ri-links-fill ri-lg text-white"></i> Linked
								Accounts
							</h3>
							<p className="text-sm text-muted">
								Manage your connected accounts
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<button
							onClick={async () => {
								await authClient.linkSocial({
									provider: "google",
									callbackURL: "/settings?callback=true",
								});
							}}
							disabled={
								!session?.user?.emailVerified ||
								session?.user?.linkedAccounts?.includes("Google")
							}
							className="w-full text-muted font-medium flex gap-2 items-center justify-center py-2 h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<div className="relative w-5 h-5">
								<Image
									src="/google.svg"
									alt="Google"
									fill
									className="object-contain"
								/>
							</div>
							{!session?.user?.emailVerified
								? "Verify email to connect Google"
								: session?.user?.linkedAccounts?.includes("Google")
									? "Google Connected"
									: "Connect Google"}
						</button>
						<button
							onClick={async () => {
								await authClient.linkSocial({
									provider: "github",
									callbackURL: "/settings?callback=true",
								});
							}}
							disabled={
								!session?.user?.emailVerified ||
								session?.user?.linkedAccounts?.includes("Github")
							}
							className="w-full text-muted font-medium flex gap-2 items-center justify-center py-2 h-[44px] rounded-[10px] border border-border hover:bg-[#1F2324] duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<div className="relative w-5 h-5">
								<Image
									src="/github.svg"
									alt="GitHub"
									fill
									className="object-contain"
								/>
							</div>
							{!session?.user?.emailVerified
								? "Verify email to connect GitHub"
								: session?.user?.linkedAccounts?.includes("Github")
									? "GitHub Connected"
									: "Connect GitHub"}
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default PrivacySecurityModal;

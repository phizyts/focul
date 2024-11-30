import { Session } from "next-auth";
import { Modal } from "../Modal";
import { useState, FormEvent, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

interface EditAccountModalProps {
	isOpen: boolean;
	onClose: () => void;
	session: (Session & { user?: any }) | null;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
	isOpen,
	onClose,
	session,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState("");
	const [location, setLocation] = useState("");

	useEffect(() => {
		if (session?.user) {
			setName(session.user.name || "");
			setLocation(session.user.location || "");
		}
	}, [session]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (!session?.user?.emailVerified) {
				return;
			}
			await authClient.updateUser({
				name,
				location,
			});

			onClose();
		} catch (error) {
			console.error("Error updating user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Edit Account">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<label className="text-sm text-muted">Name</label>
					<input
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
						disabled={!session?.user?.emailVerified}
						className={`w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-white/50 ${
							!session?.user?.emailVerified
								? "bg-black/20 cursor-not-allowed"
								: "bg-transparent"
						}`}
						required
					/>
					{!session?.user?.emailVerified && (
						<p className="text-xs text-muted">
							Verify your email to edit your name
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-sm text-muted">Email</label>
					<input
						type="email"
						defaultValue={session?.user?.email}
						disabled
						className="w-full px-4 py-2 bg-black/20 border border-border rounded-lg cursor-not-allowed"
					/>
					<p className="text-xs text-muted">
						{!session?.user?.emailVerified
							? "Please verify your email address"
							: "Email cannot be changed"}
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-sm text-muted">Location</label>
					<input
						type="text"
						value={location}
						onChange={e => setLocation(e.target.value)}
						disabled={!session?.user?.emailVerified}
						className={`w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-white/50 ${
							!session?.user?.emailVerified
								? "bg-black/20 cursor-not-allowed"
								: "bg-transparent"
						}`}
					/>
					{!session?.user?.emailVerified && (
						<p className="text-xs text-muted">
							Verify your email to edit your location
						</p>
					)}
				</div>

				<div className="flex gap-3 mt-4">
					<button
						type="submit"
						disabled={isLoading || !session?.user?.emailVerified}
						className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{!session?.user?.emailVerified
							? "Verify Email to Edit"
							: isLoading
								? "Saving..."
								: "Save Changes"}
					</button>
					<button
						type="button"
						onClick={onClose}
						disabled={isLoading}
						className="flex-1 border border-border hover:bg-[#1F2324] text-muted font-medium py-2 rounded-lg duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default EditAccountModal;

import { Session } from "better-auth";
import { Modal } from "../Modal";
import { languages } from "@/constants/constants";
import { useState } from "react";

interface PreferencesModalProps {
	isOpen: boolean;
	onClose: () => void;
	session: (Session & { user?: any }) | null;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({
	isOpen,
	onClose,
	session,
}) => {
	const [selectedLanguage, setSelectedLanguage] = useState(
		session?.user?.language || "English",
	);

	const handleLanguageChange = async (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		setSelectedLanguage(e.target.value);
		// TODO: Update user's language preference in the database
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Preferences">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2 rounded-lg border border-border p-6">
					<div className="flex gap-4">
						<div>
							<h3 className="text-lg font-medium">
								<i className="ri-palette-fill text-white"></i> Theme
							</h3>
							<p className="text-sm text-muted">System theme will be used</p>
						</div>
					</div>
					<div className="flex items-center gap-2 text-sm text-muted">
						<i className="ri-computer-fill"></i>
						<span>Using system theme (Dark)</span>
					</div>
				</div>

				<div className="flex flex-col gap-2 rounded-lg border border-border p-6">
					<div className="flex gap-4">
						<div>
							<h3 className="text-lg font-medium">
								<i className="ri-time-fill text-white"></i> Timezone
							</h3>
							<p className="text-sm text-muted">System timezone will be used</p>
						</div>
					</div>
					<div className="flex items-center gap-2 text-sm text-muted">
						<i className="ri-global-fill"></i>
						<span>Using system timezone (UTC-5)</span>
					</div>
				</div>
				<div className="flex flex-col gap-2 rounded-lg border border-border p-6">
					<div className="flex gap-4">
						<div>
							<h3 className="text-lg font-medium">
								<i className="ri-translate-2 text-white"></i> Language
							</h3>
							<p className="text-sm text-muted">
								Choose your preferred language
							</p>
						</div>
					</div>
					<select
						value={selectedLanguage}
						onChange={handleLanguageChange}
						className="w-full bg-transparent text-white font-medium py-2 px-3 h-[44px] rounded-[10px] border border-border hover:bg-[#2A2F30] duration-200 focus:outline-none appearance-none cursor-pointer"
						style={{
							backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
							backgroundRepeat: "no-repeat",
							backgroundPosition: "right 12px center",
							paddingRight: "40px",
						}}
					>
						{languages.map(lang => (
							<option
								key={lang.value}
								value={lang.value}
								className="bg-[#1F2324] text-white hover:bg-[#2A2F30]"
							>
								{lang.display}
							</option>
						))}
					</select>
				</div>
			</div>
		</Modal>
	);
};

export default PreferencesModal;

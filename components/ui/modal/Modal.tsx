import React from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title: string;
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	children,
	title,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
			<div
				className="bg-background border border-border rounded-lg w-full max-w-md mx-4 p-6 shadow-lg"
				onClick={e => e.stopPropagation()}
			>
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-medium text-primary">{title}</h3>
					<button
						onClick={onClose}
						className="text-muted hover:text-primary duration-200"
					>
						<i className="ri-close-line ri-lg"></i>
					</button>
				</div>
				{children}
			</div>
		</div>
	);
};

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
}

export default function CourseModal({ isOpen, onClose, children }: ModalProps) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="fixed inset-0 bg-black/50" onClick={onClose} />
			<div className="relative z-50 w-full max-w-md rounded-lg bg-[#1A1D1F] p-6 shadow-xl">
				<button
					onClick={onClose}
					className="absolute right-4 top-4 text-gray-400 hover:text-white"
				>
					<i className="ri-close-line"></i>
				</button>
				{children}
			</div>
		</div>
	)
}

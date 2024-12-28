"use client";
const Modal = ({
	children,
	extraClasses,
}: {
	children: React.ReactNode;
	extraClasses?: string;
}) => {
	return (
		<div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
			<div className="w-full h-full flex items-center justify-center py-4">
				<div
					className={`bg-background border border-border rounded-lg w-full mx-4 shadow-sm overflow-y-auto sm:overflow-visible ${extraClasses}`}
					onClick={e => e.stopPropagation()}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
export default Modal;

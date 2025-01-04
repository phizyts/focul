import PrimaryButton from "../ui/buttons/PrimaryButton";
import SecondaryButton from "../ui/buttons/SecondaryButton";

export const ConfirmPolicyChange = ({
	onConfirm,
	onCancel,
	isLoading,
}: {
	onConfirm: () => void;
	onCancel: () => void;
	isLoading: boolean;
}) => {
	return (
		<div className="flex flex-col w-full">
			<p className="text-sm text-muted mb-6">
				Changing the grading policy will delete all existing assignments. Are
				you sure you want to continue?
			</p>
			<div className="flex justify-end gap-3">
				<PrimaryButton
					text="Continue"
					extraClasses="flex !w-fit !bg-[#b80404]"
					onClick={onConfirm}
					isLoading={isLoading}
					extraAttributes={{ disabled: isLoading }}
				/>
				<SecondaryButton text="Cancel" onClick={onCancel} type="button" />
			</div>
		</div>
	);
};

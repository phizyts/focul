"use client";

import { AssignmentType, GradingPolicy } from "@prisma/client";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { ExtendedGradingPolicy } from "@/types/course.types";

export const ManageGrading = ({
	gradingPoliciesWithAGPId,
	activeGradingPolicy,
	setActiveGradingPolicy,
	assignmentTypes,
	setAssignmentTypes,
	isCustom,
	setIsCustom,
}: {
	gradingPoliciesWithAGPId: {
		gradingPolicy: (GradingPolicy & {
			assignmentTypes: AssignmentType[];
		})[];
		agpId: string;
	};
	activeGradingPolicy: ExtendedGradingPolicy | null;
	setActiveGradingPolicy: (policy: ExtendedGradingPolicy | null) => void;
	assignmentTypes: AssignmentType[];
	setAssignmentTypes: (types: AssignmentType[]) => void;
	isCustom: boolean;
	setIsCustom: (isCustom: boolean) => void;
}) => {
	const gradingPolicies = gradingPoliciesWithAGPId.gradingPolicy;

	const handleAddAssignmentType = () => {
		setAssignmentTypes([
			...assignmentTypes,
			{
				id: `new-${Date.now()}-${Math.random()}`,
				name: "",
				weight: 0,
			} as AssignmentType,
		]);
	};

	const handleRemoveAssignmentType = (id: string) => {
		setAssignmentTypes(assignmentTypes.filter(type => type.id !== id));
	};

	const handleAssignmentTypeChange = (
		id: string,
		field: "name" | "weight",
		value: string | number,
	) => {
		setAssignmentTypes(
			assignmentTypes.map(type =>
				type.id === id ? { ...type, [field]: value } : type,
			),
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<label className="text-primary">
					{isCustom ? "Custom Policy" : "Predefined Policy"}
				</label>
				<select
					value={activeGradingPolicy?.name}
					onChange={e => {
						const selectedPolicy = gradingPolicies.find(
							(policy: ExtendedGradingPolicy) => policy.name === e.target.value,
						);
						if (selectedPolicy) {
							setActiveGradingPolicy(selectedPolicy);
							setAssignmentTypes(selectedPolicy.assignmentTypes);
						}
					}}
					className="w-full text-sm px-4 h-[35px] rounded-lg border border-border bg-background duration-200 cursor-pointer"
					style={{
						backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
						backgroundRepeat: "no-repeat",
						backgroundPosition: "right 12px center",
						paddingRight: "40px",
						WebkitAppearance: "none",
						MozAppearance: "none",
					}}
					required
				>
					{isCustom
						? gradingPolicies
								.filter(
									(policy: ExtendedGradingPolicy) => policy.name === "Custom",
								)
								.map((policy: ExtendedGradingPolicy) => (
									<option
										key={policy.name}
										value={policy.name}
										className="bg-background text-primary"
									>
										{policy.name}
									</option>
								))
						: gradingPolicies
								.filter(
									(policy: ExtendedGradingPolicy) => policy.name !== "Custom",
								)
								.map((policy: ExtendedGradingPolicy) => (
									<option
										key={policy.name}
										value={policy.name}
										className="bg-background text-primary"
									>
										{policy.name}
									</option>
								))}
				</select>
				<PrimaryButton
					text={
						isCustom ? "Switch to Predefined Policy" : "Switch to Custom Policy"
					}
					onClick={() => {
						setIsCustom(!isCustom);
						const newPolicy = gradingPolicies.find(
							(policy: ExtendedGradingPolicy) =>
								!isCustom ? policy.name === "Custom" : policy.name === "HSTAT",
						);
						if (newPolicy) {
							setActiveGradingPolicy(newPolicy);
							setAssignmentTypes(newPolicy.assignmentTypes);
						}
					}}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-primary">Assignment Types</label>
				<div className="flex flex-col gap-2">
					{assignmentTypes.map(type => (
						<div key={type.id} className="flex gap-2 items-center">
							<input
								type="text"
								value={type.name}
								onChange={e =>
									handleAssignmentTypeChange(type.id, "name", e.target.value)
								}
								placeholder="Assignment type name"
								className="flex-grow text-sm px-4 h-[35px] rounded-lg border border-border duration-200"
								disabled={!isCustom}
							/>
							<div className="relative w-[80px]">
								<input
									type="number"
									value={type.weight}
									onChange={e =>
										handleAssignmentTypeChange(
											type.id,
											"weight",
											parseInt(e.target.value) || 0,
										)
									}
									className="w-full text-sm px-4 h-[35px] rounded-lg border border-border duration-200"
									disabled={!isCustom}
								/>
								<span className="absolute right-3 top-[50%] transform -translate-y-1/2 text-sm text-muted">
									%
								</span>
							</div>
							{isCustom && (
								<button
									type="button"
									onClick={() => handleRemoveAssignmentType(type.id)}
									className="text-muted hover:text-primary duration-200 h-[35px] w-[35px] flex items-center justify-center"
								>
									<i className="ri-delete-bin-line"></i>
								</button>
							)}
						</div>
					))}
				</div>
				{isCustom && (
					<PrimaryButton
						text="Add"
						onClick={handleAddAssignmentType}
						extraClasses=""
					/>
				)}
			</div>
		</div>
	);
};

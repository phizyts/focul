import { useState } from "react";

const SetGrade = ({
	maxGrade,
	currentGrade,
	grade,
	setGrade,
}: {
	maxGrade: number;
	currentGrade: number | null;
	grade: number;
	setGrade: (grade: number) => void;
}) => {
	return (
		<div className="flex flex-col gap-4 pb-5">
			<div className="flex flex-col gap-2">
				<label className="text-primary">Grade (out of {maxGrade})</label>
				<div className="relative">
					<input
						type="number"
						value={grade}
						onChange={e => {
							const value = parseFloat(e.target.value);
							if (value >= 0 && value <= maxGrade) {
								setGrade(value);
							}
						}}
						className="w-full text-sm px-4 h-[35px] rounded-lg border border-border duration-200"
						min={0}
						max={maxGrade}
						step={0.1}
					/>
				</div>
			</div>
		</div>
	);
};

export default SetGrade;

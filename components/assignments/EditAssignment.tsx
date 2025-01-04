import { AssignmentType } from "@prisma/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditAssignment = ({
	name,
	setName,
	type,
	setType,
	description,
	setDescription,
	dueDate,
	setDueDate,
	maxGrade,
	setMaxGrade,
	assignmentTypes,
}: {
	name: string;
	type: string;
	description: string;
	dueDate: Date;
	maxGrade: number;
	setName: (name: string) => void;
	setType: (type: string) => void;
	setDescription: (description: string) => void;
	setDueDate: (dueDate: Date) => void;
	setMaxGrade: (maxGrade: number) => void;
	assignmentTypes: AssignmentType[];
}) => {
	return (
		<form className="flex flex-col gap-6 max-w-2xl">
			<div className="flex flex-col gap-2">
				<label className="text-primary flex items-center gap-2">Name</label>
				<input
					type="text"
					value={name}
					onChange={e => setName(e.target.value)}
					className="w-full text-sm px-4 h-[35px] border border-border rounded-lg text-primary placeholder-muted bg-transparent"
					placeholder="Enter assignment name"
					required
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-primary flex items-center gap-2">Type</label>
				<select
					value={type}
					onChange={e => setType(e.target.value)}
					className="w-full text-sm px-4 h-[35px] rounded-lg border border-border duration-200 cursor-pointer bg-transparent"
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
					{assignmentTypes.length > 0 ? (
						assignmentTypes.map(type => (
							<option
								key={type.name}
								value={type.name}
								className="bg-background text-primary"
							>
								{type.name}
							</option>
						))
					) : (
						<option value="" disabled className="bg-background text-primary">
							Add types in grading policy
						</option>
					)}
				</select>
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-primary flex items-center gap-2">
					Description <span className="text-xs text-muted">(Optional)</span>
				</label>
				<textarea
					name="description"
					id="description"
					placeholder="Enter description"
					className="bg-transparent w-full py-2 px-4 flex-grow text-sm border rounded-lg border-border resize-vertical min-h-[100px]"
					onChange={e => setDescription(e.target.value)}
					value={description}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<label className="text-primary flex items-center gap-2">
						Due Date
					</label>
					<div className="">
						<DatePicker
							selected={dueDate}
							onChange={date => setDueDate(date as Date)}
							timeIntervals={5}
							showTimeSelect
							dateFormat="Pp"
							className="w-full text-sm px-4 h-[35px] border border-border rounded-lg text-primary bg-transparent"
							placeholderText="Select date and time"
							required
							calendarClassName="shadow-lg"
							popperPlacement="bottom-start"
							withPortal
						/>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-primary flex items-center gap-2">Grade</label>
					<input
						type="number"
						min="0"
						step="1"
						value={maxGrade}
						onChange={e => setMaxGrade(Number(e.target.value))}
						className="w-full text-sm px-4 h-[35px] border border-border rounded-lg text-primary bg-transparent"
						placeholder="Enter max grade"
						required
					/>
				</div>
			</div>
		</form>
	);
};

export default EditAssignment;

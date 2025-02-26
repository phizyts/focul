import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateTask = ({
	taskName,
	setTaskName,
	taskDesc,
	setTaskDesc,
	taskDueDate,
	setTaskDueDate,
}: {
	taskName: string;
	setTaskName: (name: string) => void;
	taskDesc: string;
	setTaskDesc: (description: string) => void;
	taskDueDate: Date;
	setTaskDueDate: (dueDate: Date) => void;
}) => {
	return (
		<form className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<label className="text-primary" htmlFor="taskName">
					Task Title
				</label>
				<input
					type="text"
					name="taskName"
					id="taskName"
					value={taskName}
					onChange={e => setTaskName(e.target.value)}
					className="w-full text-sm px-4 h-[35px] border border-border rounded-lg text-primary placeholder-muted"
					placeholder="Enter task title"
					required
				/>
			</div>
			<div className="w-full flex flex-col gap-2 flex-grow">
				<label className="text-primary flex items-center gap-2">
					Description <span className="text-xs text-muted">(Optional)</span>
				</label>
				<textarea
					name="description"
					id="description"
					placeholder="Enter Description"
					className="bg-transparent w-full min-h-[150px] py-2 px-4 flex-grow text-sm border rounded-[8px] border-border resize-none overflow-auto disabled:cursor-not-allowed"
					onChange={e => setTaskDesc(e.target.value)}
					value={taskDesc}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label className="text-primary flex items-center gap-2">Due Date</label>
				<div className="">
					<DatePicker
						selected={taskDueDate}
						onChange={date => setTaskDueDate(date as Date)}
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
		</form>
	);
};
export default CreateTask;

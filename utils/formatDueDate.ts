export const formatDueDate = (dueDate: Date) => {
	const today = new Date();
	const tomorrow = new Date();
	tomorrow.setDate(today.getDate() + 1);

	const formattedToday = today.toLocaleDateString();
	const formattedTomorrow = tomorrow.toLocaleDateString();
	const formattedDueDate = dueDate.toLocaleDateString();

	if (formattedDueDate === formattedToday) {
		return dueDate.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	} else if (formattedDueDate === formattedTomorrow) {
		return "Tomorrow";
	} else {
		return dueDate.toLocaleDateString();
	}
};

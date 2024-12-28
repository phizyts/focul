export const formatGrade = (grade: Number | null) => {
	if (grade === null || grade === -1) {
		return "--";
	}
	return grade;
};

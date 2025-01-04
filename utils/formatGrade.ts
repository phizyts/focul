export const formatGrade = (grade: Number | null) => {
	if (grade === null || grade === -1) {
		return "--";
	}
	const roundedGrade = Math.round(Number(grade) * 100) / 100;
	return roundedGrade.toString();
};

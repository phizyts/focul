import { useState } from "react";
import { ReactElement } from "react";

export const useModal = (pages: ReactElement[]) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const openModal = () => setIsOpen(true);
	const closeModal = () => {
		setIsOpen(false);
		setCurrentPage(1);
	};

	const changePage = (page: number) => {
		if (page >= 1 && page <= pages.length) {
			setCurrentPage(page);
		}
	};

	const page = pages.length > 1 ? pages[currentPage - 1] : pages[0];

	return {
		isOpen,
		openModal,
		closeModal,
		currentPage,
		changePage,
		page,
	};
};

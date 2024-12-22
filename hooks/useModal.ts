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
	const changePage = (page: number) => setCurrentPage(page);
	return {
		isOpen,
		openModal,
		closeModal,
		currentPage,
		changePage,
		page: pages[currentPage - 1],
	};
};

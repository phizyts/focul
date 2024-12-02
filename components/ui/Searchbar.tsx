"use client";
import { useRef, useEffect, useState } from "react";

const Searchbar = () => {
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, []);

	return (
		<div className="flex-1 relative w-full hidden md:block lg:hidden xl:block">
			<input
				ref={searchInputRef}
				type="text"
				placeholder="Type a command or search..."
				className="w-full h-[44px] pl-11 pr-16 bg-transparent text-white rounded-[10px] border border-[#3B4245] focus:outline-none focus:border-gray-500 transition-colors"
				onFocus={() => setIsSearchFocused(true)}
				onBlur={() => setIsSearchFocused(false)}
			/>
			<i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ri-lg"></i>
			{!isSearchFocused && (
				<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
					<span className="text-sm text-muted bg-[#212426] px-1.5 py-0.5 rounded">
						⌘ K
					</span>
				</div>
			)}
		</div>
	);
};

export default Searchbar;

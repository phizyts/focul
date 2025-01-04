"use client";
import { useRef, useEffect, useState } from "react";

const NavSearchbar = () => {
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
		<div className="relative h-[36px] w-full max-w-[500px] hidden md:block">
			<input
				ref={searchInputRef}
				type="text"
				placeholder="Type a command or search..."
				className="w-full h-[36px] pl-9 pr-16 bg-transparent text-sm text-primary rounded-[10px] border border-border focus:outline-none focus:border-[#9c9c9c] transition-colors"
				onFocus={() => setIsSearchFocused(true)}
				onBlur={() => setIsSearchFocused(false)}
			/>
			<i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted"></i>
			{!isSearchFocused && (
				<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
					<span className="text-xs text-muted bg-[#ececec] px-1.5 py-0.5 rounded">
						⌘ K
					</span>
				</div>
			)}
		</div>
	);
};

export default NavSearchbar;

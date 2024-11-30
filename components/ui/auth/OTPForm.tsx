import { useState, useRef, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface OTPFormProps {
	onCancel: () => void;
}

export const OTPForm = ({ onCancel }: OTPFormProps) => {
	const [otp, setOtp] = useState(Array(6).fill(""));
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, []);

	const handleInputChange = (index: number, value: string) => {
		if (!/^[0-9]*$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").slice(0, 6);
		if (!/^[0-9]*$/.test(pastedData)) return;

		const newOtp = [...otp];
		pastedData.split("").forEach((char, index) => {
			if (index < 6) newOtp[index] = char;
		});
		setOtp(newOtp);

		const lastFilledIndex = newOtp.findLastIndex(x => x !== "");
		const focusIndex = lastFilledIndex === 5 ? 5 : lastFilledIndex + 1;
		inputRefs.current[focusIndex]?.focus();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const otpString = otp.join("");
		if (otpString.length !== 6) {
			setError("Please enter all 6 digits");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			await authClient.twoFactor.verifyOtp(
				{
					code: otpString,
				},
				{
					onSuccess() {
						router.push("/dashboard/overview");
					},
				},
			);
		} catch (err) {
			console.error("Error verifying OTP:", err);
			setError("Invalid verification code. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-sm mt-5">
			<p className="text-muted text-sm mb-8">
				Please enter the 6-digit verification code sent to your email.
			</p>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="flex justify-center gap-2">
					{otp.map((digit, index) => (
						<input
							key={index}
							ref={(el) => {
								inputRefs.current[index] = el;
							}}
							type="text"
							inputMode="numeric"
							maxLength={1}
							value={digit}
							onChange={e => handleInputChange(index, e.target.value)}
							onKeyDown={e => handleKeyDown(index, e)}
							onPaste={handlePaste}
							className="w-12 h-14 text-center text-lg font-medium bg-[#1F2324] border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
							required
						/>
					))}
				</div>

				{error && (
					<p className="text-red-500 text-sm text-center bg-red-500/10 py-2 px-4 rounded-lg">
						{error}
					</p>
				)}

				<div className="flex gap-3 pt-2">
					<button
						type="submit"
						disabled={isLoading || otp.join("").length !== 6}
						className="flex-1 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
					>
						{isLoading ? "Verifying..." : "Verify Code"}
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-[#1F2324] transition-colors font-medium"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

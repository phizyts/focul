import { ReactElement, useState } from "react";

export const useFormStep = (steps: ReactElement[]) => {
	const [currentStep, setCurrentStep] = useState(1);

	const next = () => {
		setCurrentStep(prev => {
			if (prev === steps.length) return prev;
			return prev + 1;
		});
	};
	const prev = () => {
		setCurrentStep(prev => {
			if (prev === 1) return prev;
			return prev - 1;
		});
	};

	const reset = () => {
		setCurrentStep(1);
	};

	return {
		currentStep,
		step: steps[currentStep - 1],
		steps,
		next,
		prev,
		reset,
	};
};

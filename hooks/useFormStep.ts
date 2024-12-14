import { ReactElement, useState } from "react";

export const useFormStep = (steps: ReactElement[]) => {
	const [currentStep, setCurrentStep] = useState(1);

	const next = () => {
		if (currentStep === steps.length) return currentStep;
		setCurrentStep(prev => prev + 1);
	};
	const prev = () => {
		if (currentStep === 1) return currentStep;
		setCurrentStep(prev => prev - 1);
	};

	const reset = () => {
		setCurrentStep(1);
	};

	return { currentStep, step: steps[currentStep], next, prev, reset };
};

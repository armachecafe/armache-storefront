'use client';

import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number; // 1, 2, or 3
}

const steps = [
  { number: 1, label: 'Envío' },
  { number: 2, label: 'Pago' },
  { number: 3, label: 'Confirmación' },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <nav aria-label="Progreso del checkout" data-testid="checkout-steps">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, idx) => {
          const isActive = step.number === currentStep;
          const isComplete = step.number < currentStep;

          return (
            <li key={step.number} className="flex items-center gap-2 sm:gap-3">
              {/* Step indicator */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${isComplete ? 'bg-green-500 text-white' : ''}
                  ${isActive ? 'bg-brand-primary text-white' : ''}
                  ${!isActive && !isComplete ? 'bg-gray-200 text-gray-500' : ''}
                `}
                data-testid={`checkout-step-indicator-${step.number}`}
              >
                {isComplete ? <Check className="w-4 h-4" /> : step.number}
              </div>

              {/* Label */}
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  isActive ? 'text-brand-primary' : isComplete ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>

              {/* Connector */}
              {idx < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 ${
                    isComplete ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

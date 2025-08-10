import React from "react"
import { steps } from "./steps"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbProps {
  currentStep: string
  setCurrentStep: (step: string) => void
}

export default function Breadcrumbs({ currentStep, setCurrentStep }: BreadcrumbProps) {
  return (
    <div className="flex justify-center mb-12 p-4  border-b-4">
      <Breadcrumb>
        <BreadcrumbList>
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <BreadcrumbItem>
                {step.key === currentStep ? (
                  <BreadcrumbPage className="text-xl font-bold">{step.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <button onClick={() => setCurrentStep(step.key)}>{step.title}</button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < steps.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

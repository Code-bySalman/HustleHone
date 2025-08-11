
"use client";

import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumb";
import Footer from "./Footer";
import { useRef, useState } from "react";
import { ResumeValues } from "@/lib/validation";
import ResumePreviewSection from "./ResumePreviewSection";
import { cn, maptoResumeValues } from "@/lib/utils";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import useAutoSave from "./useAutoSave";
import { ResumeServerData } from "@/lib/type";
import MoreMenu from "@/components/MoreMenu";
import { useReactToPrint } from "react-to-print";
import LoadingButton from "@/components/LoadingButton";
import Link from "next/link";

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
  resume: ResumeServerData | null;
}

export default function ResumeEditor({ resumeToEdit, resume }: ResumeEditorProps) {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume?.title || resumeToEdit?.title || "Resume",
  });

  const defaultResumeData: ResumeValues = {
    id: "",
    photo: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    city: "",
    country: "",
    title: "",
    description: "",
  };

  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit ? maptoResumeValues(resumeToEdit) : defaultResumeData,
  );
  const [showSmResumePreview, setShowResumePreview] = useState(false);
  const { isSaving, hasUnsavedChanges } = useAutoSave(resumeData, setResumeData); // Pass setResumeData
  useUnloadWarning(hasUnsavedChanges);

  const currentStep = searchParams.get("step") || steps[0].key;

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState({}, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find((step) => step.key === currentStep)?.component;

  // Log for debugging
  console.log("resume:", resume, "resumeToEdit:", resumeToEdit, "resumeData.id:", resumeData.id);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="relative border-b px-3 py-5 flex items-center justify-between">
        {/* Left side - Dashboard */}
        <div className="flex items-center gap-3 w-1/3">
          <Link href="/resumes">
            <LoadingButton
              variant="outline"
              className="flex items-center justify-center gap-2 rounded-xl border-5 border-blue-900 dark:border-white dark:bg-white dark:text-black text-white hover:bg-white hover:text-black bg-black transition-all whitespace-nowrap h-10 dark:hover:bg-black dark:hover:text-white shadow-md hover:shadow-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:shadow-md dark:hover:shadow-white"
            >
              Dashboard
            </LoadingButton>
          </Link>
        </div>

        {/* Middle */}
        <div className="flex flex-col items-center text-center w-1/3">
          <h1 className="text-3xl font-bold">Design your resume</h1>
          <p className="text-sm text-muted-foreground">
            Follow the steps below to create your resume. All of your progress will be saved automatically
          </p>
        </div>

        {/* Right side - MoreMenu */}
        <div className="relative flex items-center justify-end w-1/3 p-3">
          {resumeData.id && (
            <MoreMenu resumeId={resumeData.id} onPrintClick={reactToPrintFn} />
          )}
        </div>
      </header>

      <main className="relative grow flex">
        <div
          className={cn(
            "w-full md:w-1/2 mt-3 border-gray-300 dark:border-gray-600 p-4 space-y-6 border-b-4 md:block",
            showSmResumePreview && "hidden",
          )}
        >
          <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
          {FormComponent && <FormComponent resumeData={resumeData} setResumeData={setResumeData} />}
        </div>

        <ResumePreviewSection
          className={cn(showSmResumePreview && "flex")}
          resumeData={resumeData}
          setResumeData={setResumeData}
          contentRef={contentRef}
        />
      </main>

      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowResumePreview={setShowResumePreview}
        isSaving={isSaving}
      />
    </div>
  );
}
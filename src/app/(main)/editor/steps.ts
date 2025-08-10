import GeneralInfoForm from "./forms/GeneralInfoForm"
import PersonalInfoForm from "./forms/PersonalInfoForm"
import WorkExperienceForm from "./forms/WorkExperienceForm"
import EducationalInfoForm from "./forms/EducationInfoForm"
import ProjectInfoForm from "./forms/ProjectInfoForm"
import { EditorFormProps } from "@/lib/type"
import SkillsInfoForm from "./forms/SkillsInfoForm"
import SummaryInfoForm from "./forms/SummaryInfoForm"

export const steps: {
  title: string
  label: string
  component: React.ComponentType<EditorFormProps>
  key: string
}[] = [
  {
    title: "General Information",
    label: "General Information",
    component: GeneralInfoForm,
    key: "general-info",
  },
  {
    title: "Personal Information",
    label: "Personal Information",
    component: PersonalInfoForm,
    key: "personal-info",
  },
  {
    title: "Work Experience",
    label: "Work Experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  {
    title: "Education",
    label: "Education",
    component: EducationalInfoForm,
    key: "education",
  },
  {
    title: "Projects",
    label: "Projects",
    component: ProjectInfoForm,
    key: "projects",
  },
  {
    title: "Skills",
    label: "Skills",
    component: SkillsInfoForm,
    key: "skills",
  },
  {
    title: "Summary",
    label: "Summary",
    component: SummaryInfoForm,
    key: "summary",
  },
]

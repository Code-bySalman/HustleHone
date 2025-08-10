"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema, ResumeValues, ProjectValues } from "@/lib/validation"
import { EditorFormProps } from "@/lib/type"
import { Button } from "@/components/ui/button"
import { GripHorizontal } from "lucide-react"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import GenerateProjectButton from "./GenerateProjectButton"

export default function ProjectInfoForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projects: resumeData.projects || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects"
  })

  const { watch, getValues, setValue } = form

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = fields.findIndex((f) => f.id === active.id)
    const newIndex = fields.findIndex((f) => f.id === over.id)

    const current = getValues("projects") ?? []
const reordered = arrayMove(current, oldIndex, newIndex)
setValue("projects", reordered)


    setValue("projects", reordered)
  }

  useEffect(() => {
    const subscription = watch((values) => {
      const updatedProjects = values.projects?.filter((p) => p !== undefined) || []

      const updated: ResumeValues = {
        ...resumeData,
        projects: updatedProjects,
        photo: resumeData.photo ?? null
      }

      setResumeData(updated)
    })

    return () => subscription.unsubscribe()
  }, [watch, resumeData, setResumeData])

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-sm text-muted-foreground">Add projects you’ve built or worked on</p>
      </div>

      <Form {...form}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {fields.map((field, index) => (
              <ProjectItem
                id={field.id}
                key={field.id}
                index={index}
                form={form}
                remove={remove}
              />
            ))}
          </SortableContext>
        </DndContext>

        <div className="flex justify-center">
          <Button
            className="bg-black text-white dark:bg-white dark:text-black hover:bg-black"
            type="button"
            onClick={() =>
              append({
                title: "",
                description: "",
                techStack: "",
                link: ""
              })
            }
          >
            Add project
          </Button>
        </div>
      </Form>
    </div>
  )
}

interface ProjectItemProps {
  id: string
  form: UseFormReturn<ProjectValues>
  index: number
  remove: (index: number) => void
}

function ProjectItem({ id, form, index, remove }: ProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  return (
    <div
      className={cn(
        "space-y-3 p-4 rounded-2xl border shadow-md transition-all",
        "bg-white border-gray-200 shadow-gray-300",
        "dark:bg-[#0a0a0a] dark:border-[#2a2a2a] dark:shadow-black/30",
        isDragging && "shadow-xl z-[999] cursor-grabbing"
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Project {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      <div className="flex justify-center">
        <GenerateProjectButton
          onProjectGenerated={(project) => form.setValue(`projects.${index}`, project)}
        />
      </div>

      <FormField
        control={form.control}
        name={`projects.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Title</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`projects.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`projects.${index}.techStack`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tech Stack</FormLabel>
            <FormControl>
              <Input {...field} placeholder="React, Node.js, MongoDB" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`projects.${index}.link`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Link (optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://github.com/..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        className="bg-black text-white dark:bg-white dark:text-black hover:bg-black"
        variant="destructive"
        type="button"
        onClick={() => remove(index)}
      >
        Delete Project
      </Button>
    </div>
  )
}

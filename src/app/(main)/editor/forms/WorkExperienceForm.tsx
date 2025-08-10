import { useEffect, useState } from "react"
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EditorFormProps } from "@/lib/type"
import { workExperienceSchema, WorkExperienceValues, ResumeValues } from "@/lib/validation"
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
import GenerateWorExperienceButton from "./GenerateWorkExperienceButton"

export default function WorkExperienceForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: resumeData.workExperiences || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperiences"
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

    const oldIndex = fields.findIndex((field) => field.id === active.id)
    const newIndex = fields.findIndex((field) => field.id === over.id)

    const current = getValues("workExperiences")??[]
    const reordered = arrayMove(current, oldIndex, newIndex)

    setValue("workExperiences", reordered)
  }

  useEffect(() => {
    const subscription = watch((values) => {
      const updatedExperiences = values.workExperiences?.filter((exp) => exp !== undefined) || []

      const fullResume: ResumeValues = {
        ...resumeData,
        workExperiences: updatedExperiences,
        photo: resumeData.photo ?? null
      }

      setResumeData(fullResume)
    })

    return () => subscription.unsubscribe()
  }, [watch, resumeData, setResumeData])

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        <p className="text-sm text-muted-foreground">Add your work experiences</p>
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
              <WorkExperienceItem
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
                position: "",
                company: "",
                startDate: "",
                endDate: "",
                description: ""
              })
            }
          >
            Add work experience
          </Button>
        </div>
      </Form>
    </div>
  )
}

interface WorkExperienceItemProps {
  id: string
  form: UseFormReturn<WorkExperienceValues>
  index: number
  remove: (index: number) => void
}

function WorkExperienceItem({ id, form, index, remove }: WorkExperienceItemProps) {
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
        "bg-white border-gray-200 shadow-gray-300", // light mode
        "dark:bg-[#0a0a0a] dark:border-[#2a2a2a] dark:shadow-black/30", // dark mode
        isDragging && "shadow-xl z-[999] cursor-grabbing"
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Work Experience {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>
       <div className="flex justify-center">
      <GenerateWorExperienceButton
  
      onWorkExperienceGenerated={exp=>form.setValue(`workExperiences.${index}`, exp)}
      />
       </div>
      <FormField
        control={form.control}
        name={`workExperiences.${index}.position`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`workExperiences.${index}.company`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name of the company/organisation</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`workExperiences.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting date</FormLabel>
              <FormControl>
                <Input {...field} type="date" value={field.value?.slice(0, 10)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`workExperiences.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ending date</FormLabel>
              <FormControl>
                <Input {...field} type="date" value={field.value?.slice(0, 10)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormDescription>
        Leave <span className="font-semibold">end date</span> empty if you're still working there.
      </FormDescription>

      <FormField
        control={form.control}
        name={`workExperiences.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description of your work and experiences</FormLabel>
            <FormControl>
              <Textarea {...field} />
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
        Delete Experience
      </Button>
    </div>
  )
}

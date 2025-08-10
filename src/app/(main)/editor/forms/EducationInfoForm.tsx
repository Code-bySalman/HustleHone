import { EditorFormProps } from "@/lib/type"
import { educationSchema, EducationValues, ResumeValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, useFieldArray, UseFormReturn, FormProvider } from "react-hook-form"
import { GripHorizontal } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"

export default function EducationalInfoForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: resumeData.educations || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations"
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const from = fields.findIndex(f => f.id === active.id)
    const to = fields.findIndex(f => f.id === over.id)

   const updated = arrayMove(form.getValues("educations") || [], from, to)

    form.setValue("educations", updated, { shouldDirty: true })
  }

  useEffect(() => {
    const subscription = form.watch((values) => {
      const educations = values.educations?.filter(edu => edu !== undefined) || []

      const fullResume: ResumeValues = {
        ...resumeData,
        educations,
        photo: resumeData.photo ?? null
      }

      setResumeData(fullResume)
    })

    return () => subscription.unsubscribe()
  }, [form, resumeData, setResumeData])

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Educations</h2>
        <p className="text-sm text-muted-foreground">Add your education</p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <EducationItem
                  key={field.id}
                  id={field.id}
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
                  degree: "",
                  college: "",
                  school: "",
                  startDate: "",
                  endDate: ""
                })
              }
            >
              Add your education
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

interface EducationItemProps {
  id: string
  form: UseFormReturn<EducationValues>
  index: number
  remove: (index: number) => void
}

function EducationItem({ id, form, index, remove }: EducationItemProps) {
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
        <span className="font-semibold">Education {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      <FormField
        control={form.control}
        name={`educations.${index}.degree`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter your degree</FormLabel>
            <FormControl>
              <Input placeholder="e.g. BSc Computer Science" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`educations.${index}.college`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter your college name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Harvard University" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`educations.${index}.school`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter your school name (optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Lincoln High School" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`educations.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting date</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value?.slice(0, 10)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`educations.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ending date</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value?.slice(0, 10)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Button
        className="bg-black text-white dark:bg-white dark:text-black hover:bg-black"
        variant="destructive"
        type="button"
        onClick={() => remove(index)}
      >
        Delete Education
      </Button>
    </div>
  )
}

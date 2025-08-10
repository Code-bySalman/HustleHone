'use client'

import { EditorFormProps } from "@/lib/type"
import { SkillValues, skillsSchema, ResumeValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

export default function SkillsInfoForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<SkillValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resumeData.skills || []
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      const updatedSkills = values.skills
        ?.filter(skill => skill !== undefined)
        .map(skill => skill.trim())
        .filter(skill => skill !== "") || []

      const fullResume: ResumeValues = {
        ...resumeData,
        skills: updatedSkills,
        photo: resumeData.photo ?? null
      }

      setResumeData(fullResume)
    })

    return () => subscription.unsubscribe()
  }, [form, resumeData, setResumeData])

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">What are you good at?</p>
      </div>

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Skills</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="e.g. React.js, Node.js, GraphQL"
                      onChange={(e)=>{
                        const skills = e.target.value.split(",");
                        field.onChange(skills);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Seperate each skill with a comma ","
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </FormProvider>
    </div>
  )
}

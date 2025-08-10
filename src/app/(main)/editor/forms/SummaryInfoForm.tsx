import { EditorFormProps } from "@/lib/type"
import { ResumeValues, summarySchema, SummaryValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import GenerateAISummaryButton from "./GenerateAISummaryButton"

export default function SummaryInfoForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || ""
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      const fullResume: ResumeValues = {
        ...resumeData,
        ...values
      }
      setResumeData(fullResume)
    })

    return () => subscription.unsubscribe()
  }, [form, resumeData, setResumeData])

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="font-semibold text-2xl">Professional summary</h2>
        <p className="text-sm text-muted-foreground">
          Write a short summary about yourself... or let AI do it for you 😉
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Professional Summary</FormLabel>
                <FormControl>
                  <Textarea placeholder="I’m a full-stack dev who loves solving real problems..." {...field} />
                </FormControl>
                <FormMessage />
                <GenerateAISummaryButton
                resumeData={resumeData}
                onSummaryGenerated={summary => form.setValue("summary", summary)}
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

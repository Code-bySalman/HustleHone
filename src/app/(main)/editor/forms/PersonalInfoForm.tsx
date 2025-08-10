"use client"

import { useForm } from "react-hook-form"
import { ResumeValues } from "@/lib/validation"
import { useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import {
  personalInfoSchema,
  PersonalInfoValue
} from "@/lib/validation"
import { EditorFormProps } from "@/lib/type"
import { Button } from "@/components/ui/button"

export default function PersonalInfoForm({ resumeData, setResumeData }: EditorFormProps) {
  const storedResumeData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("resumeData") || "{}")
      : {}

  const form = useForm<PersonalInfoValue>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      photo: undefined,
      firstName: resumeData.firstName || storedResumeData.firstName || "",
      lastName: resumeData.lastName || storedResumeData.lastName || "",
      email: resumeData.email || storedResumeData.email || "",
      phone: resumeData.phone || storedResumeData.phone || "",
      jobTitle: resumeData.jobTitle || storedResumeData.jobTitle || "",
      city: resumeData.city || storedResumeData.city || "",
      country: resumeData.country || storedResumeData.country || "",
      github: resumeData.github || storedResumeData.github || "",
      linkedin: resumeData.linkedin || storedResumeData.linkedin || ""
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      const fullResume: ResumeValues = {
        firstName: values.firstName || "",
        lastName: values.lastName || "",
        email: values.email || "",
        phone: values.phone || "",
        jobTitle: values.jobTitle || "",
        city: values.city || "",
        country: values.country || "",
        github: values.github || "",
        linkedin: values.linkedin || "",
        photo: values.photo || null
      }

      localStorage.setItem("resumeData", JSON.stringify(fullResume))
      setResumeData(fullResume)
    })

    return () => subscription.unsubscribe()
  }, [form, setResumeData])

const  photoInputRef =  useRef<HTMLInputElement>(null);

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="photo"
          render={({ field: { value, ...fieldProps } }) => (
            <FormItem>
              <Label>Your Photo</Label>
              <div className="flex items-center gap-2">
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    fieldProps.onChange(file)
                    form.setValue("photo", file)
                    form.trigger("photo")
                  }}
                  ref={photoInputRef}
                />
              </FormControl>
              <Button variant="secondary"
              type="button"
              onClick={()=>{
                fieldProps.onChange(null)
                if (photoInputRef.current) {
                  photoInputRef.current.value = ""
                }
              }}
              >
            Remove
              </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <Label>First Name</Label>
                <FormControl>
                  <Input {...field} placeholder="John" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <Label>Last Name</Label>
                <FormControl>
                  <Input {...field} placeholder="Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <Label>City</Label>
                <FormControl>
                  <Input {...field} placeholder="New Delhi" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <Label>Country</Label>
                <FormControl>
                  <Input {...field} placeholder="India" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
<div className="grid grid-cols-1 gap-4">
  <FormField
    control={form.control}
    name="phone"
    render={({ field }) => (
      <FormItem>
        <Label>Contact Number</Label>
        <FormControl>
          <Input {...field} type="tel" placeholder="+91 - 9876543210" />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <Label>Mail Address</Label>
        <FormControl>
          <Input {...field} type="email" placeholder="johndoe12@gmail.com" />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>


       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <FormField
    control={form.control}
    name="linkedin"
    render={({ field }) => (
      <FormItem>
        <Label className="flex items-center gap-2">
          <FaLinkedinIn className="text-lg text-blue-600" />
          LinkedIn
        </Label>
        <FormControl>
          <Input {...field} type="url" placeholder="https://linkedin.com/in/yourusername" />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    control={form.control}
    name="github"
    render={({ field }) => (
      <FormItem>
        <Label className="flex items-center gap-2">
          <FaGithub className="text-lg" />
          GitHub
        </Label>
        <FormControl>
          <Input {...field} type="url" placeholder="https://github.com/yourusername" />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>

      </form>
    </Form>
  )
}

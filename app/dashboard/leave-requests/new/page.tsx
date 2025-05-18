"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Paperclip, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const leaveTypes = [
  { id: "annual", name: "Annual Leave", balance: 7 },
  { id: "sick", name: "Sick Leave", balance: 30 },
  { id: "personal", name: "Personal Leave", balance: 14 },
  { id: "public", name: "Public Holiday", balance: 5 },
]

const proxyPersons = [
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Smith" },
  { id: "3", name: "Carol Williams" },
  { id: "4", name: "David Brown" },
]

const formSchema = z.object({
  leaveType: z.string({
    required_error: "Please select a leave type",
  }),
  dateRange: z.object({
    from: z.date({
      required_error: "Start date is required",
    }),
    to: z.date({
      required_error: "End date is required",
    }),
  }),
  reason: z.string().min(5, {
    message: "Reason must be at least 5 characters",
  }),
  proxyPerson: z.string({
    required_error: "Please select a proxy person",
  }),
  attachment: z.any().optional(),
})

export default function NewLeaveRequestPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, you would submit the form data to your API
    console.log(values)

    toast("Leave request submitted", {
      description: "Your leave request has been submitted successfully.",
    })

    router.push("/leave-requests")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Leave Request</h1>
        <p className="text-muted-foreground">Fill out the form below to submit a new leave request.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Request Form</CardTitle>
          <CardDescription>Please provide all required information for your leave request.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="leaveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} ({type.balance} days available)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the type of leave you want to request.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Range</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Select date range</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="range" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Select the start and end dates for your leave.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a reason for your leave request"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Briefly explain the reason for your leave request.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proxyPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proxy Person</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select proxy person" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {proxyPersons.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a colleague who will handle your responsibilities during your absence.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachments</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Input type="file" id="file-upload" className="hidden" onChange={handleFileChange} multiple />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("file-upload")?.click()}
                          >
                            <Paperclip className="mr-2 h-4 w-4" />
                            Attach Files
                          </Button>
                        </div>

                        {files.length > 0 && (
                          <div className="space-y-2">
                            {files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between rounded-md border p-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Paperclip className="h-4 w-4" />
                                  <span>{file.name}</span>
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Attach any relevant documents (required for public holiday requests).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.push("/leave-requests")}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Paperclip, X } from "lucide-react"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { getTeamMembers, type TeamMember } from "@/lib/services/team"
import { type LeaveType, getLeaveTypes } from "@/lib/services/leave-type"
import { createLeaveRequest } from "@/lib/services/leave-request"
import { getMyLeaveBalance, type LeaveBalanceItem } from "@/lib/services/leave-balance"

const formSchema = z.object({
  leaveType: z.string({
    required_error: "請選擇假別",
  }),
  dateRange: z.object({
    from: z.date({
      required_error: "請選擇開始日期",
    }),
    to: z.date({
      required_error: "請選擇結束日期",
    }),
  }),
  reason: z.string().optional(),
  proxyPerson: z.string({
    required_error: "請選擇代理人",
  }),
  attachment: z.any().optional(),
})

export default function NewLeaveRequestPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceItem[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
    mode: "onChange",
  })

  // 檢查表單是否已完整填寫
  const isFormValid = form.formState.isValid
  const formErrors = form.formState.errors

  // 獲取未填寫的必填欄位
  const getMissingFields = () => {
    const missingFields = []
    if (!form.getValues("leaveType")) missingFields.push("假別")
    if (!form.getValues("dateRange.from")) missingFields.push("開始日期")
    if (!form.getValues("dateRange.to")) missingFields.push("結束日期")
    if (!form.getValues("proxyPerson")) missingFields.push("代理人")
    return missingFields
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, members, balance] = await Promise.all([
          getLeaveTypes(),
          getTeamMembers(),
          getMyLeaveBalance(),
        ])
        setLeaveTypes(types)
        setTeamMembers(members)
        setLeaveBalances(balance.balances)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error("載入資料失敗", {
          description: "請重新整理頁面再試一次",
        })
      }
    }
    fetchData()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const data = {
        leave_type_id: parseInt(values.leaveType),
        start_date: format(values.dateRange.from, 'yyyy-MM-dd'),
        end_date: format(values.dateRange.to, 'yyyy-MM-dd'),
        reason: values.reason,
        proxy_user_id: parseInt(values.proxyPerson),
      }

      await createLeaveRequest(data)

      toast.success("請假申請已送出", {
        description: "您的請假申請已成功送出。",
      })

      router.push("/dashboard/leave-requests")
    } catch (error) {
      console.error('Failed to submit leave request:', error)
      toast.error("送出申請失敗", {
        description: "請稍後再試一次",
      })
    } finally {
      setIsSubmitting(false)
    }
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

  // 處理送出按鈕點擊
  const handleSubmitClick = () => {
    if (!isFormValid) {
      // 觸發所有欄位的驗證
      form.trigger()
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">請假申請</h1>
        <p className="text-muted-foreground">請填寫以下表單以提交新的請假申請。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>請假申請表</CardTitle>
          <CardDescription>請提供所有必要的請假資訊。</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="leaveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>假別</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      onOpenChange={(open) => {
                        if (!open && !field.value) {
                          form.trigger("leaveType")
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇假別" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leaveTypes
                          .filter(type => {
                            const balance = leaveBalances.find(b => b.leave_type.id === type.id)
                            return balance && balance.remaining_days > 0
                          })
                          .map((type) => {
                            const balance = leaveBalances.find(b => b.leave_type.id === type.id)
                            return (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.name} (剩餘 {balance?.remaining_days} 天)
                              </SelectItem>
                            )
                          })}
                      </SelectContent>
                    </Select>
                    <FormDescription>請選擇您要申請的假別類型。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>請假期間</FormLabel>
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
                                  {format(field.value.from, "yyyy/MM/dd")} - {format(field.value.to, "yyyy/MM/dd")}
                                </>
                              ) : (
                                format(field.value.from, "yyyy/MM/dd")
                              )
                            ) : (
                              <span>選擇日期範圍</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="range" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>請選擇請假的起始與結束日期。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>請假事由</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="請說明請假原因"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>請簡要說明您的請假原因。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proxyPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>代理人</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      onOpenChange={(open) => {
                        if (!open && !field.value) {
                          form.trigger("proxyPerson")
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇代理人" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMembers.map((person) => (
                          <SelectItem key={person.id} value={person.id.toString()}>
                            {person.first_name} {person.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      請選擇在您請假期間可以處理您工作的同事。
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
                    <FormLabel>附件</FormLabel>
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
                            上傳附件
                          </Button>
                        </div>

                        {files.length > 0 && (
                          <div className="space-y-2">
                            {files.map((file, index) => (
                              <div key={`file-${index}`} className="flex items-center justify-between rounded-md border p-2">
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
                      上傳相關文件（國定假日申請必須附上證明文件）。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/dashboard/leave-requests")}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !isFormValid}
                  className={!isFormValid ? "opacity-50" : ""}
                  onClick={handleSubmitClick}
                >
                  {isSubmitting ? "送出中..." : "送出申請"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

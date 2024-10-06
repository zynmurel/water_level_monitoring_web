"use client"

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from '@/hooks/use-toast'

// Schema for Admin settings
const adminSettingsSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters.').max(30, 'Username must not exceed 30 characters.'),
  name: z.string().min(1, 'Name is required.'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword || data.confirmPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AdminSettingsFormValues = z.infer<typeof adminSettingsSchema>

const initialData = {
  username: "johndoe",
  name: "John Doe",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

export default function ContributorSetting() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const form = useForm<AdminSettingsFormValues>({
    resolver: zodResolver(adminSettingsSchema),
    defaultValues: initialData,
  })

  async function onSubmit(data: AdminSettingsFormValues) {
    try {
      setIsLoading(true)
      // await updateUserSetting(data);
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "Settings updated",
          description: "Your settings have been successfully updated.",
        })
        // Reset form fields
        if (data.newPassword) {
          form.reset({ ...data, currentPassword: "", newPassword: "", confirmPassword: "" })
        }
      }, 2000)
    } catch (error) {
      // Handle error (optional)
    }
  }

  useEffect(() => {
      const fetchUserSetting = async () =>  {
       try {
        // const {data} = await getUserSetting({}) as unknown as any;
        // const userData: UserType = data;
        // form.setValue('name', userData.name)
        // form.setValue('username', userData.username)
       } catch (error) {
        console.log(error)
       }
      }
      fetchUserSetting()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
        <CardDescription>
          Update your profile information and password here. Click save when you're done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-8" />
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password (Optional)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { loginAdmin } from "@/lib/api-helper/auth";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.enum(["admin"]),
});

export function LoginCard() {
  const [loginLoading, setLoginLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "admin",
    },
  });

  const handleSubmit = async ({
    username,
    password,
    role,
  }: {
    username: string;
    password: string;
    role: "admin";
  }) => {
    const data = await loginAdmin({
      username,
      password,
      role,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (data.status === 200) {
      window.location.href = "/";
    } else {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please input correct credentials.",
      });
    }
    return data;
  };
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoginLoading(true);
      return await handleSubmit({
        username: data.username,
        password: data.password,
        role: "admin",
      })
        .then((data) => {
          if (data.status === 200) {
            toast({
              title: "Success login",
              description: "Welcome user.",
            });
            window.location.href = "/";
          }
        })
        .finally(() => {
          setLoginLoading(false);
        });
    } catch (e) {
      console.log(e);
      setLoginLoading(false);
      toast({
        variant: "destructive",
        title: "User not found",
        description: "Please input correct credentials.",
      });
    }
  }

  return (
    <Card className="m-1 w-full rounded-xl px-1 sm:m-5 sm:p-2 sm:px-7 md:w-[450px] lg:w-[450px]">
      <CardHeader className="text-center">
        <CardTitle className="mt-4 text-3xl font-bold">LOGIN</CardTitle>
        <CardDescription className="text-base">{`Login as an administrator of Water Level Monitoring System.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Input username" {...field} />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Input password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5" />
                </FormItem>
              )}
            />
            <div className="py-5">
              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full text-lg"
              >
                Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

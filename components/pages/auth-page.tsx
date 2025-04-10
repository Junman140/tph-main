"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock schema for preview
const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
})

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const { user, loginMutation, registerMutation } = useAuth()

  useEffect(() => {
    if (user) router.push("/")

    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
    }
  }, [user, router, searchParams])

  const loginForm = useForm({
    resolver: zodResolver(userSchema.omit({ fullName: true })),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const registerForm = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
    },
  })

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to TPH Global</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={loginMutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} disabled={loginMutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                      Login
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={registerMutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={registerMutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} disabled={registerMutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                      Register
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="hidden md:flex bg-primary items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-6">Step Into Your Destiny</h1>
          <p className="text-xl mb-4">The House Where Generals Are Forged</p>
          <p className="mb-6">
            Join our growing community of Kingdom generals dedicated to loyalty, holiness, and Anakazo empowerment.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Loyalty</h3>
              <p className="text-sm">Cultivate unwavering faithfulness to God's principles</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Holiness</h3>
              <p className="text-sm">Pursue Christ-like character in all aspects of life</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


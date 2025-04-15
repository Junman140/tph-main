"use server"

import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/layout/main-nav"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default async function AdminBlogPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <Button asChild>
            <Link href="/admin/blog/new">Create New Post</Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {/* We'll add the blog post list here once we connect to Supabase */}
          <Card className="p-6">
            <p className="text-muted-foreground">
              To add blog posts:
            </p>
            <ol className="list-decimal ml-4 mt-2 space-y-2">
              <li>Click "Create New Post" above</li>
              <li>Fill in the title, content, and tags</li>
              <li>Save as draft or publish directly</li>
              <li>Posts will appear on the blog page once published</li>
            </ol>
          </Card>
        </div>
      </main>
    </div>
  )
} 
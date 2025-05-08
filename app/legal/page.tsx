"use client"

import { MainNav } from "@/components/layout/main-nav"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function LegalPage() {
  const legalDocuments = [
    {
      title: "Privacy Policy",
      description: "Learn how we collect, use, and protect your personal information.",
      href: "/legal/privacy-policy"
    },
    {
      title: "Terms of Use",
      description: "The rules and guidelines for using our website and services.",
      href: "/legal/terms-of-use"
    },
    {
      title: "Disclaimer",
      description: "Important information about the limitations of our content and services.",
      href: "/legal/disclaimer"
    },
    {
      title: "Cookie Policy",
      description: "How we use cookies and similar technologies on our website.",
      href: "/legal/cookie-policy"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Legal Information</h1>
          <p className="text-muted-foreground mb-8">
            Important legal documents and policies for The Peculiar House Global
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legalDocuments.map((doc, index) => (
              <Link key={index} href={doc.href}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{doc.title}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary">
                      Read more <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p>
              If you have any questions about our legal policies, please contact us at:
            </p>
            <p className="mt-2 font-medium">
              Email: thepeculiarhouseglobal@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

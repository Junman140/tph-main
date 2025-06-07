'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to TPH Global</CardTitle>
          <CardDescription>
            Our church website is now open to the public
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Welcome Home
            We’re so glad you’re here.
            At TPH Global, you’re not just a visitor, you’re family.
            This is a place to grow, to heal, and to belong.
            Come as you are.
            You’ve found home.
          </p>
          <div className="flex justify-center pt-4">
            <Button asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
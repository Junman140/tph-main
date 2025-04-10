import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Coming Soon</h1>
        <p className="text-muted-foreground">We&apos;re working hard to bring you something amazing.</p>
        <p className="text-sm text-muted-foreground">Stay tuned!</p>
      </div>
    </div>
  );
} 
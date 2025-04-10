import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function ComingSoon() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Clock className="h-6 w-6" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-muted-foreground">
            We're working hard to bring you this feature. Please check back later! <br /> God Bless You!
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
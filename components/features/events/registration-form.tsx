"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  eventId: z.string().uuid("Invalid event ID"),
});

export function RegistrationForm({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, isLoaded: isAuthLoaded } = useUser();
  const supabase = useSupabaseClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.primaryEmailAddress?.emailAddress ?? "",
      phoneNumber: user?.primaryPhoneNumber?.phoneNumber ?? "",
      eventId: eventId,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName ?? "",
        email: user.primaryEmailAddress?.emailAddress ?? "",
        phoneNumber: user.primaryPhoneNumber?.phoneNumber ?? "",
        eventId: eventId,
      });
    }
  }, [user, eventId, form]);

  if (!isAuthLoaded) {
    return (
      <Button variant="outline" className="w-full" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (!user) {
    return (
      <Button variant="outline" className="w-full" onClick={() => window.location.href = '/sign-in'}>
        Sign In to Register
      </Button>
    );
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "Please sign in to register.", variant: "destructive" });
      return;
    }
    if (!supabase) {
      toast({ title: "Database Error", description: "Could not connect to the database.", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: values.eventId,
          user_id: user.id,
          status: 'registered',
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "You are already registered for this event.",
            variant: "default",
          });
          setShowSuccess(true);
          form.reset();
          setTimeout(() => {
            setIsOpen(false);
            setShowSuccess(false);
          }, 3000);
        } else {
          throw error;
        }
      } else if (data) {
        setShowSuccess(true);
        form.reset();
        toast({
          title: "Registration Successful!",
          description: "You have successfully registered for the event.",
        });
        setTimeout(() => {
          setIsOpen(false);
          setShowSuccess(false);
        }, 3000);
      } else {
        throw new Error("Registration data was unexpectedly null");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Register Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for {eventTitle}</DialogTitle>
          <DialogDescription>
            Fill out the form below to register for this event. We'll send you a confirmation email with more details.
          </DialogDescription>
        </DialogHeader>
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Registration Successful!</h3>
            <p className="text-muted-foreground text-center">
              Thank you for registering. We'll send you more details about the event soon.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} disabled={!!user?.fullName} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} disabled={!!user?.primaryEmailAddress?.emailAddress} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} disabled={!!user?.primaryPhoneNumber?.phoneNumber} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
} 
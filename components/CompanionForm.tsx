"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// import { createCompanion } from "@/lib/actions/companion.actions";

// Mock toast (replace with actual toast component if available)
const toast = {
  error: (message: string) => alert(`Error: ${message}`),
  success: (message: string) => alert(`Success: ${message}`),
};

// Constants
const subjects: string[] = ["math", "science", "history", "literature", "programming"];
const voices: string[] = ["male", "female"];
const styles: string[] = ["formal", "casual"];

const formSchema = z.object({
  name: z.string().min(1, { message: "Companion name is required." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  topic: z.string().min(1, { message: "Topic is required." }),
  voice: z.string().min(1, { message: "Voice is required." }),
  style: z.string().min(1, { message: "Style is required." }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 minute." })
    .max(120, { message: "Duration cannot exceed 120 minutes." }),
});
type CompanionFormValues = z.infer<typeof formSchema>;

const CompanionForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CompanionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: 15,
    },
  });

  const onSubmit = async (values: CompanionFormValues) => {
    try {
      setIsSubmitting(true);
      const companion = await createCompanion(values);
      if (companion) {
        toast.success("Companion created successfully!");
        form.reset();
        router.push(`/companions/${companion.id}`);
      } else {
        toast.error("Failed to create companion.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the companion.");
      console.error("Error creating companion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Companion name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the companion name"
                  {...field}
                  className="input"
                  aria-invalid={!!form.formState.errors.name}
                  aria-describedby="name-error"
                />
              </FormControl>
              <FormMessage id="name-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className="input capitalize"
                    aria-invalid={!!form.formState.errors.subject}
                    aria-describedby="subject-error"
                  >
                    <SelectValue placeholder="Select the subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        value={subject}
                        key={subject}
                        className="capitalize"
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage id="subject-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What should the companion help with?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex. Derivatives & Integrals"
                  {...field}
                  className="input"
                  rows={4}
                  aria-invalid={!!form.formState.errors.topic}
                  aria-describedby="topic-error"
                />
              </FormControl>
              <FormMessage id="topic-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className="input"
                    aria-invalid={!!form.formState.errors.voice}
                    aria-describedby="voice-error"
                  >
                    <SelectValue placeholder="Select the voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem value={voice} key={voice}>
                        {voice.charAt(0).toUpperCase() + voice.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage id="voice-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className="input"
                    aria-invalid={!!form.formState.errors.style}
                    aria-describedby="style-error"
                  >
                    <SelectValue placeholder="Select the style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((style) => (
                      <SelectItem value={style} key={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage id="style-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated session duration in minutes</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="15"
                  min={1}
                  max={120}
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="input"
                  aria-invalid={!!form.formState.errors.duration}
                  aria-describedby="duration-error"
                />
              </FormControl>
              <FormMessage id="duration-error" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Building..." : "Build Your Companion"}
        </Button>
      </form>
    </Form>
  );
};

export default CompanionForm;
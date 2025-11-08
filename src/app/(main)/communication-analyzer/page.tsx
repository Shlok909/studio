"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lightbulb, ThumbsDown, ThumbsUp, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getAnalysis } from "./actions";
import { Icons } from "@/components/icons";
import type { AnalyzeCommunicationOutput } from "@/ai/flows/analyze-communication-flow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters long." })
    .max(500, { message: "Message must be 500 characters or less." }),
});

function AnalysisResult({ analysis }: { analysis: AnalyzeCommunicationOutput }) {
  const feedbackItems = [
    {
      title: "Tone Feedback",
      content: analysis.toneFeedback,
      icon: ThumbsUp,
      color: "text-green-500",
    },
    {
      title: "Appropriateness Feedback",
      content: analysis.appropriatenessFeedback,
      icon: ThumbsDown,
      color: "text-red-500",
    },
    {
      title: "Misunderstanding Potential",
      content: analysis.misunderstandingPotential,
      icon: TriangleAlert,
      color: "text-yellow-500",
    },
    {
      title: "Suggested Improvements",
      content: analysis.suggestedImprovements,
      icon: Lightbulb,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="mt-8 space-y-6">
       <h2 className="text-2xl font-semibold tracking-tight text-center">Analysis Results</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {feedbackItems.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span>{item.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function CommunicationAnalyzerPage() {
  const [analysis, setAnalysis] = useState<AnalyzeCommunicationOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    const { data, error } = await getAnalysis(values);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else if (data) {
      setAnalysis(data);
    }
    setIsLoading(false);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
          Safe Communication Analyzer
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Type what you want to say and get instant feedback.
        </p>
      </div>

      {!analysis && (
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Hey, I had a great time with you. When are you free next?'"
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Our AI will analyze the tone, appropriateness, and clarity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Icons.spinner className="animate-spin" />
                  ) : (
                    "Analyze Message"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <Icons.spinner className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {analysis && !isLoading && (
        <div>
          <AnalysisResult analysis={analysis} />
          <Button
            onClick={() => {
              setAnalysis(null);
              form.reset();
            }}
            variant="outline"
            className="w-full mt-4"
          >
            Start Over
          </Button>
        </div>
      )}
    </div>
  );
}

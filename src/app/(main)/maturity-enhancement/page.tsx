"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getMaturitySuggestions } from "./actions";
import { Icons } from "@/components/icons";
import type { MaturitySuggestionsOutput } from "@/ai/flows/generate-maturity-suggestions-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";


const formSchema = z.object({
    communicationStyle: z.string().min(10, "Please provide more detail.").max(500, "Please keep it under 500 characters."),
    emotionalIntelligence: z.string().min(10, "Please provide more detail.").max(500, "Please keep it under 500 characters."),
    behaviorPatterns: z.string().min(10, "Please provide more detail.").max(500, "Please keep it under 500 characters."),
});

const questions = [
    { name: "communicationStyle", label: "Describe your communication style.", description: "e.g., Use of emojis, grammar, how you start conversations." },
    { name: "emotionalIntelligence", label: "How do you handle disagreements or boundaries?", description: "e.g., I get defensive, I try to understand, I avoid conflict." },
    { name: "behaviorPatterns", label: "Describe your reliability and responsibility.", description: "e.g., I'm always on time, I sometimes forget plans." },
] as const;

function SuggestionsResult({ suggestions }: { suggestions: MaturitySuggestionsOutput }) {
    const suggestionItems = [
        { title: "Communication Improvements", content: suggestions.communicationImprovements },
        { title: "Emotional Intelligence Tips", content: suggestions.emotionalIntelligenceTips },
        { title: "Deeper Conversation Suggestions", content: suggestions.conversationDepthSuggestions },
        { title: "Responsibility Demonstrations", content: suggestions.responsibilityDemonstrations },
        { title: "Personal Growth Recommendations", content: suggestions.personalGrowthRecommendations },
    ];

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Your Personalized Maturity Plan</CardTitle>
                <CardDescription>Here are some areas for growth. Take them one step at a time!</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                    {suggestionItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="font-semibold text-lg hover:no-underline text-left">{item.title}</AccordionTrigger>
                            <AccordionContent>
                                <p className="flex items-start gap-3 text-muted-foreground">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <span>{item.content}</span>
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}

export default function MaturityEnhancementPage() {
    const [suggestions, setSuggestions] = useState<MaturitySuggestionsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            communicationStyle: "",
            emotionalIntelligence: "",
            behaviorPatterns: "",
        },
      });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setSuggestions(null);
        const { data, error } = await getMaturitySuggestions(values);

        if (error) {
            toast({ title: "Error", description: error, variant: "destructive" });
        } else if (data) {
            setSuggestions(data);
        }
        setIsLoading(false);
    }
    
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-6">
                <Button asChild variant="ghost" className="pl-1">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
                </Button>
            </div>
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-headline">
                    Maturity Guide
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Discover personalized ways to grow and improve your relationship skills.
                </p>
            </div>
            
            {!suggestions && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Self-Reflection</CardTitle>
                        <CardDescription>Answer honestly to get the most helpful suggestions.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {questions.map((q) => (
                                    <FormField
                                        key={q.name}
                                        control={form.control}
                                        name={q.name}
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg">{q.label}</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Be honest with yourself..." className="min-h-[100px]" {...field} />
                                            </FormControl>
                                            <FormDescription>{q.description}</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                ))}
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? <Icons.spinner className="animate-spin" /> : "Get My Growth Plan"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                 </Card>
            )}

            {isLoading && !suggestions && (
                <div className="flex justify-center items-center mt-8">
                    <Icons.spinner className="w-8 h-8 animate-spin text-primary" />
                    <p className="ml-2">Generating your personalized plan...</p>
                </div>
            )}
            
            {suggestions && (
                <div>
                    <SuggestionsResult suggestions={suggestions} />
                     <Button onClick={() => {setSuggestions(null); form.reset()}} variant="outline" className="w-full mt-4">
                        Start Over
                    </Button>
                </div>
            )}

        </div>
    );
}

"use client";

import { useState } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getInterestLevel } from "./actions";
import { Icons } from "@/components/icons";
import type { AssessInterestLevelOutput } from "@/ai/flows/assess-interest-level-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, ThumbsDown, ThumbsUp } from "lucide-react";

const formSchema = z.object({
    frequencyOfInteraction: z.string().min(1, "This field is required."),
    bodyLanguageObserved: z.string().min(1, "This field is required."),
    responseTime: z.string().min(1, "This field is required."),
    conversationTopics: z.string().min(1, "This field is required."),
    personalInformationShared: z.string().min(1, "This field is required."),
    eyeContact: z.string().min(1, "This field is required."),
    smilingLaughingPatterns: z.string().min(1, "This field is required."),
    physicalProximityComfort: z.string().min(1, "This field is required."),
    mutualFriendInvolvement: z.string().min(1, "This field is required."),
  });

const questions = [
    { name: "frequencyOfInteraction", label: "How often do you interact?", placeholder: "e.g., Daily, a few times a week, rarely" },
    { name: "bodyLanguageObserved", label: "Describe their body language.", placeholder: "e.g., Leans in, fidgets, open posture", type: "textarea" },
    { name: "responseTime", label: "How quickly do they respond to messages?", placeholder: "e.g., Immediately, within a few hours, a day or more" },
    { name: "conversationTopics", label: "What topics do you talk about?", placeholder: "e.g., Deep personal topics, just small talk", type: "textarea" },
    { name: "personalInformationShared", label: "How much personal info have they shared?", placeholder: "e.g., A lot about their family, very little" },
    { name: "eyeContact", label: "Describe their eye contact.", placeholder: "e.g., Holds eye contact, avoids it, brief glances" },
    { name: "smilingLaughingPatterns", label: "How often do they smile or laugh?", placeholder: "e.g., Laughs at my jokes, smiles warmly" },
    { name: "physicalProximityComfort", label: "How comfortable are they with physical proximity?", placeholder: "e.g., Sits close, maintains distance" },
    { name: "mutualFriendInvolvement", label: "How do they act around mutual friends?", placeholder: "e.g., Tries to get my attention, treats me like anyone else" },
] as const;

function InterestResult({ result }: { result: AssessInterestLevelOutput }) {
    return (
        <Card className="mt-8">
            <CardHeader className="items-center">
                <CardTitle className="text-2xl">Interest Level Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <p className="text-muted-foreground">Likely Romantic Interest</p>
                    <p className="text-6xl font-bold text-primary">{result.interestLevel}%</p>
                    <Progress value={result.interestLevel} className="mt-2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg"><ThumbsUp className="text-green-500" /> Positive Indicators</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{result.positiveIndicators}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg"><ThumbsDown className="text-red-500" /> Negative Indicators</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{result.negativeIndicators}</p>
                        </CardContent>
                    </Card>
                </div>
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="text-blue-500"/> Recommended Next Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{result.nextStepsRecommendation}</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
}

export default function InterestDetectionPage() {
    const [result, setResult] = useState<AssessInterestLevelOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            frequencyOfInteraction: "",
            bodyLanguageObserved: "",
            responseTime: "",
            conversationTopics: "",
            personalInformationShared: "",
            eyeContact: "",
            smilingLaughingPatterns: "",
            physicalProximityComfort: "",
            mutualFriendInvolvement: "",
        },
      });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setResult(null);
        const { data, error } = await getInterestLevel(values);

        if (error) {
            toast({ title: "Error", description: error, variant: "destructive" });
        } else if (data) {
            setResult(data);
        }
        setIsLoading(false);
    }
    
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Interest-o-Meter
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                Answer a few questions to gauge their interest level.
                </p>
            </div>
            
            {!result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Interaction Questionnaire</CardTitle>
                        <CardDescription>Be as detailed as possible for the most accurate analysis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {questions.map((q) => (
                                    <FormField
                                        key={q.name}
                                        control={form.control}
                                        name={q.name}
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{q.label}</FormLabel>
                                            <FormControl>
                                                {q.type === 'textarea' ? (
                                                     <Textarea placeholder={q.placeholder} {...field} />
                                                ) : (
                                                    <Input placeholder={q.placeholder} {...field} />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                ))}
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? <Icons.spinner className="animate-spin" /> : "Analyze Interest"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

            {isLoading && !result && (
                <div className="flex justify-center items-center mt-8">
                    <Icons.spinner className="w-8 h-8 animate-spin text-primary" />
                    <p className="ml-2">Analyzing...</p>
                </div>
            )}
            
            {result && (
                <div>
                    <InterestResult result={result} />
                    <Button onClick={() => setResult(null)} variant="outline" className="w-full mt-4">
                        Start Over
                    </Button>
                </div>
            )}

        </div>
    );
}

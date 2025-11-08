"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CornerDownLeft, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { getCoaching } from "./actions";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  question: z.string().min(1, { message: "Message cannot be empty" }),
});

type Message = {
  role: "user" | "bot";
  content: React.ReactNode;
};

const initialMessages: Message[] = [
  {
    role: "bot",
    content: "Hello! I'm Mitra, your relationship guide. How can I help you today? Ask me anything about starting a conversation, keeping it going, or understanding social cues.",
  },
];


export default function ConversationCoachingPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: values.question }]);

    const { data, error } = await getCoaching({
      question: values.question,
      context: "User is asking for romantic conversation advice.",
    });

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } else if (data) {
      const botResponse = (
        <div className="space-y-4">
          <p>{data.advice}</p>
          <div>
            <h3 className="font-semibold mb-2">Conversation Starters:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {data.conversationStarters.map((starter, i) => (
                <li key={i}>{starter}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Tips for Meaningful Dialogue:</h3>
            <p className="text-muted-foreground">{data.tips}</p>
          </div>
        </div>
      );
      setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
      form.reset();
    }
    setIsLoading(false);
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
       <div className="text-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
          Conversation Coach
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your interactive guide to better conversations.
        </p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-4",
                    message.role === "user" ? "justify-end" : ""
                  )}
                >
                  {message.role === "bot" && (
                    <Avatar className="h-9 w-9 border border-primary/20">
                      <AvatarFallback>
                        <Icons.bot className="text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-md rounded-lg p-3 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                     <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        <Icons.user />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-4">
                    <Avatar className="h-9 w-9 border border-primary/20">
                      <AvatarFallback>
                        <Icons.bot className="text-primary" />
                      </AvatarFallback>
                    </Avatar>
                     <div className="max-w-md rounded-lg p-3 bg-muted flex items-center">
                        <Icons.spinner className="animate-spin w-5 h-5" />
                     </div>
                 </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative overflow-hidden rounded-lg border focus-within:ring-1 focus-within:ring-ring"
              >
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          id="message"
                          placeholder="Type your question here..."
                          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if(form.formState.isValid) form.handleSubmit(onSubmit)();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage className="p-3" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center p-3 pt-0">
                  <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={isLoading}>
                    Send Message
                    <CornerDownLeft className="size-3.5" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

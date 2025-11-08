
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getCoaching } from "./actions";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  question: z.string().min(1),
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
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const { watch, setValue } = form;
  const question = watch("question");

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTo({
        top: scrollAreaViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.question.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: values.question }]);
    setValue("question", "");

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
      setMessages((prev) => [...prev, { role: 'bot', content: 'Sorry, I had trouble getting a response. Please try again.' }]);
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
    }
    setIsLoading(false);
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
          Conversation Coach
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your interactive guide to better conversations.
        </p>
      </div>

      <Card className="flex-1 flex flex-col mt-4 border-primary/20">
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1" viewportRef={scrollAreaViewportRef}>
            <div className="p-4 sm:p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" ? "justify-end" : ""
                  )}
                >
                  {message.role === "bot" && (
                    <Avatar className="h-9 w-9 border border-primary/20 flex-shrink-0">
                      <AvatarFallback>
                        <Icons.bot className="text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-lg rounded-lg p-3 text-sm shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                     <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarFallback>
                        <Icons.user />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 border border-primary/20">
                      <AvatarFallback>
                        <Icons.bot className="text-primary" />
                      </AvatarFallback>
                    </Avatar>
                     <div className="max-w-md rounded-lg p-3 bg-muted flex items-center shadow-sm">
                        <Icons.spinner className="animate-spin w-5 h-5 text-primary" />
                     </div>
                 </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-background">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative"
              >
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          id="message"
                          placeholder="Ask me how to start a conversation..."
                          className="min-h-12 resize-none border-input pr-16 shadow-sm"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if(form.formState.isValid) form.handleSubmit(onSubmit)();
                            }
                          }}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="absolute -top-8 right-0 text-xs" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300",
                    question.trim() ? "scale-100" : "scale-0"
                    )}
                  disabled={isLoading || !question.trim()}
                  aria-label="Send Message"
                >
                  <SendHorizontal className="size-5" />
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const guideSteps = [
  {
    title: "Step 1: Pre-Approach Confidence Building",
    content: [
      "Practice positive self-talk. Remind yourself of your good qualities.",
      "Dress in a way that makes you feel comfortable and confident.",
      "Visualize a successful and positive interaction.",
      "Remember that your value doesn't depend on their reaction.",
    ],
  },
  {
    title: "Step 2: Body Language & First Impressions",
    content: [
      "Maintain open body language: uncrossed arms, stand tall.",
      "Make gentle eye contact to show you're engaged.",
      "Offer a warm, genuine smile. It's welcoming and disarming.",
      "Pay attention to your posture. Confidence is often silent.",
    ],
  },
  {
    title: "Step 3: Conversation Starters",
    content: [
      "At a coffee shop: 'That looks good, what did you order?' or compliment their choice.",
      "In college/class: 'What did you think of that lecture?' or ask about a shared assignment.",
      "At a social event: 'How do you know the host?' or comment on the music/venue.",
      "Online: Comment on something specific from their profile that you found interesting, not just 'hey'.",
    ],
  },
  {
    title: "Step 4: How to Read Initial Reactions",
    content: [
      "Positive signs: They smile back, make eye contact, turn their body towards you, ask you questions.",
      "Neutral/Negative signs: They give short, one-word answers, avoid eye contact, seem distracted, or angle their body away.",
      "Don't jump to conclusions. They might just be shy or having a bad day.",
    ],
  },
  {
    title: "Step 5: Graceful Handling of Rejection",
    content: [
      "If they seem uninterested, respect their space.",
      "End the conversation politely: 'Well, it was nice meeting you. Have a great day!'",
      "Don't take it personally. There are countless reasons for rejection, many of which have nothing to do with you.",
      "Be proud that you had the courage to try. That's a win in itself.",
    ],
  },
];

export default function ApproachGuidePage() {
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
          The Approach Guide
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your step-by-step companion for making a confident first move.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Building Confidence & Making Connections</CardTitle>
          <CardDescription>
            Follow these steps to approach someone new with poise and grace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {guideSteps.map((step, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="font-semibold text-lg hover:no-underline text-left">
                  {step.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pl-2">
                    {step.content.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

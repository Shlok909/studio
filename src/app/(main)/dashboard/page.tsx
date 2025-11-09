
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Conversation Coach",
    description: "Break the ice and keep convos going with our AI chat guide.",
    href: "/conversation-coaching",
    icon: Icons.conversation,
    imageId: "conversation-coaching",
    variant: "destructive",
  },
  {
    title: "Approach Guide",
    description: "Your step-by-step playbook for making a confident first move.",
    href: "/approach-guide",
    icon: Icons.approach,
    imageId: "approach-guide",
  },
  {
    title: "Interest-o-Meter",
    description: "Find out if they're into you by analyzing your interactions.",
    href: "/interest-detection",
    icon: Icons.interest,
    imageId: "interest-detection",
  },
  {
    title: "Maturity Guide",
    description:
      "Level up your relationship game with personalized maturity tips.",
    href: "/maturity-enhancement",
    icon: Icons.maturity,
    imageId: "maturity-enhancement",
  },
  {
    title: "Safe Communication Analyzer",
    description: "Get instant feedback on your messages before you send them.",
    href: "/communication-analyzer",
    icon: Icons.analyzer,
    imageId: "communication-analyzer",
  },
];

export default function DashboardPage() {
  const getImage = (id: string) =>
    PlaceHolderImages.find((img) => img.id === id);

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="text-center flex flex-col items-center gap-4">
        <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          Your AI Relationship Wingman
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
          Build Confidence, Not Just Connections
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-primary/90">
          Welcome to MitraAI! Stuck on what to say? Not sure if they're
          interested? We've got your back. Get AI-powered advice to navigate
          your dating life with ease.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="#features">
            Start a Conversation <Icons.heartQuestion className="ml-2" />
          </Link>
        </Button>
      </div>

      <div id="features" className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 scroll-mt-20">
        {features.map((feature) => {
          const image = getImage(feature.imageId);
          return (
            <Card
              key={feature.href}
              className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
            >
              {image && (
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={600}
                    height={338}
                    className="object-cover w-full h-full"
                    data-ai-hint={image.imageHint}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span>{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
              <CardFooter className="mt-auto bg-muted/50 p-4">
                <Button
                  asChild
                  variant='destructive'
                  className="w-full"
                >
                  <Link href={feature.href}>
                    Check it out <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

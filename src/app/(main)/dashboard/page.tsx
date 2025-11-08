import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Icons } from "@/components/icons";

const features = [
  {
    title: "Conversation Coach",
    description: "Get real-time advice on what to say and how to say it.",
    href: "/conversation-coaching",
    icon: Icons.conversation,
    imageId: "conversation-coaching",
  },
  {
    title: "Approach Guide",
    description: "Step-by-step guidance for making a great first impression.",
    href: "/approach-guide",
    icon: Icons.approach,
    imageId: "approach-guide",
  },
  {
    title: "Interest-o-Meter",
    description: "Analyze interactions to see if they're interested in you.",
    href: "/interest-detection",
    icon: Icons.interest,
    imageId: "interest-detection",
  },
  {
    title: "Maturity Guide",
    description: "Get personalized tips to enhance your emotional maturity.",
    href: "/maturity-enhancement",
    icon: Icons.maturity,
    imageId: "maturity-enhancement",
  },
];

export default function DashboardPage() {
  const getImage = (id: string) =>
    PlaceHolderImages.find((img) => img.id === id);

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
          Welcome to MitraAI
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your personal AI guide to navigating relationships with confidence.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => {
          const image = getImage(feature.imageId);
          return (
            <Card key={feature.href} className="flex flex-col overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
              {image && (
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={image.imageHint}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <feature.icon className="w-6 h-6 text-primary" />
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button asChild className="w-full">
                  <Link href={feature.href}>
                    Get Started <ArrowRight className="ml-2" />
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

import { Icons } from "@/components/icons";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-lg font-semibold">
      <Icons.logo className="h-6 w-6 text-primary" />
      <span>MitraAI</span>
    </div>
  );
}

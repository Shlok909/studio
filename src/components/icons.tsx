import {
  LayoutGrid,
  MessagesSquare,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  TrendingUp,
  User,
  Loader2,
  Heart,
  type LucideProps,
} from 'lucide-react'

export const Icons = {
  home: LayoutGrid,
  conversation: MessagesSquare,
  approach: Sparkles,
  analyzer: ShieldCheck,
  interest: HeartPulse,
  maturity: TrendingUp,
  user: User,
  bot: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  ),
  spinner: Loader2,
  logo: Heart,
}

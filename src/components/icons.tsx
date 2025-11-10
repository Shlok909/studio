
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
  SendHorizontal,
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
  send: SendHorizontal,
  heartQuestion: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <text
        x="12"
        y="11"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="9"
        fontWeight="bold"
        fill="currentColor"
        stroke="none"
      >
        ?
      </text>
    </svg>
  ),
}

import { config } from 'dotenv';
config();

import '@/ai/flows/assess-interest-level-flow.ts';
import '@/ai/flows/generate-maturity-suggestions-flow.ts';
import '@/ai/flows/conversation-coaching-flow.ts';
import '@/ai/flows/analyze-communication-flow.ts';
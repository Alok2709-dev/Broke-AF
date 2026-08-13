import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function askAI(prompt: string, userId?: string) {
  // Server-side wrapper to call OpenAI. Always call from server-only code.
  const res = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are Broke AF — a friendly, mildly savage student money coach. Always ground answers in the user transaction data when available. Never fabricate.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 700
  } as any)

  return res.choices?.[0]?.message?.content ?? ''
}

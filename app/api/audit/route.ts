import { generateText, Output } from "ai";
import { z } from "zod";

import {
  AI_MODEL,
  AI_GENERATION_CONFIG,
} from "../../../lib/ai-config";

const auditSchema = z.object({
  overallScore: z.number().min(0).max(100),

  accessibilityScore: z.number().min(0).max(100),
  uxScore: z.number().min(0).max(100),
  responsivenessScore: z.number().min(0).max(100),
  resilienceScore: z.number().min(0).max(100),

  summary: z.string(),

  issues: z.array(
    z.object({
      severity: z.enum(["low", "medium", "high"]),
      title: z.string(),
      explanation: z.string(),
      fix: z.string(),
    })
  ),

  strengths: z.array(z.string()),
  recommendedNextSteps: z.array(z.string()),
});

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string" || !code.trim()) {
      return Response.json(
        { error: "Please provide code to audit." },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: AI_MODEL,

      output: Output.object({
        schema: auditSchema,
      }),

      prompt: `
You are a senior frontend engineer reviewing React and Next.js code.

Audit the submitted code for:
- accessibility
- user experience
- responsiveness
- resilience and error handling
- frontend best practices

Be specific and practical.
Only report issues that can reasonably be inferred from the code.

CODE TO REVIEW:

${code}
      `,

      ...AI_GENERATION_CONFIG,
    });

    return Response.json(result.output);
  } catch (error) {
    console.error("Audit failed:", error);

    return Response.json(
      {
        error: "The audit could not be completed. Please try again.",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, action } = await req.json();

    if (!text || !action) {
      return NextResponse.json({ error: "Text and action are required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        result: action === 'reword' ? `[REWORDED]: ${text}` : `${text}\n\n[EXPANDED]: This is a mock expansion of the text provided.`
      });
    }

    const prompts: Record<string, string> = {
      reword: "Reword the following text to be more professional, persuasive, and clear for a grant proposal:",
      expand: "Expand the following section of a grant proposal by adding more detail, impact metrics, and context while maintaining a professional tone:",
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert grant writer assisting a user in real-time. Provide high-quality, professional improvements to their proposal content."
        },
        {
          role: "user",
          content: `${prompts[action]}\n\n${text}`
        }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      result: response.choices[0].message?.content || ""
    });
  } catch (error: any) {
    console.error("AI Edit Error:", error);
    return NextResponse.json({ error: error.message || "AI processing failed" }, { status: 500 });
  }
}

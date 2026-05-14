import { auth } from "@/auth";
import { generateBudgetNarrative } from "@/lib/ai-budget";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { budgetItems, projectContext } = await req.json();

    if (!budgetItems || !Array.isArray(budgetItems)) {
      return NextResponse.json({ error: "Budget items are required" }, { status: 400 });
    }

    const narrative = await generateBudgetNarrative(budgetItems, projectContext || "");

    return NextResponse.json({ narrative });
  } catch (error: any) {
    console.error("Budget generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate budget narrative" }, { status: 500 });
  }
}

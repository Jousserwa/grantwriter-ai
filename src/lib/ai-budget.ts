import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

function getOpenAI() {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
    });
  }
  return openaiInstance;
}

export async function generateBudgetNarrative(budgetItems: { item: string; cost: string; description: string }[], projectContext: string) {
  const itemsList = budgetItems.map(i => `- ${i.item}: ${i.cost} (${i.description})`).join('\n');

  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not set. Returning placeholder budget narrative.");
    return `
# Budget Narrative (MOCK)

## Overview
This budget narrative provides a detailed justification for the proposed project costs.

## Financial Justification
The items provided:
${itemsList}

The project context: "${projectContext}" demonstrates that these costs are reasonable, allocable, and necessary for the successful completion of the project objectives.
    `;
  }

  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an expert Financial Grant Consultant. Your specialty is writing detailed budget narratives and financial justifications that satisfy strict auditing requirements of major international funders (UN, EU, USAID).
Your goal is to take a list of budget items and costs and write a professional narrative that explains WHY each cost is necessary, HOW it was calculated, and HOW it directly supports the project's goals.`
      },
      {
        role: "user",
        content: `Project Context:
${projectContext}

Budget Items:
${itemsList}

Task:
Generate a detailed Budget Narrative (Financial Justification) based on the items above.
The narrative should:
1. Group related items into logical categories (e.g., Personnel, Travel, Equipment, Indirect Costs).
2. For each item, provide a 2-3 sentence justification.
3. Explain how the costs are cost-effective and provide good value for money.
4. Use professional financial terminology.
5. Use Markdown for structure.`
      }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message?.content || "";
}

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

export async function generateProposal(orgProfile: string, grantDesc: string) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not set. Returning placeholder content.");
    return `
# PROPOSAL (MOCK)
## Executive Summary
This is a mock proposal for the grant opportunity. Since no API key is provided, we've generated this placeholder.
## Organization Mission
${orgProfile}
## Project Description
${grantDesc}
    `;
  }

  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an expert Grant Writer with a 95% success rate in winning grants from organizations like USAID, EU, and the World Bank.
Your goal is to write a compelling, professional, and highly detailed grant proposal tailored specifically to the funder's requirements and the applicant organization's mission.
Use persuasive language, cite potential impact, and ensure all technical requirements of the grant are addressed.`
      },
      {
        role: "user",
        content: `Applicant Organization Profile:
${orgProfile}

Grant Opportunity Description:
${grantDesc}

Task:
Generate a full grant proposal for the opportunity described above. The proposal must include the following sections:
1. Executive Summary: A concise overview of the project and its impact.
2. Statement of Need: Why this project is necessary and what problem it solves.
3. Project Description: A detailed breakdown of the proposed activities.
4. Goals and Objectives: Clear, measurable outcomes.
5. Methodology/Approach: How the project will be implemented.
6. Evaluation Plan: How success will be measured.
7. Sustainability Plan: How the project will continue after the grant funding ends.
8. Organizational Capacity: Why this organization is best suited to execute the project.

Formatting:
Use professional language. Use Markdown for structure. Ensure the tone is appropriate for the funder.`
      }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message?.content || "";
}

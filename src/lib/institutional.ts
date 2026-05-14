import { institutionalGateway } from "./mtls-gateway";

/**
 * Institutional API Infrastructure
 * Handles mapping, mTLS gateway skeleton, and submission logic for UN, World Bank, and EU portals.
 */

export interface InstitutionalSubmission {
  callId: string;
  organizationName: string;
  missionStatement: string;
  proposalTitle: string;
  proposalContent: string;
  budgetNarrative?: string;
  submissionDate: string;
  metadata?: any;
}

/**
 * Maps GrantWriter AI internal models to Institutional Submission Schema.
 */
export function mapToInstitutionalSchema(
  org: any,
  proposal: any,
  grant: any,
  institution: 'UN' | 'WORLD_BANK' | 'EU'
): InstitutionalSubmission {
  const base: InstitutionalSubmission = {
    callId: grant.externalId || grant.id,
    organizationName: org.name,
    missionStatement: org.mission || "",
    proposalTitle: proposal.title,
    proposalContent: proposal.content || "",
    budgetNarrative: proposal.budget?.narrative || "",
    submissionDate: new Date().toISOString(),
  };

  // Funder-specific mapping logic
  switch (institution) {
    case 'UN':
      base.metadata = {
        un_sector_code: org.sector,
        sdg_targets: (proposal as any).sdgTargets || [],
        partner_id: org.unPartnerId,
      };
      break;
    case 'WORLD_BANK':
      base.metadata = {
        wb_project_id: grant.externalId,
        procurement_category: 'CONSULTING_SERVICES',
        country_code: org.country,
      };
      break;
    case 'EU':
      base.metadata = {
        pic_number: org.euPicNumber,
        horizon_europe_call_id: grant.externalId,
        ethical_self_assessment: true,
      };
      break;
  }

  return base;
}

/**
 * Submits a proposal to an institutional endpoint using the mTLS gateway.
 */
export async function submitProposalToInstitution(
  submission: InstitutionalSubmission,
  endpoint: string = "/submissions"
) {
  // Use the secure mTLS gateway for institutional communication
  const response: any = await institutionalGateway.request(
    `${process.env.INSTITUTIONAL_API_BASE_URL || "https://api.institution.org/v1"}${endpoint}`,
    {
      method: "POST",
      body: JSON.stringify(submission),
      headers: {
        "Content-Type": "application/json",
        "X-Client-ID": "GrantWriterAI-Production",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Institutional Gateway Error: ${response.status} ${errorText}`);
  }

  return response.json();
}

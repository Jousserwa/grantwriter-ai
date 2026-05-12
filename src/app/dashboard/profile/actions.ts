"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const name = formData.get("org-name") as string;
  const mission = formData.get("mission") as string;
  const sector = formData.get("sector") as string;
  const country = formData.get("country") as string;
  const teamSizeStr = formData.get("team-size") as string;
  const teamSize = teamSizeStr ? parseInt(teamSizeStr) : null;
  const pastProjects = formData.get("past-projects") as string;
  const annualBudget = formData.get("annual-budget") as string;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.organizationId) {
    await prisma.organization.update({
      where: { id: user.organizationId },
      data: {
        name,
        mission,
        sector,
        country,
        teamSize,
        pastProjects,
        financials: { annualBudget },
      },
    });
  } else {
    await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name,
          mission,
          sector,
          country,
          teamSize,
          pastProjects,
          financials: { annualBudget },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { organizationId: org.id },
      });
    });
  }

  revalidatePath("/dashboard/profile");
}

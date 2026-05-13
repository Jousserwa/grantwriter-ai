"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function removeMemberAction(userId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!currentUser || currentUser.organizationRole !== 'OWNER') {
    throw new Error("Only owners can remove members");
  }

  const userToRemove = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (userToRemove?.organizationId !== currentUser.organizationId) {
    throw new Error("User does not belong to your organization");
  }

  if (userToRemove.id === currentUser.id) {
    throw new Error("You cannot remove yourself");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { organizationId: null, organizationRole: 'MEMBER' }
  });

  revalidatePath("/dashboard/team");
}

export async function inviteMemberAction(email: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!currentUser || currentUser.organizationRole !== 'OWNER') {
    throw new Error("Only owners can invite members");
  }

  // In a real app, this would send an email. 
  // For now, we'll just check if the user exists and add them if they are not in an org.
  const targetUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!targetUser) {
    throw new Error("User not found. They must have an account first in this demo.");
  }

  if (targetUser.organizationId) {
    throw new Error("User is already part of an organization");
  }

  await prisma.user.update({
    where: { id: targetUser.id },
    data: { organizationId: currentUser.organizationId, organizationRole: 'MEMBER' }
  });

  revalidatePath("/dashboard/team");
}

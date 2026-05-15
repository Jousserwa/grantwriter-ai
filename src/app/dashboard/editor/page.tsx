import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EditorRedirectPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: {
        include: {
          proposals: {
            orderBy: { updatedAt: 'desc' },
            take: 1
          }
        }
      }
    }
  });

  const latestProposal = user?.organization?.proposals[0];

  if (latestProposal) {
    redirect(`/dashboard/editor/${latestProposal.id}`);
  } else {
    redirect("/dashboard/history");
  }
}

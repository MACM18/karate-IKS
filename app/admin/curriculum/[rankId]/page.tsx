import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import CurriculumManager from "@/components/admin/CurriculumManager";

export default async function RankCurriculumPage({
  params,
}: {
  params: Promise<{ rankId: string }>;
}) {
  const { rankId } = await params;
  const rank = await prisma.rank.findUnique({
    where: { id: rankId },
    include: {
      curriculumItems: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!rank) {
    notFound();
  }

  return <CurriculumManager rank={rank} />;
}


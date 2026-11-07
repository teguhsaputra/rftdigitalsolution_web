import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminPortfolioEditor } from '@/components/admin-portfolio-editor';
import { getServiceTitleOptions } from '@/lib/public-content';

export default async function AdminEditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.portfolioProject.findUnique({ where: { id } });
  if (!project) notFound();
  const serviceOptions = await getServiceTitleOptions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Edit portfolio</h1>
        <p className="text-muted-foreground">{project.title}</p>
      </div>
      <AdminPortfolioEditor project={project} serviceOptions={serviceOptions} />
    </div>
  );
}

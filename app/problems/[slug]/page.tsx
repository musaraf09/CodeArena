import { notFound } from "next/navigation";
import problems from "@/lib/problems.json";
import { ProblemWorkspace } from "@/components/problem-workspace";
export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: problems.find((p) => p.id === slug)?.title || "Problem not found",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = problems.find((p) => p.id === slug);
  if (!problem) notFound();
  return <ProblemWorkspace key={problem.id} problem={problem} />;
}

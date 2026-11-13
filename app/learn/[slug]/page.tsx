import { notFound } from "next/navigation";
import courses from "@/lib/courses.json";
import { LessonReader } from "@/components/lesson-reader";
export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title:
      courses.find((c) => c.id === slug)?.title || "Learning path not found",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.id === slug);
  if (!course) notFound();
  return <LessonReader course={course} />;
}

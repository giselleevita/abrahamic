import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, ShieldCheck } from "lucide-react";
import prisma from "@/lib/prisma";
import {
  JourneyStepList,
  RestartJourneyButton,
} from "@/components/learn/JourneyProgress";

export const dynamic = "force-dynamic";
type Params = Promise<{ courseSlug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { title: true, description: true },
  });
  return course
    ? { title: course.title, description: course.description ?? undefined }
    : {};
}

export default async function CoursePage({ params }: { params: Params }) {
  const { courseSlug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      chapters: { where: { isPublished: true }, orderBy: { position: "asc" } },
    },
  });
  if (!course?.isPublished) notFound();
  const steps = course.chapters.map((chapter) => ({
    slug: chapter.slug,
    title: chapter.title,
    href: `/learn/${course.slug}/${chapter.slug}`,
  }));
  return (
    <div className="min-h-screen bg-[#fffaf5] pb-16">
      <section className="relative min-h-[420px] overflow-hidden bg-slate-950 text-white">
        <Image
          src={course.artworkPath ?? "/timeline/patriarchal.jpg"}
          alt={course.artworkAlt ?? ""}
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <Link
            href="/learn"
            className="text-sm font-bold text-blue-200 hover:text-white"
          >
            ← All journeys
          </Link>
          <p className="mt-10 text-sm font-bold uppercase tracking-[0.16em] text-amber-300">
            Guided journey
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
            {course.title}
          </h1>
          {course.subtitle && (
            <p className="mt-3 text-xl text-slate-200">{course.subtitle}</p>
          )}
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
            {course.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-4 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />{" "}
              {course.estimatedMinutes ?? course.chapters.length * 3} minutes
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Editorially reviewed and
              sourced
            </span>
          </div>
        </div>
      </section>
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">
              Your path
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              {steps.length} steps
            </h2>
          </div>
          <JourneyStepList steps={steps} />
        </section>
        <aside className="h-fit rounded-2xl border border-amber-200 bg-amber-50 p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-slate-950">
            How this journey works
          </h2>
          <ol className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
            <li>
              <b>1.</b> Each tradition is presented in its own terms.
            </li>
            <li>
              <b>2.</b> Comparisons appear only after the positions are clear.
            </li>
            <li>
              <b>3.</b> Sources and editorial framing stay visible.
            </li>
          </ol>
          <p className="mt-5 border-t border-amber-200 pt-4 text-xs leading-5 text-slate-600">
            Artwork: {course.artworkCredit ?? "Abrahamic Texts"} ·{" "}
            {course.artworkLicense ?? "Project licence"}
          </p>
          <div className="mt-4">
              <RestartJourneyButton
                courseSlug={course.slug}
                slugs={course.chapters.map((c) => c.slug)}
              />
          </div>
        </aside>
      </main>
    </div>
  );
}

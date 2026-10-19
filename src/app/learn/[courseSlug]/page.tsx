import type { Metadata } from "next";
import { StoryScene } from '@/components/experience/Motion'
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, ShieldCheck } from "lucide-react";
import prisma from "@/lib/prisma";
import {
  JourneyResumeCard,
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
    estimatedMinutes: chapter.estimatedMinutes,
  }));
  return (
    <div className="editorial-page min-h-screen pb-16">
      <section className="border-b border-[#e5d9c8] bg-[#f3eadb]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-12">
          <div>
            <Link href="/learn" className="editorial-link text-sm">← All journeys</Link>
            <p className="editorial-eyebrow mt-8">Guided journey</p>
            <h1 className="editorial-title mt-3 text-4xl sm:text-6xl">{course.title}</h1>
            {course.subtitle && <p className="mt-3 text-xl font-semibold text-[#51483c]">{course.subtitle}</p>}
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#51483c]">{course.description}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-[#51483c]"><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#80571b]" aria-hidden="true" /> {course.estimatedMinutes ?? course.chapters.length * 3} minutes</span><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#80571b]" aria-hidden="true" /> Editorially reviewed and sourced</span></div>
          </div>
          <figure><StoryScene className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[#d7c5ad] bg-[#173b68]"><Image src={course.artworkPath ?? '/timeline/patriarchal.jpg'} alt={course.artworkAlt ?? ''} fill priority className="object-cover" sizes="(min-width:1024px) 42vw, 100vw" /></StoryScene><figcaption className="mt-3 text-xs leading-5 text-[#655a4b]">Artwork: {course.artworkCredit ?? 'Abrahamic Texts project artwork'} · {course.artworkLicense === 'PROJECT' ? 'Project-created' : course.artworkLicense ?? 'Project-created'} · <Link href={course.artworkSourceUrl ?? '/licensing'} className="editorial-link">source and licence</Link></figcaption></figure>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-6">
            <p className="editorial-eyebrow">
              Your path
            </p>
            <h2 className="editorial-title mt-2 text-3xl">
              {steps.length} steps
            </h2>
          </div>
          <JourneyStepList steps={steps} />
        </section>
        <aside className="h-fit space-y-5 lg:sticky lg:top-24">
          <JourneyResumeCard courseSlug={course.slug} title={course.title} steps={steps} />
          <div className="editorial-card p-6"><h2 className="text-xl font-bold text-[#242019]">
            How this journey works
          </h2>
          <ol className="mt-4 space-y-4 text-sm leading-6 text-[#51483c]">
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
          <div className="mt-4">
              <RestartJourneyButton
                courseSlug={course.slug}
                slugs={course.chapters.map((c) => c.slug)}
              />
          </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

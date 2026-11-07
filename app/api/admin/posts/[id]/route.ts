import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { invalidateBlogCaches } from "@/lib/cache";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { imageRefSchema } from "@/lib/image-ref";

const postSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  image: imageRefSchema.optional(),
  published: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
});

// --- PERBAIKAN 1: Definisikan tipe Props agar lebih rapi ---
type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteProps // <--- UBAH TIPE DATA DISINI
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // --- PERBAIKAN 2: Await params sebelum dipakai ---
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id }, // Gunakan 'id' langsung (bukan params.id)
    include: { seoMeta: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: RouteProps // <--- UBAH TIPE DATA DISINI
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // --- PERBAIKAN 3: Await params ---
  const { id } = await params;

  try {
    const existing = await prisma.post.findUnique({
      where: { id },
      select: { slug: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = postSchema.parse(body);

    // Check if slug already exists (excluding current post)
    if (data.slug) {
      const existingPost = await prisma.post.findFirst({
        where: {
          slug: data.slug,
          id: { not: id }, // Gunakan 'id' langsung
        },
      });

      if (existingPost) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: Prisma.PostUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.image !== undefined) updateData.image = data.image || null;
    if (data.published !== undefined) updateData.published = data.published;

    const post = await prisma.post.update({
      where: { id }, // Gunakan 'id' langsung
      data: updateData,
      include: { seoMeta: true },
    });

    // Update or create SEO meta
    if (post.seoMeta) {
      await prisma.seoMeta.update({
        where: { postId: id }, // Gunakan 'id' langsung
        data: {
          metaTitle: data.metaTitle ?? null,
          metaDescription: data.metaDescription ?? null,
          keywords: data.keywords ?? null,
          canonicalUrl: data.canonicalUrl ?? null,
        },
      });
    } else {
      await prisma.seoMeta.create({
        data: {
          postId: id, // Gunakan 'id' langsung
          metaTitle: data.metaTitle ?? null,
          metaDescription: data.metaDescription ?? null,
          keywords: data.keywords ?? null,
          canonicalUrl: data.canonicalUrl ?? null,
        },
      });
    }

    const newSlug = post.slug;
    const slugsToClear =
      data.slug !== undefined && data.slug !== existing.slug
        ? [existing.slug, newSlug]
        : [newSlug];
    await invalidateBlogCaches(slugsToClear);

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteProps // <--- UBAH TIPE DATA DISINI
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // --- PERBAIKAN 4: Await params ---
  const { id } = await params;

  try {
    const before = await prisma.post.findUnique({
      where: { id },
      select: { slug: true },
    });
    if (!before) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await req.json();
    const { published } = body;

    const post = await prisma.post.update({
      where: { id }, // Gunakan 'id' langsung
      data: { published: published ?? false },
    });

    await invalidateBlogCaches([before.slug]);

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteProps // <--- UBAH TIPE DATA DISINI
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // --- PERBAIKAN 5: Await params ---
  const { id } = await params;

  try {
    const toDelete = await prisma.post.findUnique({
      where: { id },
      select: { slug: true },
    });
    if (!toDelete) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id }, // Gunakan 'id' langsung
    });

    await invalidateBlogCaches([toDelete.slug]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

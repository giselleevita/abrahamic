import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const figure = await prisma.figure.findUnique({
    where: { slug },
    include: {
      aliases: { orderBy: { tradition: 'asc' } },
      claims: {
        include: {
          claim: {
            include: {
              source: true,
              verses: {
                where: { isPrimary: true },
                include: {
                  verse: {
                    include: {
                      translations: { where: { isDefault: true } },
                    },
                  },
                },
              },
              themes: { include: { theme: true } },
              comparisons: {
                include: {
                  comparison: {
                    include: {
                      claims: {
                        orderBy: { position: 'asc' },
                        include: {
                          claim: {
                            include: {
                              source: true,
                              verses: {
                                where: { isPrimary: true },
                                include: {
                                  verse: {
                                    include: {
                                      translations: { where: { isDefault: true } },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!figure) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(figure)
}

const updateSchema = z.object({
  canonicalName: z.string().min(1).max(200).optional(),
  description: z.string().nullish(),
  aliases: z.array(z.object({
    id: z.number().optional(),
    tradition: z.enum(['JEWISH', 'CHRISTIAN', 'ISLAMIC', 'SHARED']),
    name: z.string().min(1).max(200),
    language: z.string().max(100).optional(),
    notes: z.string().optional(),
  })).optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { aliases, ...data } = parsed.data

  const figure = await prisma.figure.update({
    where: { slug },
    data: {
      ...data,
      ...(aliases !== undefined
        ? {
            aliases: {
              deleteMany: {},
              create: aliases.map(({ id: _id, ...a }) => a),
            },
          }
        : {}),
    },
    include: { aliases: { orderBy: { tradition: 'asc' } }, _count: { select: { claims: true } } },
  })

  return NextResponse.json(figure)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  await prisma.figure.delete({ where: { slug } })
  return NextResponse.json({ ok: true })
}

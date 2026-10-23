import type { Prisma } from '@/generated/prisma/client'
/** A held legacy assertion must not reach adult discovery or a children's game. */
export const PUBLIC_FAMILY_RELATIONS: Prisma.FigureRelationWhereInput = {
  OR: [{ notes: null }, { NOT: { notes: { startsWith: '[EDITORIAL HOLD] ' } } }],
}

export const EDITORIAL_ROLES = ['VIEWER', 'EDITOR', 'ADMIN'] as const
export type EditorialRole = (typeof EDITORIAL_ROLES)[number]

export const EDITORIAL_STATUSES = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'] as const
export type EditorialStatus = (typeof EDITORIAL_STATUSES)[number]

const transitions: Record<EditorialRole, Partial<Record<EditorialStatus, EditorialStatus[]>>> = {
  VIEWER: {},
  EDITOR: {
    DRAFT: ['IN_REVIEW'],
    IN_REVIEW: ['DRAFT'],
  },
  ADMIN: {
    DRAFT: ['IN_REVIEW', 'PUBLISHED', 'ARCHIVED'],
    IN_REVIEW: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    PUBLISHED: ['IN_REVIEW', 'ARCHIVED'],
    ARCHIVED: ['DRAFT'],
  },
}

export function canEdit(role: EditorialRole, status: EditorialStatus): boolean {
  return role === 'ADMIN' || (role === 'EDITOR' && status !== 'PUBLISHED' && status !== 'ARCHIVED')
}

export function canDelete(role: EditorialRole): boolean {
  return role === 'ADMIN'
}

export function canTransition(role: EditorialRole, from: EditorialStatus, to: EditorialStatus): boolean {
  return from === to || (transitions[role][from] ?? []).includes(to)
}

export function roleFromSession(session: { user?: { role?: unknown } } | null): EditorialRole {
  const role = session?.user?.role
  return EDITORIAL_ROLES.includes(role as EditorialRole) ? role as EditorialRole : 'VIEWER'
}

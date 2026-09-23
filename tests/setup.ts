import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Testing Library auto-registers cleanup only when a global `afterEach` exists.
// This project uses explicit vitest imports rather than `globals: true`, so the
// teardown is wired up here — without it, renders accumulate across tests and
// queries fail with "found multiple elements".
afterEach(cleanup)

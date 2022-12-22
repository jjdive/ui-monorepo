import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/vue'

// This will extend "expect" with jest-dom matchers
import '@testing-library/jest-dom'

afterEach(cleanup)

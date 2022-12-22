import { render } from '@testing-library/vue'
import Button from '../../packages/button/Button.vue'
import userEvent from '@testing-library/user-event'

describe('Button', () => {
  test('renders a button', async () => {
    const { getByRole } = render(Button)
    getByRole('button')
  })

  test('renders default slot content', async () => {
    const text = 'Submit'
    const { getByText } = render(Button)
    getByText(text)
  })

  test('renders slot content', async () => {
    const text = 'A button'
    const { getByText } = render(Button, { slots: { default: text } })
    getByText(text)
  })

  test('emits click event', async () => {
    const text = 'Click Me!'
    const user = userEvent.setup()
    const { emitted, getByText } = render(Button, { slots: { default: text } })
    const button = getByText(text)

    await user.click(button)

    expect(emitted()).toHaveProperty('click')
  })
})

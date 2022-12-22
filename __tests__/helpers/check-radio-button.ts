import { screen } from '@testing-library/vue'
import user from '@testing-library/user-event'

export async function checkRadioButton(element: HTMLElement): Promise<void> {
  const radioGroupName = element.getAttribute('name')
  screen
    .getAllByRole('radio')
    .filter((el) => el.getAttribute('name') === radioGroupName)
    .forEach((el) => {
      el.removeAttribute('checked')
    })

  element.setAttribute('checked', '')
  element.dispatchEvent(new Event('change'))
  await user.click(element)
}

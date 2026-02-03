import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { MyButton } from '../src'

test('button', async () => {
  const screen = await render(<MyButton type="primary" />)
  const buttonElement = screen.getByRole('button')

  expect(buttonElement).toBeInTheDocument()
  expect(buttonElement).toHaveTextContent('my button type: primary count: 0')
  expect(screen.container.innerHTML).toMatchInlineSnapshot(
    `"<button class="my-button">my button<br> type: primary<br> count: 0</button>"`,
  )
  expect(buttonElement).toHaveClass('my-button')
})

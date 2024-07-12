import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls the event createBlog event handler with the right new blog details', async () => {
  const mockAddBlogHandler = vi.fn()
  const user = userEvent.setup()

  const component = render(
    <BlogForm createBlog={mockAddBlogHandler} />
  ).container

  const blogTitleInput = component.querySelector('input[name=\'Title\']')
  const blogAuthorInput = component.querySelector('input[name=\'Author\']')
  const blogUrlInput = component.querySelector('input[name=\'URL\']')
  const createBlogButton = screen.getByText('create')

  await user.type(blogTitleInput, 'A Whole New World')
  await user.type(blogAuthorInput, 'Stephen Mwingira')
  await user.type(blogUrlInput, 'https://disney.com')
  await user.click(createBlogButton)

  expect(mockAddBlogHandler.mock.calls).toHaveLength(1)
  expect(mockAddBlogHandler.mock.calls[0][0].title).toBe('A Whole New World')
  expect(mockAddBlogHandler.mock.calls[0][0].author).toBe('Stephen Mwingira')
  expect(mockAddBlogHandler.mock.calls[0][0].url).toBe('https://disney.com')
})

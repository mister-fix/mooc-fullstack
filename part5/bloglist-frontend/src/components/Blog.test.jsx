import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'A Whole New World',
  author: 'Stephen Mwingira',
  url: 'https://google.com',
  likes: 0,
  user: {
    id: '668370e6535b21bf4989fcb9',
    name: 'Jax Test',
    username: 'jax_test',
  },
}

test('title and author of blog are rendered, but not url or likes', () => {
  const mockUpvoteHandler = vi.fn()
  const mockDeleteHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      handleLike={mockUpvoteHandler}
      handleDelete={mockDeleteHandler}
    />
  )

  const title = screen.getByText('A Whole New World')
  const author = screen.getByText('Stephen Mwingira')
  const url = screen.queryByDisplayValue('https://google.com')
  const likes = screen.queryByDisplayValue('likes 0')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('blog url and number of likes are shown when view button is clicked', async () => {
  const mockUpvoteHandler = vi.fn()
  const mockDeleteHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      handleLike={mockUpvoteHandler}
      handleDelete={mockDeleteHandler}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  const url = screen.queryByDisplayValue('https://google.com')
  const likes = screen.queryByDisplayValue('likes 0')

  await user.click(button)

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('if the like button is clicked twice, the event handler component received as props is called twice', async () => {
  const mockUpvoteHandler = vi.fn()
  const mockDeleteHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      handleLike={mockUpvoteHandler}
      handleDelete={mockDeleteHandler}
    />
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  const likeButton = screen.getByText('like')

  await user.click(viewButton)
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockUpvoteHandler.mock.calls).toHaveLength(2)
})

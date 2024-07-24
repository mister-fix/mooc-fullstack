import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [visibility, setVisibility] = useState(false)
  const showWhenVisibile = { display: visibility ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  const matchUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON && blog.user) {
      const { username } = JSON.parse(loggedUserJSON)
      return username === blog.user.username
    }

    return false
  }

  return (
    <div
      style={blogStyle}
      className="blog"
    >
      <div>
        <p
          className="blog-title"
          data-testid="blog-title"
        >
          {blog.title}
        </p>{' '}
        <p
          className="blog-author"
          data-testid="blog-author"
        >
          {blog.author}
        </p>{' '}
        <button onClick={toggleVisibility}>
          {visibility ? 'hide' : 'view'}
        </button>
      </div>

      <div style={showWhenVisibile}>
        <p
          className="blog-url"
          data-testid="blog-url"
        >
          {blog.url}
        </p>
        <p
          className="blog-likes"
          data-testid="blog-likes"
        >
					likes {blog.likes}{' '}
          <button onClick={(event) => handleLike(event, blog.id)}>like</button>
        </p>
        {/* <p>{blog.user.name}</p> */}
        {matchUser() && (
          <button onClick={(event) => handleDelete(event, blog.id)}>
						remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog

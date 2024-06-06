const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Test blog 1',
    author: 'John Doe',
    url: 'https://google.com',
    likes: 5,
  },
  {
    title: 'Test Blog 2',
    author: 'Jane Doe',
    url: 'https://yahoo.com',
    likes: 8,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovesoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}

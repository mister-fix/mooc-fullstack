const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./blog_test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  // the above can be replaced with the following code
  // await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs unique identifier property is id', async () => {
  const response = await api.get('/api/blogs')

  const blogs = response.body

  blogs.forEach((blog) => {
    assert(
      Object.prototype.hasOwnProperty.call(blog, 'id'),
      'Blog does not have id property'
    )
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Something something dark side...',
    author: 'Lucas Films',
    url: 'https://starwars.com/',
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map((n) => n.title)
  assert(contents.includes('Something something dark side...'))
})

test('adding a blog without the likes property defaults it to 0', async () => {
  const newBlog = {
    title: 'Starship Troopers',
    author: 'Robert A. Heinlein',
    url: 'https://starshiptroopers.com/',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title)

  assert.strictEqual(addedBlog.likes, 0)
})

test('blog without title or url is not added', async () => {
  const newBlog = {
    author: 'Mark Rubin',
    likes: 3,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})

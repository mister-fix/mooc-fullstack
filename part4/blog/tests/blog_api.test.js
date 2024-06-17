const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const helper = require('./blog_test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

const loginTestUser = async () => {
  const user = { username: 'test', password: 'test123' }
  const response = await api
    .post('/api/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  return response.body.token
}

describe('when there is initally some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('test123', 10)
    const user = new User({
      username: 'test',
      name: 'Test User',
      passwordHash,
    })

    await user.save()

    const blogObjects = helper.initialBlogs.map(
      (blog) => new Blog({ ...blog, user: user._id })
    )
    const promiseArray = blogObjects.map((blog) => blog.save())
    const savedBlogs = await Promise.all(promiseArray)

    user.blogs = savedBlogs.map((blog) => blog._id)
    await user.save()
  })

  test('blogs are returned as json', async () => {
    const token = await loginTestUser()

    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const token = await loginTestUser()
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs unique identifier property is id', async () => {
    const token = await loginTestUser()
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body

    blogs.forEach((blog) => {
      assert(
        Object.prototype.hasOwnProperty.call(blog, 'id'),
        'Blog does not have id property'
      )
    })
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const token = await loginTestUser()
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogToViewJSON = JSON.parse(JSON.stringify(blogToView))
      assert.deepStrictEqual(resultBlog.body, blogToViewJSON)
    })

    test('fails with a status code of 404 if note does not exist', async () => {
      const token = await loginTestUser()
      const validNonExistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonExistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const token = await loginTestUser()
      const invalidId = String('5a3d5da59070081a82a3445')

      await api
        .get(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const token = await loginTestUser()
      const newBlog = {
        title: 'Something something dark side...',
        author: 'Lucas Films',
        url: 'https://starwars.com/',
        likes: 12,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const contents = blogsAtEnd.map((n) => n.title)
      assert(contents.includes('Something something dark side...'))
    })

    test('succeeds without likes property defaults it to 0', async () => {
      const token = await loginTestUser()
      const newBlog = {
        title: 'Starship Troopers',
        author: 'Robert A. Heinlein',
        url: 'https://starshiptroopers.com/',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title)

      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails with status code 400 if url or title is missing', async () => {
      const token = await loginTestUser()
      const newBlog = {
        author: 'Mark Rubin',
        likes: 3,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('updating of a blog', () => {
    test('succeeds when updating blog likes', async () => {
      const token = await loginTestUser()
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likes: 12 })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedBlog = response.body

      assert.strictEqual(updatedBlog.likes, 12)
      assert.strictEqual(updatedBlog.title, blogToUpdate.title)
      assert.strictEqual(updatedBlog.author, blogToUpdate.author)
      assert.strictEqual(updatedBlog.url, blogToUpdate.url)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const token = await loginTestUser()
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const contents = blogsAtEnd.map((b) => b.title)
      assert(!contents.includes(blogToDelete.title))
    })
  })

  describe('when there is initially one user in the db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkainen',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map((u) => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper status code and message if username is already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})

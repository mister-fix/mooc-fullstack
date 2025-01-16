const express = require('express')

// Models
const Blog = require('../models/blog')
const Comment = require('../models/comment')

// Create the router
const router = express.Router({ mergeParams: true }) // Merge `:blogId` from parent router

/**
 * POST /blogs:blogId/comments
 */
router.post('/', async (request, response) => {
  const { blogId } = request.params
  const { content } = request.body

  try {
    // Validate that the blog exists
    const blog = await Blog.findById(blogId)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found.' })
    }

    // Create and save the comment
    const comment = new Comment({ content, blog: blogId })
    const savedComment = await comment.save()

    // Add the comment to the blog's comments array
    blog.comments.push(savedComment._id)
    await blog.save()

    response.status(201).json(savedComment)
  } catch (error) {
    console.error('Error posting comment:', error)
    response.status(500).json({ error: 'Failed to post comment.' })
  }
})

// Export router
module.exports = router

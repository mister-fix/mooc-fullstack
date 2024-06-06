const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);

const helper = require("./blog_test_helper");

const Blog = require("../models/blog");

describe("when there is initally some blogs saved", () => {
	beforeEach(async () => {
		await Blog.deleteMany({});
		await Blog.insertMany(helper.initialBlogs);
	});

	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all blogs are returned", async () => {
		const response = await api.get("/api/blogs");

		assert.strictEqual(response.body.length, helper.initialBlogs.length);
	});

	test("blogs unique identifier property is id", async () => {
		const response = await api.get("/api/blogs");

		const blogs = response.body;

		blogs.forEach((blog) => {
			assert(
				Object.prototype.hasOwnProperty.call(blog, "id"),
				"Blog does not have id property"
			);
		});
	});

	describe("viewing a specific blog", () => {
		test("succeeds with a valid id", async () => {
			const blogsAtStart = await helper.blogsInDb();

			const blogToView = blogsAtStart[0];

			const resultBlog = await api
				.get(`/api/blogs/${blogToView.id}`)
				.expect(200)
				.expect("Content-Type", /application\/json/);

			assert.deepStrictEqual(resultBlog.body, blogToView);
		});

		test("fails with a status code of 404 if note does not exist", async () => {
			const validNonExistingId = await helper.nonExistingId();

			await api.get(`/api/blogs/${validNonExistingId}`).expect(404);
		});

		test("fails with status code 400 if id is invalid", async () => {
			const invalidId = String("5a3d5da59070081a82a3445");

			await api.get(`/api/blogs/${invalidId}`).expect(400);
		});
	});

	describe("addition of a new blog", () => {
		test("succeeds with valid data", async () => {
			const newBlog = {
				title: "Something something dark side...",
				author: "Lucas Films",
				url: "https://starwars.com/",
				likes: 12,
			};

			await api
				.post("/api/blogs")
				.send(newBlog)
				.expect(201)
				.expect("Content-Type", /application\/json/);

			const blogsAtEnd = await helper.blogsInDb();
			assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

			const contents = blogsAtEnd.map((n) => n.title);
			assert(contents.includes("Something something dark side..."));
		});

		test("succeeds without likes property defaults it to 0", async () => {
			const newBlog = {
				title: "Starship Troopers",
				author: "Robert A. Heinlein",
				url: "https://starshiptroopers.com/",
			};

			await api
				.post("/api/blogs")
				.send(newBlog)
				.expect(201)
				.expect("Content-Type", /application\/json/);

			const blogsAtEnd = await helper.blogsInDb();
			const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title);

			assert.strictEqual(addedBlog.likes, 0);
		});

		test("fails with status code 400 if url or title is missing", async () => {
			const newBlog = {
				author: "Mark Rubin",
				likes: 3,
			};

			await api.post("/api/blogs").send(newBlog).expect(400);

			const blogsAtEnd = await helper.blogsInDb();
			assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
		});
	});

	describe("updating of a blog", () => {
		test("succeeds when updating blog likes", async () => {
			const blogsAtStart = await helper.blogsInDb();
			const blogToUpdate = blogsAtStart[0];

			const response = await api
				.put(`/api/blogs/${blogToUpdate.id}`)
				.send({ likes: 12 })
				.expect(200)
				.expect("Content-Type", /application\/json/);

			const updatedBlog = response.body;

			assert.strictEqual(updatedBlog.likes, 12);
			assert.strictEqual(updatedBlog.title, blogToUpdate.title);
			assert.strictEqual(updatedBlog.author, blogToUpdate.author);
			assert.strictEqual(updatedBlog.url, blogToUpdate.url);
		});
	});

	describe("deletion of a blog", () => {
		test("succeeds with status code 204 if id is valid", async () => {
			const blogsAtStart = await helper.blogsInDb();
			const blogToDelete = blogsAtStart[0];

			await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

			const blogsAtEnd = await helper.blogsInDb();

			assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

			const contents = blogsAtEnd.map((b) => b.title);
			assert(!contents.includes(blogToDelete.title));
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});

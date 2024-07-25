const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/users", {
			data: {
				name: "Test User",
				username: "testuser",
				password: "password",
			},
		});

		await page.goto("/");
	});

	test("Login form is shown", async ({ page }) => {
		const locator = page.getByText("log in to application");
		await expect(locator).toBeVisible();
	});

	describe("Login", () => {
		test("Succeeds with correct credentials", async ({ page }) => {
			await loginWith(page, "testuser", "password");
			await expect(page.getByText("Test User logged in")).toBeVisible();
		});

		test("Fails with wrong credentials", async ({ page }) => {
			await loginWith(page, "testuser", "wrongpassword");

			const notificationDiv = page.locator(".notification");
			await expect(notificationDiv).toContainText("wrong username or password");
			await expect(page.getByText("Test User logged in")).not.toBeVisible();
		});

		describe("When logged in", () => {
			beforeEach(async ({ page }) => {
				await loginWith(page, "testuser", "password");
			});

			test("A new blog can be created", async ({ page }) => {
				await createBlog(page, {
					title: "A blog created by playwright",
					author: "Play Wright",
					url: "https://playwright.dev/docs/",
				});

				const blog = page
					.getByTestId("blog-title")
					.and(page.getByText("A blog created by playwright"));

				await expect(blog).toBeVisible();
			});

			describe("And a blog exists", () => {
				beforeEach(async ({ page }) => {
					await createBlog(page, {
						title: "Test blog",
						author: "John Doe",
						url: "http://google.com",
					});
				});

				test("A blog can be liked", async ({ page }) => {
					await page.getByRole("button", { name: "view" }).click();
					await page.getByRole("button", { name: "like" }).click();
					await expect(
						page.getByTestId("blog-likes").and(page.getByText("likes 1"))
					).toBeVisible();
				});

				test("A blog can be removed", async ({ page }) => {
					const targetBlog = page.getByText("Test blog");
					const targetBlogElement = await targetBlog.locator("..");

					await targetBlogElement.getByRole("button", { name: "view" }).click();
					await targetBlogElement
						.getByRole("button", { name: "remove" })
						.nth(1)
						.click();
				});
			});
		});
	});
});

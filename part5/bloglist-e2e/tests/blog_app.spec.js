const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/users", {
			data: {
				name: "Matti Luukkainen",
				username: "mluukkai",
				password: "salainen",
			},
		});

		await page.goto("/");
	});

	test("Login form is shown", async ({ page }) => {
		await expect(page.getByText("log in to application")).toBeVisible();
		await expect(page.getByTestId("username")).toBeVisible();
		await expect(page.getByTestId("password")).toBeVisible();
		await expect(page.getByRole("button")).toBeVisible();
	});

	describe("Login", () => {
		test("succeeds with correct credentials", async ({ page }) => {
			await loginWith(page, "mluukkai", "salainen");
			await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
		});

		test("fails with wrong credentials", async ({ page }) => {
			await loginWith(page, "mluukkai", "wrongpassword");

			const notificationDiv = await page.locator(".notification");
			await expect(notificationDiv).toContainText("wrong username or password");
			await expect(notificationDiv).toHaveCSS("border-style", "solid");
			await expect(notificationDiv).toHaveCSS("color", "rgb(255, 0, 0)");
			await expect(
				page.getByText("Martin Luukkainen logged in")
			).not.toBeVisible();
		});

		describe("When logged in", () => {
			beforeEach(async ({ page }) => {
				await loginWith(page, "mluukkai", "salainen");
			});

			test("a new blog can be created", async ({ page }) => {
				const newBlog = {
					title: "A blog created by playwright",
					author: "John Doe",
					url: "https://freecodecamp.org",
				};
				await createBlog(page, newBlog, true);

				const blogTitle = await page.getByTestId("blog-title");
				await expect(blogTitle).toContainText("A blog created by playwright");
			});
		});
	});
});

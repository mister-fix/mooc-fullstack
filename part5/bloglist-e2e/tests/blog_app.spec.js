const { describe, beforeEach, test, expect } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/users", {
			data: {
				username: "testuser",
				name: "Test User",
				password: "password",
			},
		});
		await request.post("/api/users", {
			data: {
				username: "johndoe",
				name: "John Doe",
				password: "jdoe1234",
			},
		});

		await page.goto("/");
	});

	test("Login form is shown", async ({ page }) => {
		await expect(page.getByText("log in to application")).toBeVisible();
		await expect(page.getByTestId("username")).toBeVisible();
		await expect(page.getByTestId("password")).toBeVisible();
		await expect(page.getByRole("button", { name: "login" })).toBeVisible();
	});

	describe("Login", () => {
		test("succeeds with correct credentials", async ({ page }) => {
			await loginWith(page, "testuser", "password");

			await expect(page.getByText("Test User logged in")).toBeVisible();
			await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
		});

		test("fails with wrong credentials", async ({ page }) => {
			await loginWith(page, "testuser", "nopassword");

			const notification = page.locator(".notification");
			await expect(notification).toHaveCSS("border-style", "solid");
			await expect(notification).toHaveCSS("color", "rgb(255, 0, 0)");
			await expect(page.getByText("Test User logged in")).not.toBeVisible();
		});
	});

	describe("When logged in", () => {
		beforeEach(async ({ page }) => {
			await loginWith(page, "testuser", "password");
			await createBlog(page, {
				title: "A Thousand Acres",
				author: "Jane Smiley",
				url: "http://janesmiley.com/",
			});
		});

		test("a new blog can be created", async ({ page }) => {
			const blog = page.locator(".blog", { hasText: "A Thousand Acres" });
			await expect(blog).toBeVisible();
		});

		test("a new blog can be liked", async ({ page }) => {
			const blog = page.locator(".blog", { hasText: "A Thousand Acres" });
			await expect(blog).toBeVisible();

			await blog.getByRole("button", { name: "view" }).click();
			await blog.getByRole("button", { name: "like" }).click();

			await expect(blog.getByText("likes 0")).not.toBeVisible();
			await expect(blog.getByText("likes 1")).toBeVisible();
		});
	});

	describe("And a few blogs exist", () => {
		beforeEach(async ({ page }) => {
			await loginWith(page, "testuser", "password");
			await createBlog(page, {
				title: "King Lear",
				author: "William Shakespear",
				url: "https://shakespear.com/",
			});
			await createBlog(page, {
				title: "Death of a Salesman",
				author: "Arthur Miller",
				url: "https://arthurmiller.com/",
			});
			await createBlog(page, {
				title: "The Odyssey",
				author: "Home",
				url: "https://homersodessy.com/",
			});
		});

		test("a blog can be deleted", async ({ page }) => {
			const blog = page.locator(".blog", { hasText: "Death of a Salesman" });
			await expect(blog).toBeVisible();

			await blog.getByRole("button", { name: "view" }).click();

			const removeButton = blog.getByRole("button", { name: "remove" });
			await expect(removeButton).toBeVisible();

			// Confirm removal
			page.on("dialog", (dialog) => dialog.accept());
			await blog.getByRole("button", { name: "remove" }).click();

			const notification = page.locator(".notification");
			await expect(notification).toHaveCSS("color", "rgb(255, 0, 0)");
			await expect(notification).toContainText(
				`Blog 'Death of a Salesman by Arthur Miller' has been removed from the server`
			);

			await expect(blog).not.toBeVisible();
		});

		test("only the user who added the blog sees the blog's delete button", async ({
			page,
		}) => {
			const blog = page.locator(".blog", { hasText: "King Lear" });
			await expect(blog).toBeVisible();

			await blog.getByRole("button", { name: "view" }).click();
			await expect(blog.getByRole("button", { name: "remove" })).toBeVisible();

			await page.getByRole("button", { name: "logout" }).click();

			await loginWith(page, "johndoe", "jdoe1234");

			await blog.getByRole("button", { name: "view" }).click();
			await expect(
				blog.getByRole("button", { name: "remove" })
			).not.toBeVisible();
		});

		test("blogs are organized by most likes to least", async ({ page }) => {
			const blog1 = page.locator(".blog", { hasText: "Death of a Salesman" });
			const blog2 = page.locator(".blog", { hasText: "The Odyssey" });

			await expect(blog1).toBeVisible();
			await expect(blog2).toBeVisible();

			await blog1.getByRole("button", { name: "view" }).click();
			await blog1.getByRole("button", { name: "like" }).click();
			await blog1.getByRole("button", { name: "like" }).click();

			await blog2.getByRole("button", { name: "view" }).click();
			await blog2.getByRole("button", { name: "like" }).click();
			await blog2.getByRole("button", { name: "like" }).click();
			await blog2.getByRole("button", { name: "like" }).click();

			await expect(page.locator(".blog").nth(0)).toContainText("The Odyssey");
			await expect(page.locator(".blog").nth(1)).toContainText(
				"Death of a Salesman"
			);
		});
	});
});

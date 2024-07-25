const loginWith = async (page, username, password) => {
	try {
		await page.getByTestId("username").fill(username);
		await page.getByTestId("password").fill(password);
		await page.getByRole("button", { hasText: "login" }).click();
	} catch (err) {
		console.error("Error logging in user:", err);
	}
};

const createBlog = async (page, { title, author, url }) => {
	try {
		await page.getByRole("button", { name: "add blog" }).click();
		await page.getByTestId("title").fill(title);
		await page.getByTestId("author").fill(author);
		await page.getByTestId("url").fill(url);
		await page.getByRole("button", { name: "create" }).click();

		page.getByText(`A new blog "${title}" by ${author} added`).waitFor();
	} catch (error) {
		console.error(`Error during blog creation:`, error);
		throw error;
	}
};

export { loginWith, createBlog };

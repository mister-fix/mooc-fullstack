exports.loginWith = async (page, username, password) => {
	await page.getByTestId("username").fill(username);
	await page.getByTestId("password").fill(password);
	await page.getByRole("button", { name: "login" }).click();
};

exports.createBlog = async (page, { title, author, url }) => {
	try {
		await page.getByRole("button", { name: "add blog" }).click();
		await page.getByTestId("title").fill(title);
		await page.getByTestId("author").fill(author);
		await page.getByTestId("url").fill(url);
		await page.getByRole("button", { name: "create" }).click();

		await page.getByTestId("blog-title").and(page.getByText(title)).waitFor();
	} catch (error) {
		console.error("Error in createBlog:", error);
		throw error;
	}
};

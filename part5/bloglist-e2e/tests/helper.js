exports.loginWith = async (page, username, password) => {
	await page.getByTestId("username").fill(username);
	await page.getByTestId("password").fill(password);
	await page.getByRole("button", { name: "login" }).click();
};

exports.createBlog = async (page, content) => {
	await page.getByRole("button", { name: "add blog" }).click();
	await page.getByTestId("title").fill(content.title);
	await page.getByTestId("author").fill(content.author);
	await page.getByTestId("url").fill(content.url);
	await page.getByRole("button", { name: "create" }).click();
	await page.getByTestId("blog-title").waitFor();
};

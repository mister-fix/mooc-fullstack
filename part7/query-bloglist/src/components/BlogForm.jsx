import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const createNewBlog = (event) => {
    event.preventDefault();

    createBlog({ title, author, url });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div className="blog-form bg-light p-4 rounded border">
      <h2>Create new blog</h2>

      <Form onSubmit={createNewBlog}>
        <div className="d-flex w-100 justify-content-between mt-3">
          <Form.Group style={{ width: "49%" }}>
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </Form.Group>
          <Form.Group style={{ width: "49%" }}>
            <Form.Label>Author:</Form.Label>
            <Form.Control
              type="text"
              name="author"
              id="author"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </Form.Group>
        </div>
        <Form.Group className="mt-3">
          <Form.Label>URL:</Form.Label>
          <Form.Control
            type="text"
            name="url"
            id="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Create
        </Button>
      </Form>
    </div>
  );
};

export default BlogForm;

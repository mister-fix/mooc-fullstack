import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import axios from "axios";

// const promise = axios.get("http://localhost:3001/notes");
// console.log(promise);

// const promise2 = axios.get("http://localhost:3001/foobar");
// console.log(promise2);

// const promise = axios.get("http://localhost:3001/notes");
// promise.then((response) => {
// 	console.log(response);
// });

// axios.get("http://localhost:3001/notes").then((response) => {
// 	const notes = response.data;
// 	console.log(notes);
// });

// const notes = [
// 	{
// 		id: 1,
// 		content: "HTML is easy",
// 		important: true,
// 	},
// 	{
// 		id: 2,
// 		content: "Browser can execute only JavaScript",
// 		important: false,
// 	},
// 	{
// 		id: 3,
// 		content: "GET and POST are the most important methods of HTTP protocol",
// 		important: true,
// 	},
// ];

// Whilst this works, it is NOT a recommended way to fetch data from a
// server and feed it to the app, if the server were to go down then we wouldn't able to render the App component
axios.get("http://localhost:3001/notes").then((response) => {
	const notes = response.data;
	ReactDOM.createRoot(document.getElementById("root")).render(
		<App notes={notes} />
	);
});

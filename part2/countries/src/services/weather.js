import axios from "axios";

const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const api_key = import.meta.env.VITE_OWM_KEY;

const getWeather = (lat, lon) => {
	const request = axios.get(
		`${baseUrl}?lat=${lat}&lon=${lon}&appid=${api_key}`
	);
	return request.then((response) => response.data);
};

export default {
	getWeather,
};

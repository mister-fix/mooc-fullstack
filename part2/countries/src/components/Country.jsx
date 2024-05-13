const Country = ({ country, weatherData }) => {
	return (
		<div>
			<h2>{country.name.common}</h2>
			<p>capital {country.capital}</p>
			<p>area {country.area}</p>

			<h4>languages:</h4>
			<ul>
				{Object.keys(country.languages).map((language) => (
					<li key={language}>{country.languages[language]}</li>
				))}
			</ul>

			<img
				src={country.flags.png}
				alt="Country Flag"
				width={150}
			/>

			{weatherData ? (
				<>
					<h2>Weather in {country.name.common}</h2>
					<p>temperature {Math.floor(weatherData.main.temp - 273.15)}°C</p>
					<img
						src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
						alt="Weather icon"
					/>
					<p>wind {weatherData.wind.speed} m/s</p>
				</>
			) : null}
		</div>
	);
};

export default Country;

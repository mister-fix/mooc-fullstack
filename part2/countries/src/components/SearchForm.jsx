const SearchForm = ({ value, handler }) => {
	return (
		<div>
			find countries{" "}
			<input
				type="search"
				value={value}
				onChange={handler}
			/>
		</div>
	);
};

export default SearchForm;

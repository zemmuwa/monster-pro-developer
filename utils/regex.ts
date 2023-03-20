const REGEX = {
	PHONE_NUMBER: /^(\+62|62|0)[1-9][1-9][0-9]{4,11}$/,
	YEAR: /^\d{4}$/,
	ONLY_NUMBER:/^\d+$/,
	EMAIL_UNIQUE_REGEX:/^\w{7,60}@\w+([\.-]?\w+)$/,
}

export default REGEX

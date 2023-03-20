export const formatNumber = (
	amount: string | number,
	decimalCount = 2,
	decimal = ',',
	thousands = '.'
) => {
	let newAmount = undefined
	if (typeof amount == 'string') {
		newAmount = Number(amount)
	} else {
		newAmount = amount
	}
	try {
		decimalCount = Math.abs(decimalCount)
		decimalCount = isNaN(decimalCount) ? 2 : decimalCount

		const negativeSign = newAmount < 0 ? '-' : ''

		const i = parseInt(
			(newAmount = Math.abs(newAmount || 0).toFixed(decimalCount))
		).toString()
		const j = i.length > 3 ? i.length % 3 : 0

		const result =
			negativeSign +
			(j ? i.substring(0, j) + thousands : '') +
			i.substring(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
			(decimalCount
				? decimal +
				  Math.abs(Number(newAmount) - Number(i))
						.toFixed(decimalCount)
						.slice(2)
						.replace(/(\.0+|0+)$/, '')
				: '')
		if (result.endsWith(decimal)) return result.replace(decimal, '')
		return result
	} catch (e) {
		console.log(e)
	}
}

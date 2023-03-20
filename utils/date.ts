import moment from 'moment'

moment.updateLocale('id', {
	months: [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember',
	],
})

moment.updateLocale('id', {
	calendar: {
		lastDay: 'Kemarin',
		sameDay: 'Hari ini',
		nextDay: 'Besok',
		lastWeek: '[Last] dddd',
		nextWeek: '[Next] dddd',
		sameElse: 'L',
	},
})

export const formatDateDash = (
	date: string | Date | undefined,
	withTime?: boolean
) => {
	if (date === undefined || date === '') {
		return ''
	} else {
		return withTime
			? moment(date).format('YYYY-MM-DD HH:mm')
			: moment(date).format('YYYY-MM-DD')
	}
}
export const formatDateSlash = (
	date: string | Date | undefined,
	withTime?: boolean
) => {
	if (date === null || date === '') {
		return ''
	} else {
		return withTime
			? moment(date).format('DD/MM/YYYY HH:mm')
			: moment(date).format('DD/MM/YYYY')
	}
}

export const formatDateSpace = (
	date: string | Date | undefined,
	withTime?: boolean
) => {
	if (date === null || date === '') {
		return ''
	} else {
		return withTime
			? moment(date).locale('id').format('DD MMMM YYYY HH:mm')
			: moment(date).locale('id').format('DD MMMM YYYY')
	}
}

export const formatDateFromNow = (date: string | Date | undefined) => {
	if (date === null || date === '') {
		return ''
	} else {
		const label = moment(date).locale('id').fromNow()
		if (label == 'Kemarin' || label == 'Hari ini') {
			return label
		} else {
			return moment(date).locale('id').format('DD MMMM YYYY')
		}
	}
}

export const formatTime = (date: string | Date | undefined) => {
	if (date === undefined || date === '') {
		return ''
	} else {
		return moment(date, 'HH:mm:ss').format('HH:mm')
	}
}
export const formatIsoString = (
	date: string | Date | undefined,
	onlyDate?: boolean
) => {
	if (date === undefined || date === '') {
		return ''
	} else {
		return onlyDate
			? moment(date).toISOString().split('T')[0]
			: moment(date).toISOString()
	}
}

export const getMomentNow = () => moment().toISOString()

export const isBeforeDateNow = (date: string | Date | undefined) => {
	return moment(date, 'MM/DD/YYYY').isBefore(moment())
}
export const isAfterDateNow = (date: string | Date | undefined) => {
	return moment(date, 'MM/DD/YYYY').isAfter(moment())
}
export const isAfterDateTimeNow = (date: string | Date | undefined) => {
	return moment(date).isAfter(moment())
}
export const isBeforeDateTimeNow = (date: string | Date | undefined) => {
	return moment(date).isBefore(moment())
}
export const monthDateRange = (
	start: string | Date | undefined,
	end: string | Date | undefined
) => {
	return moment(end).diff(moment(start), 'months', true)
}
export const milisDateRange = (
	start: string | Date | undefined,
	end: string | Date | undefined
) => {
	const duration = moment.duration(moment(end).diff(moment(start)))
	return duration.asMilliseconds()
}

export const msToMS = (ms: number, withHours?: boolean) => {
	// 1- Convert to seconds:
	let seconds = ms / 1000
	// 2- Extract hours:
	const hours = Math.floor(seconds / 3600) // 3,600 seconds in 1 hour
	seconds = seconds % 3600 // seconds remaining after extracting hours
	// 3- Extract minutes:
	const minutes = Math.floor(seconds / 60) // 60 seconds in 1 minute
	// 4- Keep only seconds not extracted to minutes:
	seconds = Math.floor(seconds % 60)
	return withHours
		? (hours < 10 ? '0' : '') +
				hours +
				':' +
				(minutes < 10 ? '0' : '') +
				minutes +
				':' +
				(seconds < 10 ? '0' : '') +
				seconds
		: (minutes < 10 ? '0' : '') +
				minutes +
				':' +
				(seconds < 10 ? '0' : '') +
				seconds
}

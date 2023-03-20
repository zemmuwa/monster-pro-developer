import React, { ReactNode, useEffect, useRef } from 'react'
import { NumericFormat } from 'react-number-format'
import { InputAttributes } from 'react-number-format/types/types'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
interface PropsNumberFormatField {
	onChange: (value: string) => void
	onBlur?: () => void
	error?: string
	value?: string
	suffix?: string
	prefix?: string
	startAdornment?: ReactNode
	endAdornment?: ReactNode
	readOnly?: boolean
	isFocus?: boolean
}
const NumberFormatField = React.forwardRef<
	HTMLInputElement,
	PropsNumberFormatField
>(function NumberFormatField(props, ref) {
	const {
		onChange,
		error,
		value,
		prefix,
		suffix,
		startAdornment,
		endAdornment,
		readOnly,
		onBlur,
		...other
	} = props


	return (
		<NumericFormat
			readOnly={readOnly}
			customInput={TextField}
			size="small"
			{...other}
			fullWidth
			inputRef={ref}
			onBlur={onBlur}
			value={value}
			onValueChange={(values) => {
				onChange(values.value)
			}}

			thousandSeparator
			valueIsNumericString
			error={!!error}
			helperText={error}
			suffix={suffix}
			prefix={prefix}
			InputProps={{
				readOnly: readOnly,
				startAdornment: startAdornment ? (
					<InputAdornment position="start">{startAdornment}</InputAdornment>
				) : undefined,
				endAdornment: endAdornment ? (
					<InputAdornment position="end">{endAdornment}</InputAdornment>
				) : undefined,
			}}
		/>
	)
})
export default NumberFormatField

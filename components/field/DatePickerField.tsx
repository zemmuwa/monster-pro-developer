import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers'
import React from 'react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

interface PropsDatePickerField {
	value?: string | null
	onChange?: (v?: string | null) => void
}

function DatePickerField({
	value,
	onChange,
	...props
}: PropsDatePickerField & TextFieldProps) {
	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<DatePicker
				disabled={props.disabled}
				value={value}
				inputFormat="DD-MM-YYYY"
				onChange={(v) => (onChange ? onChange(v) : undefined)}
				renderInput={(propsDate) => (
					<TextField
						size="small"
						margin="none"
						fullWidth
						variant="outlined"
						{...propsDate}
						{...props}
					/>
				)}
			/>
		</LocalizationProvider>
	)
}

export default DatePickerField

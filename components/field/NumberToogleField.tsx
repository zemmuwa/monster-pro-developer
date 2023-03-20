import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { formatNumber } from '../../utils/number'
import NumberFormatField from './NumberFormatField'

interface PropsNumberToogleField {
	value?: string
	onChange: (val: string) => void
	error?: string
	readonly?: boolean
	prefix?: string
	suffix?: string
}

function NumberToogleField({
	value,
	onChange,
	error,
	readonly,
	prefix,
	suffix,
}: PropsNumberToogleField) {
	const [edit, setEdit] = useState(false)
	const label = readonly ? '0' : 'Klik untuk mengisi data'
	const inputRef = useRef<HTMLInputElement>(null)
	useEffect(() => {
		if (edit) {
			inputRef.current?.focus()
		}
	}, [edit])
	return edit ? (
		<NumberFormatField
			ref={inputRef}
			value={value}
			onChange={onChange}
			onBlur={() => setEdit(false)}
			error={error}
			startAdornment={prefix ? <Typography>{prefix}</Typography> : undefined}
			endAdornment={
				suffix ? <Typography fontWeight={600}>{suffix}</Typography> : undefined
			}
		/>
	) : (
		<Typography
			variant="caption"
			color={!!error ? 'error.main' : readonly ? 'grey.400' : undefined}
			fontWeight={700}
			onClick={readonly ? undefined : () => setEdit(true)}
			sx={{ cursor: readonly ? undefined : 'pointer' }}
		>
			{isFinite(value as unknown as number) && value != ''
				? `${prefix ?? ''}${formatNumber(value as unknown as number)}${
						suffix ?? ''
				  }`
				: label}
		</Typography>
	)
}

export default NumberToogleField

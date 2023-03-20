import { Typography } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import React from 'react'
import useFetch from '../../hooks/useFetch'
import { NestedKeyOf } from '../../types/globals'
import getByKey from '../../utils/object-utils'
import CloseIcon from '@mui/icons-material/Close'
interface PropsAutoCompleteField<T extends object> {
	labelKey: NestedKeyOf<T> | (string & {})
	valueKey: NestedKeyOf<T> | (string & {})
	value: T | undefined
	onChange: (v: T | undefined) => void
	error: string | undefined
	multiple?: boolean
	placeholder?: string
	disabled?: boolean
	data: T[]
}

function AutoCompleteField<T extends object>({
	labelKey,
	valueKey,
	value,
	onChange,
	error,
	multiple,
	placeholder,
	disabled,
	data,
}: PropsAutoCompleteField<T>) {
	return (
		<>
			<Autocomplete
				disabled={disabled}
				multiple={multiple}
				size="small"
				value={value || null}
				onChange={(event: any, newValue: unknown) => {
					onChange(newValue as T)
				}}
				isOptionEqualToValue={(option, valueOption) =>
					getByKey(option, valueKey) === getByKey(valueOption, valueKey)
				}
				getOptionLabel={(option) => getByKey(option, labelKey)}
				options={data}
				ChipProps={
					multiple
						? {
								sx: {
									color: 'white',
									borderRadius: '6px',
									height: '24px',
									background:
										'linear-gradient(81.62deg, #314A60 2.25%, #151928 79.87%)',
									'& .MuiSvgIcon-root': { fill: 'white' },
								},
								deleteIcon: <CloseIcon />,
						  }
						: undefined
				}
				renderInput={(params) => (
					<TextField
						error={!!error}
						helperText={error}
						placeholder={placeholder}
						{...params}
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<React.Fragment>
									{params.InputProps.endAdornment}
								</React.Fragment>
							),
						}}
					/>
				)}
			/>
		</>
	)
}

export default AutoCompleteField

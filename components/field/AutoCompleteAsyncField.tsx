import { Box, Typography } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import React, { useEffect, useRef, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { NestedKeyOf } from '../../types/globals'
import getByKey from '../../utils/object-utils'
import CloseIcon from '@mui/icons-material/Close'
import useDebounce from '../../hooks/useDebounce'
interface PropsAutoCompleteAsyncField<T extends object> {
	// data:T[]
	endpoint: string
	servicePath?: string
	labelKey: NestedKeyOf<T> | (string & {})
	valueKey: NestedKeyOf<T> | (string & {})
	value: T | undefined
	onChange: (v: T | undefined) => void
	error: string | undefined
	multiple?: boolean
	placeholder?: string
	params?: any
	searchKey?: string
	disabled?: boolean
}

function AutoCompleteAsyncField<T extends object>({
	endpoint,
	labelKey,
	valueKey,
	value,
	onChange,
	error,
	multiple,
	servicePath,
	placeholder,
	params,
	searchKey,
	disabled,
}: PropsAutoCompleteAsyncField<T>) {
	const [open, setOpen] = React.useState(false)
	const liRef = useRef(null)
	const liRefOld = useRef(null)
	const [search, setSearch] = useState('')
	const searchDebounce = useDebounce(search, 500)
	const { data, getAll, loading, setData } = useFetch(endpoint, servicePath, {
		limit: 10,
		mode: 'next',
	})
	// React.useEffect(() => {
	// 	if (!open) {
	// 		setData([])
	// 	} else {
	// 		getAll(params)
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [open])

	const handleScroll = async (e: any) => {
		const bottom =
			Math.floor(e.target.scrollHeight - e.target.scrollTop) ===
			e.target.clientHeight
		if (bottom) {
			await getAll(params, { nextPage: true })
			liRefOld.current = liRef?.current
		}
	}
	useEffect(() => {
		if (data.length > 10) {
			console.log(liRef?.current)
			;(liRefOld.current as any)?.scrollIntoView({
				behavior: 'auto',
				block: 'start',
			})
		}
	}, [data])

	useEffect(() => {
		if (open) {
			const filters = [[searchKey, 'like', searchDebounce]]
			if (params.filters) {
				filters.push(['AND'])
				filters.push(params.filters)
			}
			getAll({
				...params,
				filters: JSON.stringify(filters),
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchDebounce, open])

	return (
		<>
			<Autocomplete
				disabled={disabled}
				multiple={multiple}
				size="small"
				open={open}
				inputValue={search}
				onInputChange={(ev, v) => setSearch(v)}
				value={value || null}
				onChange={(event: any, newValue: unknown) => {
					onChange(newValue as T)
				}}
				filterOptions={(opt) => opt}
				ListboxProps={{ onScroll: handleScroll }}
				renderOption={(P, o, s) => (
					<li {...P} ref={liRef}>
						{getByKey(o, labelKey)}
					</li>
				)}
				onOpen={() => {
					setOpen(true)
				}}
				onClose={() => {
					setOpen(false)
				}}
				isOptionEqualToValue={(option, valueOption) =>
					getByKey(option, valueKey) === getByKey(valueOption, valueKey)
				}
				getOptionLabel={(option) => getByKey(option, labelKey)}
				options={data}
				loading={loading}
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
						// value={search}
						// onChange={(v) => setSearch(v.target.value)}
						{...params}
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<React.Fragment>
									{loading ? (
										<CircularProgress color="inherit" size={20} />
									) : null}
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

export default AutoCompleteAsyncField

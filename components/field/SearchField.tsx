import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import useDebounce from '../../hooks/useDebounce'

interface PropsSearchField {
	onChange?: (value: string) => void
}
function SearchField({ onChange }: PropsSearchField) {
	const [search, setSearch] = useState('')
	const searchDebounce = useDebounce(search, 500)
	useEffect(() => {
		if (onChange) onChange(searchDebounce)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchDebounce])
	return (
		<TextField
			value={search}
			onChange={(v) => setSearch(v.target.value)}
			size="small"
			margin="none"
			fullWidth
			variant="outlined"
			InputProps={{
				sx: { backgroundColor: 'background.paper' },
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon />
					</InputAdornment>
				),
			}}
			placeholder="Cari di sini..."
			autoFocus
		/>
	)
}

export default SearchField

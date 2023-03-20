import DeleteIcon from '@mui/icons-material/Clear'
import MuiChip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { ChangeEvent, KeyboardEvent, useState } from 'react'


const Chip = styled(MuiChip)`
	font-size: 10px;
	color: white;
	& .MuiChip-deleteIcon {
		color: white;
	}
`
interface PropsTagField {
	value: string[]
	onSpace: (v: string[]) => void
	onDel: (v: string[]) => void
	onBlur?: () => void
	error?: boolean
	helperText?: string
}
function TagField({
	value,
	onSpace,
	onDel,
	onBlur,
	error,
	helperText,
}: PropsTagField) {
	// const [chips, setChips] = useState<string[]>([])
	const [input, setInput] = useState<string>('')

	const onChange = (v: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setInput(v.target.value)
	}
	const onKeyUp = (v: KeyboardEvent<HTMLDivElement>) => {
		if (v.key == ' ') {
			onSpace([...value, input.trim()])
			// setChips((v) => [...v, input.trim()])
			setInput('')
		}
	}
	const onDelete = (index: number) => {
		const newBlockArray = [...value]
		newBlockArray.splice(index, 1)
		onDel(newBlockArray)
	}
	return (
		<Stack>
			<TextField
				sx={{ mb: '2px' }}
				value={input}
				onChange={onChange}
				onKeyUp={onKeyUp}
				onBlur={onBlur}
				size="small"
				error={error}
				helperText={helperText}
				fullWidth
				variant="outlined"
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Stack spacing={1} direction={'row'}>
								{value.map((v, index) => (
									<Chip
										key={v}
										sx={{
											borderRadius: '6px',
											height: '24px',
											background:
												'linear-gradient(81.62deg, #314A60 2.25%, #151928 79.87%)',
										}}
										label={v}
										deleteIcon={
											<DeleteIcon sx={{ fontSize: '14px !important' }} />
										}
										onDelete={() => onDelete(index)}
									/>
								))}
							</Stack>
						</InputAdornment>
					),
				}}
			/>
			<Typography sx={{ mb: '16px' }} variant="caption" color={'grey.400'}>
				Gunakan Spasi untuk setiap Keyword
			</Typography>
		</Stack>
	)
}

export default TagField

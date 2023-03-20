import React from 'react'
import Chip from '@mui/material/Chip'
import { FormLabel } from '@mui/material'

interface PropsBlackChip {
	label: string
}

function BlackChip({ label }: PropsBlackChip) {
	return (
		<Chip
			sx={{
				borderRadius: '6px',
				height: '24px',
				color: 'white',
				background: 'linear-gradient(81.62deg, #314A60 2.25%, #151928 79.87%)',
			}}
			label={label}
		/>
	)
}

export default BlackChip

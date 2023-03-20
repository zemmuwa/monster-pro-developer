import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

interface PropsCustomChip {
	label: string
	color: string
	bgColor: string
	radius?: string | number
}

function CustomChip({radius, bgColor, color, label }: PropsCustomChip) {
	return (
		<Box
			px="10px"
			py="4px"
			border={1}
			borderColor={color}
			borderRadius={radius ?? '45px'}
			bgcolor={bgColor}
			width="fit-content"
		>
			<Typography color={color} fontWeight={600} fontSize="10px">
				{label}
			</Typography>
		</Box>
	)
}

export default CustomChip

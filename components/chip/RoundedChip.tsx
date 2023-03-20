import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { ReactNode } from 'react'

interface PropsRoundedChip {
	label?: string | ReactNode
	size?: string | number
	borderRadius?: string | number
	bgColor?: string
}
function RoundedChip({ bgColor, label, size, borderRadius }: PropsRoundedChip) {
	return (
		<Box
			bgcolor={bgColor ?? 'primary.main'}
			height={size ?? '24px'}
			sx={{ aspectRatio: '1/1' }}
			borderRadius={borderRadius ?? '100%'}
			justifyContent="center"
			alignItems="center"
			display="flex"
		>
			{typeof label == 'string' ? (
				<Typography fontWeight={700} variant="caption" color="white">
					{label}
				</Typography>
			) : (
				label
			)}
		</Box>
	)
}

export default RoundedChip

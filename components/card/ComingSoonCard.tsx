import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React from 'react'
import StayTuneIcon from '../icons/StayTuneIcon'

interface PropsComingSoonCard {
	height?: string | number
    title?:string
}

function ComingSoonCard({ height,title }: PropsComingSoonCard) {
	return (
		<Card sx={{ height: height }}>
			<Stack py={2} px={2.4} height="100%">
				<Typography variant="body2" fontWeight={700}>
					{title}
				</Typography>
				<Stack flexGrow={1} alignItems="center" justifyContent="center">
					<StayTuneIcon
						sx={{ width: '130px !important', height: '130px !important' }}
					/>
					<Typography color="grey.400">
						Kami akan segera meluncurkan fitur ini.
					</Typography>
					<Typography color="grey.400">Stay Tune!</Typography>
				</Stack>
			</Stack>
		</Card>
	)
}

export default ComingSoonCard

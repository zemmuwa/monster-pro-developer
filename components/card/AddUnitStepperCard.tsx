import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import React from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const listData = [
	'Informasi Unit',
	'Harga & Pembayaran',
	'Pilih Blok & Nomor',
]
interface PropsAddUnitStepperCard {
	value: number
	onChange: (index: number) => void
}
function AddUnitStepperCard(props: PropsAddUnitStepperCard) {
	const renderListAddDeveloperStepper = () => {
		return (
			<List
				sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto' }}
			>
				{listData.map((v, index) => (
					<ListItem
						sx={{
							'& .MuiListItemSecondaryAction-root': { height: '100%', py: 1 },
						}}
						key={index}
					>
						<ListItemButton
							selected={props.value == index}
							disabled={index > props.value}
							sx={{
								'&.Mui-selected': { bgcolor: 'transparent' },
								borderBottom: (theme) =>
									props.value == index
										? `2px solid ${theme.palette.primary.main}`
										: `2px solid ${theme.palette.grey[200]}`,
							}}
							onClick={() =>
								props.onChange(props.value == index ? props.value : index)
							}
						>
							<ListItemIcon>
								<Box
									display="flex"
									alignItems="center"
									justifyContent="center"
									bgcolor={props.value == index ? 'primary.main' : 'grey.200'}
									sx={{ borderRadius: '100%' }}
									height="28px"
									width="28px"
								>
									<Typography
										color={props.value == index ? undefined : 'grey.400'}
										variant="body2"
										fontWeight={700}
									>
										{index + 1}
									</Typography>
								</Box>
							</ListItemIcon>
							<Stack direction="row">
								<ListItemText
									primary={v}
									primaryTypographyProps={{
										fontWeight: 700,
										fontSize: '14px',
										noWrap: true,
										color: props.value == index ? undefined : 'grey.400',
									}}
								/>
							</Stack>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		)
	}

	return (
		<Card sx={{ width: '100%', height: 'fit-content', display: 'flex' }}>
			<CardContent
				sx={{
					px: 0,
					py: 0 +'!important',
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
				}}
			>
				{renderListAddDeveloperStepper()}
			</CardContent>
		</Card>
	)
}

export default AddUnitStepperCard

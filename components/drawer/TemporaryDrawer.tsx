import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { createContext, PropsWithChildren } from 'react'

export const TemporaryDrawerContext = createContext({
	onClose: () => {},
	onSuccess: () => {},
})
interface PropsTemporaryDrawer {
	onClose: () => void
	onSuccess: () => void
	isOpen: boolean
	title: string
}
export default function TemporaryDrawer({
	onClose,
	isOpen,
	title,
	children,
	onSuccess,
}: PropsWithChildren<PropsTemporaryDrawer>) {
	return (
		<TemporaryDrawerContext.Provider value={{ onClose, onSuccess }}>
			<Drawer variant="temporary" anchor="right" open={isOpen}>
				<Box
					sx={{
						maxWidth: 851,
						borderBottomLeftRadius: '24px',
						pt: '24px',
						// pb: '10px',
						height: '100vh',
						display: 'flex',
						flexDirection: 'column',
						overflow: 'hidden',
					}}
					role="presentation"
				>
					<Stack
						direction={'row'}
						alignItems="center"
						// mb={'32px'}
						pl="40px"
						pr="24px"
						justifyContent={'space-between'}
					>
						<Typography variant="h4">{title}</Typography>
						<Button
							onClick={onClose}
							color="inherit"
							variant="contained"
							component="label"
							sx={{ p: 0, width: 48, height: 48, fontSize: '16px' }}
						>
							<CloseIcon />
						</Button>
					</Stack>
					{children}
				</Box>
			</Drawer>
		</TemporaryDrawerContext.Provider>
	)
}

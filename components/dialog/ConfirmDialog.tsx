import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { Breakpoint, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { PropsWithChildren, ReactNode } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

interface PropsConfirmDialog {
	open: boolean
	onClose: () => void
	title: string
	renderAction: ReactNode
	maxWidth?:Breakpoint
}

function ConfirmDialog({
	onClose,
	open,
	children,
	title,
	renderAction,
	maxWidth
}: PropsWithChildren<PropsConfirmDialog>) {
	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
	return (
		<Dialog
			open={open}
			// onClose={onClose}
			scroll="paper"
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
			maxWidth={maxWidth??'xs'}
			fullScreen={fullScreen}
			fullWidth={!fullScreen}
		>
			<DialogTitle>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography variant="h5" fontWeight={700}>
						{title}
					</Typography>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="apps"
						onClick={onClose}
						// sx={{ mr: 2 }}
					>
						<CloseIcon sx={{ fontSize: 24, color: 'text.primary' }} />
					</IconButton>
				</Stack>
			</DialogTitle>
			<DialogContent>{children}</DialogContent>
			<Divider/>
			<DialogActions>{renderAction}</DialogActions>
		</Dialog>
	)
}

export default ConfirmDialog

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { Breakpoint, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { PropsWithChildren, ReactNode } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export interface PropsDefaultDialog {
	open: boolean
	onClose: () => void
	title: string
	maxWidth?: Breakpoint
	renderHeader?: ReactNode
}

function DefaultDialog({
	onClose,
	open,
	children,
	title,
	maxWidth,
	renderHeader,
}: PropsWithChildren<PropsDefaultDialog>) {
	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
	return (
		<Dialog
			open={open}
			// onClose={onClose}
			scroll="paper"
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
			maxWidth={maxWidth ?? 'md'}
			fullScreen={fullScreen}
			fullWidth={!fullScreen}
		>
			<DialogTitle>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					{renderHeader ?? (
						<Typography variant="h5" fontWeight={700}>
							{title}
						</Typography>
					)}
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
		</Dialog>
	)
}

export default DefaultDialog

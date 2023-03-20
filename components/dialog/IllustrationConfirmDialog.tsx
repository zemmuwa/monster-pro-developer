import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Image from 'next/image'
import React from 'react'
import { subtle } from 'crypto'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
interface PropsIllustrationConfirmDialog {
	open: boolean
	loading?: boolean
	onClose: () => void
	title: string
	content: string
	onOk: () => void
}
function IllustrationConfirmDialog({
	onClose,
	open,
	title,
	content,
	onOk,
	loading,
}: PropsIllustrationConfirmDialog) {
	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
	return (
		<Dialog
			open={open}
			// onClose={onClose}
			scroll="paper"
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
			maxWidth="sm"
			fullScreen={fullScreen}
			fullWidth={!fullScreen}
		>
			{/* <DialogTitle>
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
			</DialogTitle> */}
			<DialogContent>
				<Stack alignItems="center">
					<Box maxWidth="400px" width="400px" mb={3}>
						<Image
							width={512}
							height={275}
							alt="rei-logo"
							layout="responsive"
							unoptimized
							src={'/assets/mail-illustration.png'}
						/>
					</Box>
					<Typography
						maxWidth="400px"
						textAlign="center"
						variant="h4"
						fontWeight={700}
						mb={2}
					>
						{title}
					</Typography>
					<Typography
						maxWidth="480px"
						color="grey.400"
						textAlign="center"
						variant="body1"
					>
						{content}
					</Typography>
					<Stack direction="row" spacing={2} mt={3} mb={4}>
						<LoadingButton
							sx={{ alignSelf: 'start' }}
							onClick={onOk}
							variant="contained"
							loading={loading}
						>
							<Typography color="white" fontWeight={700} variant="body2">
								SIMPAN
							</Typography>{' '}
						</LoadingButton>
						<Button
							sx={{ alignSelf: 'start' }}
							onClick={onClose}
							variant="contained"
							color="inherit"
						>
							<Typography color="grey.400" fontWeight={700} variant="body2">
								KEMBALI
							</Typography>{' '}
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	)
}

export default IllustrationConfirmDialog

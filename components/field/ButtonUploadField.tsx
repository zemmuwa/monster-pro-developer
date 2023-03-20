import UploadIcon from '@mui/icons-material/CloudUpload'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { LoadingButton, LoadingButtonProps } from '@mui/lab'
import CancelIcon from '@mui/icons-material/Cancel'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import useApiUpload from '../../hooks/useApiUpload'
import helper from '../../utils/helper'
import ErrorLabel from '../label/ErrorLabel'

interface PropsButtonUploadField {
	onChange: (v?: { url?: string; id?: string }) => void
	value?: string
	error?: string
	types?: string[]
	text?: boolean
	title?: string
	label?: string
}
function ButtonUploadField({
	onChange,
	error,
	value,
	types,
	text,
	title,
	label,
	...buttonProps
}: PropsButtonUploadField & Omit<LoadingButtonProps, 'onChange'>) {
	const { upload, loading } = useApiUpload()
	const [errorSize, setErrorSize] = useState(false)
	const handleChange = async (v: File) => {
		setErrorSize(false)
		const res = await upload({
			files: v,
		})
		if ('url' in res) {
			onChange({
				url: helper.fileUrl(res.url),
				id: res.id,
			})
		}
	}
	return value ? (
		text ? (
			<Stack
				direction="row"
				spacing={1}
				alignItems="center"
				// border={(thm) => `1px solid ${thm.palette.grey[200]}`}
				p={0.5}
				borderRadius="6px"
				// pl={1}
			>
				<Link
					target={'_blank'}
					noWrap
					color="inherit"
					variant="body2"
					fontWeight={700}
					href={value}
				>
					{title ?? value}
				</Link>
				{!buttonProps?.disabled && (
					<IconButton color="error" onClick={() => onChange(undefined)}>
						<CancelIcon
							sx={{ fontSize: 14, color: `error.main${' !important'}` }}
						/>
					</IconButton>
				)}
			</Stack>
		) : (
			<Box>
				<Stack justifyContent={'center'} spacing={'8px'}>
					<Box position={'relative'} width="fit-content">
						<FileCopyOutlinedIcon
							sx={{ color: '#031559', width: '60px', height: '60px' }}
						/>
						{!buttonProps?.disabled && (
							<IconButton
								sx={{ position: 'absolute', top: -10, right: -14 }}
								color="error"
								onClick={() => onChange(undefined)}
							>
								<HighlightOffIcon
									sx={{ fontSize: 24, color: `error.main${' !important'}` }}
								/>
							</IconButton>
						)}
					</Box>

					<Link
						target={'_blank'}
						color="inherit"
						href={value}
						variant="caption"
						noWrap
					>
						{title ?? value}
					</Link>
				</Stack>
			</Box>
		)
	) : (
		<FileUploader
			handleChange={handleChange}
			name="file"
			types={types}
			disabled={loading || value || buttonProps?.disabled}
			maxSize={5}
			onSizeError={() => setErrorSize(true)}
		>
			<Stack>
				<LoadingButton
					color="inherit"
					variant="contained"
					sx={{
						color: 'text.primary',
						backgroundColor: 'white',
						width: 'fit-content',
					}}
					startIcon={<UploadIcon />}
					loading={loading}
					{...buttonProps}
				>
					{loading ? 'Proses...' : label ?? 'Unggah'}
				</LoadingButton>
				{error && <ErrorLabel>{error}</ErrorLabel>}
				{!error && errorSize && (
					<ErrorLabel>Berkas tidak boleh lebih dari 5mb</ErrorLabel>
				)}
			</Stack>
		</FileUploader>
	)
}

export default ButtonUploadField

import UploadIcon from '@mui/icons-material/CloudUpload'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactNode, useContext, useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import useApiUpload from '../../hooks/useApiUpload'
import ErrorLabel from '../label/ErrorLabel'
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import helper from '../../utils/helper'
import Link from '@mui/material/Link'
import { ToastProviderContext } from '../../providers/ToastProvider'

interface PropsUploadFileField {
	onChange: (v?: { url?: string; id?: string }) => void
	types: string[]
	label: string
	value?: string
	error?: string
	icon?: ReactNode
	title?: string
	disabled?: boolean
}

function UploadFileField({
	onChange,
	label,
	value,
	error,
	types,
	icon,
	title,
	disabled,
}: PropsUploadFileField) {
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
		<Box
			display={'flex'}
			flexDirection="column"
			justifyContent={'center'}
			alignItems="center"
			width={'100%'}
			height={'100%'}
		>
			<Stack
				bgcolor={'grey.300'}
				// width={'300px'}
				width={'100%'}
				pb={'28px'}
				pt={'54px'}
				alignItems={'center'}
				borderRadius="8px"
				border="1px dashed #67748E"
			>
				{icon ? (
					<>{icon}</>
				) : (
					<FilePresentOutlinedIcon sx={{ fontSize: 48, color: 'grey.400' }} />
				)}
				<Box width="80%" display={'flex'} justifyContent="center">
					<Link
						target={'_blank'}
						mb={'15px'}
						color={'grey.400'}
						variant="body2"
						fontWeight={700}
						noWrap
						textAlign="center"
						href={value}
					>
						{title ?? value}
					</Link>
				</Box>
				{!disabled && (
					<Button
						onClick={() => onChange(undefined)}
						color="error"
						variant="contained"
						sx={{ color: 'white' }}
						startIcon={<ClearOutlinedIcon />}
					>
						Clear
					</Button>
				)}
			</Stack>
			{error && <ErrorLabel>{error}</ErrorLabel>}
		</Box>
	) : (
		<FileUploader
			handleChange={handleChange}
			types={types}
			disabled={loading || value || disabled}
			maxSize={5}
			onSizeError={() => setErrorSize(true)}
		>
			<Box
				display={'flex'}
				flexDirection="column"
				justifyContent={'center'}
				alignItems="center"
				width={'100%'}
				height={'100%'}
			>
				<Stack
					bgcolor={'grey.300'}
					// width={'300px'}
					width={'100%'}
					pb={'28px'}
					pt={'54px'}
					alignItems={'center'}
					borderRadius="8px"
					border="1px dashed #67748E"
				>
					{loading ? (
						<CircularProgress color="primary" size={48} />
					) : icon ? (
						<>{icon}</>
					) : (
						<FilePresentOutlinedIcon sx={{ fontSize: 48, color: 'grey.400' }} />
					)}

					<Typography
						mb={'15px'}
						color={'grey.400'}
						variant="body2"
						fontWeight={700}
					>
						{loading ? 'Proses...' : label+' : max 5mb'}
					</Typography>
					<Button
						color="inherit"
						variant="contained"
						sx={{ color: 'text.primary', backgroundColor: 'white' }}
						startIcon={<UploadIcon />}
					>
						Unggah
					</Button>
				</Stack>
				{error && <ErrorLabel>{error}</ErrorLabel>}
				{!error && errorSize && (
					<ErrorLabel>Berkas tidak boleh lebih dari 5mb</ErrorLabel>
				)}
			</Box>
		</FileUploader>
	)
}

export default UploadFileField

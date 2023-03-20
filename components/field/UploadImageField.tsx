import UploadIcon from '@mui/icons-material/CloudUpload'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import ImageIcon from '@mui/icons-material/ImageOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import useApiUpload from '../../hooks/useApiUpload'
import helper from '../../utils/helper'
import ErrorLabel from '../label/ErrorLabel'

interface PropsUploadImageField {
	onChange: (v?: { url?: string; id?: string }) => void
	label: string
	value?: string
	error?: string
	notSquare?: boolean
	disabled?: boolean
}

function UploadImageField({
	onChange,
	label,
	value,
	error,
	notSquare,
	disabled,
}: PropsUploadImageField) {
	const [errorSize, setErrorSize] = useState(false)
	const { upload, loading } = useApiUpload()
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
			sx={{
				backgroundImage: `url("${value}")`,
				backgroundSize: 'cover',
				backgroundPosition: '50%',
				overflow: 'hidden',
				borderRadius: '12px',
				width: '100%',
				height: '100%',
				flex: 1,
				position: 'relative',
				aspectRatio: notSquare ? undefined : '1',
			}}
		>
			{!disabled && (
				<IconButton
					sx={{ position: 'absolute', right: '4px', top: '4px' }}
					color="error"
					onClick={() => onChange(undefined)}
				>
					<HighlightOffIcon
						sx={{ fontSize: 24, color: `error.main${' !important'}` }}
					/>
				</IconButton>
			)}
		</Box>
	) : (
		<FileUploader
			handleChange={handleChange}
			types={['JPG', 'PNG','JPEG']}
			disabled={loading || value}
			classes="file-uploader"
			maxSize={2}
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
					) : (
						<ImageIcon sx={{ fontSize: 48, color: 'grey.400' }} />
					)}

					<Typography
						mb={'15px'}
						color={'grey.400'}
						variant="body2"
						fontWeight={700}
					>
						{loading ? 'Proses...' : label}
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
					<ErrorLabel>Gambar tidak boleh lebih dari 2mb</ErrorLabel>
				)}
			</Box>
		</FileUploader>
	)
}

export default UploadImageField

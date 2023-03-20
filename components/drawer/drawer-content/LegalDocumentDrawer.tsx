import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import dynamic from 'next/dynamic'
import React, { useContext, useEffect, useState } from 'react'
import { EditorState } from 'react-draft-wysiwyg'
import { Controller, useForm } from 'react-hook-form'
import useApiCUD from '../../../hooks/useApiCUD'
import { ToastProviderContext } from '../../../providers/ToastProvider'
import ENDPOINTS from '../../../utils/constants/endpoints'
import { draftJsToHtml, htmlToDraftJs } from '../../../utils/draftJs'
import CustomForm from '../../form/CustomForm'
import CustomSwitch from '../../switch/CustomSwitch'
import { TemporaryDrawerContext } from '../TemporaryDrawer'
const Editor = dynamic(
	() => import('react-draft-wysiwyg').then((mod) => mod.Editor),
	{ ssr: false }
)
import {
	ILegalDocumentGet,
	ILegalDocumentPostBody,
	ILegalDocumentPutBody,
} from '../../../interfaces/interfaceApiLegalDocument'
import legalDocumentFormSchema, {
	LegalDocumentFormValues,
} from '../../../schema/legalDocumentSchema'
import helper from '../../../utils/helper'
interface PropsLegalDrawerDrawer {
	data?: ILegalDocumentGet
}
function LegalDocumentDrawer({ data }: PropsLegalDrawerDrawer) {
	const { openToast } = useContext(ToastProviderContext)
	const {
		handleSubmit,
		control,
		formState: { errors },
		register,
		setValue,
	} = useForm<LegalDocumentFormValues>({
		resolver: yupResolver(legalDocumentFormSchema),
	})
	const { onClose, onSuccess } = useContext(TemporaryDrawerContext)
	const [isActive, setIsActive] = useState(false)
	const {
		create: legaldocumentCreate,
		edit: legaldocumentEdit,
		loading: legaldocumentLoading,
	} = useApiCUD(
		ENDPOINTS.MASTER_LEGAL_DOCUMENT,
		process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
	)

	const doSave = async (values: LegalDocumentFormValues) => {
		const res = await legaldocumentCreate<ILegalDocumentPostBody>({
			code: values.code,
			description: draftJsToHtml(editor),
			content_type: values.title,
			active: isActive,
		})
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Ditambahkan.')
			onSuccess()
		}
	}

	const doEdit = async (values: LegalDocumentFormValues) => {
		const res = await legaldocumentEdit<ILegalDocumentPutBody>(
			{
				content_type: values.title,
				code: values.code,
				description: draftJsToHtml(editor),
				active: isActive,
			},
			data?.id ?? '0'
		)
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Diubah.')
			onSuccess()
		}
	}

	const fillForm = () => {
		setValue('title', data?.content_type ?? '')
		setValue('code', data?.code ?? '')
		setValue('desc', data?.description ?? '')
		setEditor(htmlToDraftJs(data?.description ?? ''))
		setIsActive(data?.active ?? false)
	}
	const [editor, setEditor] = useState<EditorState | undefined>(undefined)
	const handleChangeEditor = (arg: EditorState): void => {
		setEditor(arg)
	}

	useEffect(() => {
		if (data) fillForm()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])
	return (
		<>
			<CustomForm onSubmit={handleSubmit(data ? doEdit : doSave)}>
				<Stack
					pb={'12px'}
					width={'569px'}
					pl="40px"
					pr="24px"
					flexGrow={1}
					overflow="auto"
				>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Kode Dokumen
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						{...register('code')}
						helperText={errors.code?.message ?? undefined}
						error={!!errors.code?.message}
						placeholder=""
					/>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Judul
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						{...register('title')}
						helperText={errors.title?.message ?? undefined}
						error={!!errors.title?.message}
						placeholder=""
					/>
					<Controller
						control={control}
						name="desc"
						render={({ field: { onBlur, onChange, value } }) => (
							<Editor
								editorState={editor}
								toolbarClassName="toolbar-editor"
								wrapperClassName="wrapper-editor"
								editorClassName="input-editor"
								onChange={(v) => {
									onChange(v.blocks?.[0].text)
								}}
								onEditorStateChange={handleChangeEditor}
							/>
						)}
					/>
				</Stack>
				<Divider />
				<Stack
					justifyContent={'space-between'}
					spacing={2}
					direction={'row'}
					pl="40px"
					pr="24px"
					pt="20px"
					pb="10px"
				>
					<Stack spacing={2} direction={'row'}>
						<LoadingButton
							type="submit"
							loading={legaldocumentLoading}
							size="small"
							sx={{ color: 'white' }}
							variant="contained"
						>
							SAVE
						</LoadingButton>
						<Button
							size="small"
							color="inherit"
							sx={{ backgroundColor: 'grey.300' }}
							variant="contained"
							onClick={onClose}
						>
							CANCEL
						</Button>
					</Stack>
					<Stack spacing={2} alignItems="center" direction={'row'}>
						<Typography color={'grey.400'} fontWeight={600} variant="body2">
							Aktifkan
						</Typography>
						<CustomSwitch
							checked={isActive}
							onChange={(v, c) => setIsActive(c)}
							color="success"
						/>
					</Stack>
				</Stack>
			</CustomForm>
		</>
	)
}

export default LegalDocumentDrawer

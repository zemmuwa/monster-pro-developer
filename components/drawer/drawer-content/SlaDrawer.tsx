import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useApiCUD from '../../../hooks/useApiCUD'
import {
	ISlaGet,
	ISlaPostBody,
	ISlaPutBody,
} from '../../../interfaces/interfaceApiSla'
import { ToastProviderContext } from '../../../providers/ToastProvider'
import slaFormSchema, { SlaFormValues } from '../../../schema/slaFormSchema'
import ENDPOINTS from '../../../utils/constants/endpoints'
import CustomForm from '../../form/CustomForm'
import CustomSwitch from '../../switch/CustomSwitch'
import { TemporaryDrawerContext } from '../TemporaryDrawer'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import helper from '../../../utils/helper'
import NumberFormatField from '../../field/NumberFormatField'
interface PropsSlaDrawer {
	data?: ISlaGet
}
function SlaDrawer({ data }: PropsSlaDrawer) {
	const { openToast } = useContext(ToastProviderContext)
	const {
		handleSubmit,
		control,
		formState: { errors },
		register,
		setValue,
	} = useForm<SlaFormValues>({
		resolver: yupResolver(slaFormSchema),
	})
	const { onClose, onSuccess } = useContext(TemporaryDrawerContext)
	const [isActive, setIsActive] = useState(false)
	const {
		create: slaCreate,
		edit: slaEdit,
		loading: slaLoading,
	} = useApiCUD(
		ENDPOINTS.MASTER_SLA,
		process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
	)

	const doSave = async (values: SlaFormValues) => {
		const res = await slaCreate<ISlaPostBody>({
			title: values.title,
			active: isActive,
			code_sla: values.code,
			description: values.desc,
			time: Number(values.hour),
		})
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Ditambahkan.')
			onSuccess()
		}
	}

	const doEdit = async (values: SlaFormValues) => {
		const res = await slaEdit<ISlaPutBody>(
			{
				title: values.title,
				active: isActive,
				code_sla: values.code,
				description: values.desc,
				time: Number(values.hour),
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
		setValue('title', data?.title ?? '')
		setValue('code', data?.code_sla ?? '')
		setValue('desc', data?.description ?? '')
		setValue('hour', data?.time.toString() ?? '')
		setIsActive(data?.active ?? false)
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
						Kode SLA
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						{...register('code')}
						helperText={errors.code?.message ?? undefined}
						error={!!errors.code?.message}
					/>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Judul SLA
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						{...register('title')}
						helperText={errors.title?.message ?? undefined}
						error={!!errors.title?.message}
					/>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Deskripsi SLA
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						{...register('desc')}
						helperText={errors.desc?.message ?? undefined}
						error={!!errors.desc?.message}
					/>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Waktu (dalam Jam)
					</Typography>
					<Controller
						control={control}
						name="hour"
						render={({ field: { onBlur, onChange, value } }) => (
							<NumberFormatField
								onChange={onChange}
								error={errors.hour?.message}
								value={value}
								suffix="Jam"
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
							loading={slaLoading}
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

export default SlaDrawer

import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useApiCUD from '../../../hooks/useApiCUD'
import {
	IProvinceGet,
	IProvincePostBody,
	IProvincePutBody,
} from '../../../interfaces/interfaceApiProvince'
import { ToastProviderContext } from '../../../providers/ToastProvider'
import ENDPOINTS from '../../../utils/constants/endpoints'
import CustomForm from '../../form/CustomForm'
import CustomSwitch from '../../switch/CustomSwitch'
import { TemporaryDrawerContext } from '../TemporaryDrawer'
import provinceFormSchema, {
	ProvinceFormValues,
} from '../../../schema/provinceFormSchema'
import helper from '../../../utils/helper'

interface PropsProvinceDrawer {
	data?: IProvinceGet
}
function ProvinceDrawer({ data }: PropsProvinceDrawer) {
	const { openToast } = useContext(ToastProviderContext)
	const {
		handleSubmit,
		control,
		formState: { errors },
		register,
		setValue,
	} = useForm<ProvinceFormValues>({
		resolver: yupResolver(provinceFormSchema),
	})
	const { onClose, onSuccess } = useContext(TemporaryDrawerContext)
	const [isActive, setIsActive] = useState(false)
	const {
		create: provinceCreate,
		edit: provinceEdit,
		loading: provinceLoading,
	} = useApiCUD(
		ENDPOINTS.MASTER_PROVINCE,
		process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
	)

	const doSave = async (values: ProvinceFormValues) => {
		const res = await provinceCreate<IProvincePostBody>({
			province_name: values.name,
			active: isActive,
		})
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Ditambahkan.')
			onSuccess()
		}
	}

	const doEdit = async (values: ProvinceFormValues) => {
		const res = await provinceEdit<IProvincePutBody>(
			{ province_name: values.name, active: isActive },
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
		setValue('name', data?.province_name ?? '')
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
						Nama Provinsi
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						{...register('name')}
						helperText={errors.name?.message ?? undefined}
						error={!!errors.name?.message}
						placeholder="Contoh: Jawa Timur"
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
							loading={provinceLoading}
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

export default ProvinceDrawer

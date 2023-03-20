import { yupResolver } from '@hookform/resolvers/yup'
import CircleIcon from '@mui/icons-material/Circle'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AppBarProviderContext } from '../components/appbar/DefaultAppBar'
import DefaultBreadcrumb from '../components/breadcrumb/DefaultBreadcrumb'
import AddDeveloperStepperCard from '../components/card/AddDeveloperStepperCard'
import IllustrationConfirmDialog from '../components/dialog/IllustrationConfirmDialog'
import AutoCompleteAsyncField from '../components/field/AutoCompleteAsyncField'
import UploadFileField from '../components/field/UploadFileField'
import UploadImageField from '../components/field/UploadImageField'
import BuildingIcon from '../components/icons/BuildingIcon'
import useApiCUD from '../hooks/useApiCUD'
import useDisclose from '../hooks/useDisclose'
import { IDeveloperPostBody } from '../interfaces/interfaceApiDeveloper'
import { ToastProviderContext } from '../providers/ToastProvider'
import ENDPOINTS from '../utils/constants/endpoints'
import helper from '../utils/helper'
import developerFormSchema, {
	DeveloperFormValues,
} from '../schema/DeveloperFormSchema'
import { useRouter } from 'next/router'
const dataBreadcrumb = [
	{ label: 'Daftar Developer', path: '/' },
	{ label: 'Tambah Developer', path: '' },
]

const AddDeveloper: NextPage = () => {
	const { openToast } = useContext(ToastProviderContext)
	const router = useRouter()
	const { setTitle, setMenu, setLeftHeader } = useContext(AppBarProviderContext)
	const [step, setStep] = useState(0)
	const [hasAgent, sethasAgent] = useState(false)
	const {
		close: dialogClose,
		isOpen: dialogIsOpen,
		open: dialogOpen,
	} = useDisclose()
	const onChangeHasAgent = (event: React.ChangeEvent<HTMLInputElement>) => {
		sethasAgent(event.target.checked)
	}
	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
		getValues,
		watch,
	} = useForm<DeveloperFormValues>({
		resolver: yupResolver(developerFormSchema.developerFormSchema1),
	})
	const {
		handleSubmit: handleSubmit2,
		control: control2,
		formState: { errors: errors2 },
		setValue: setValue2,
		getValues: getValues2,
		watch: watch2,
		register: register2,
	} = useForm<DeveloperFormValues>({
		resolver: yupResolver(developerFormSchema.developerFormSchema2),
	})
	const {
		handleSubmit: handleSubmit3,
		control: control3,
		formState: { errors: errors3 },
		setValue: setValue3,
		getValues: getValues3,
		watch: watch3,
		register: register3,
	} = useForm<DeveloperFormValues>({
		resolver: yupResolver(developerFormSchema.developerFormSchema3),
	})

	const nextForm = () => {
		if (step < 2) setStep((v) => v + 1)
		else dialogOpen()
	}

	const { create: developerCreate, loading: developerLoadingCud } = useApiCUD(
		ENDPOINTS.DEVELOPER,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const doSave = async () => {
		const body: IDeveloperPostBody = {
			company_id: getValues('company')?.id,
			logo_id: getValues2('logo')?.id,
			logo_url: helper.filePath(getValues2('logo')?.url ?? ''),
			developer_name: getValues2('developer_name'),
			year_of_establishment: Number(getValues2('year_of_establishment')),
			office_phone: getValues2('office_phone'),
			admin_phone: getValues2('admin_phone'),
			master_city_id: getValues2('master_city')?.id,
			description: getValues2('description'),
			have_inhouse: getValues2('have_inhouse'),
			rei_membership_document_id: getValues2('rei_membership_document')?.id,
			rei_membership_document_url: helper.filePath(
				getValues2('rei_membership_document')?.url ?? ''
			),
			rei_membership_number: Number(getValues2('rei_membership_number')),
			email: getValues3('email'),
			membership_id: getValues3('membership')?.id,
		}
		await doCreate(body)
	}

	const doCreate = async (body: IDeveloperPostBody) => {
		const res = await developerCreate<IDeveloperPostBody>(body)
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Ditambahkan.')
			dialogClose()
			router.push('/')
		}
	}

	const renderFirstForm = (
		<Stack>
			<Typography variant="body1" fontWeight={700} color="grey.400" mb={2}>
				Informasi Perusahaan
			</Typography>
			<Typography variant="caption" fontWeight={700} mb="10px">
				Nama Perusahaan
			</Typography>
			<Controller
				control={control}
				name="company"
				render={({ field: { onBlur, onChange, value } }) => (
					<Box width={{ xs: '100%', md: '50%' }}>
						<AutoCompleteAsyncField
							endpoint={ENDPOINTS.COMPANY}
							servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
							labelKey={'name'}
							valueKey={'id'}
							value={value}
							onChange={onChange}
							error={errors.company?.message || errors.company?.id?.message}
							// params={{
							// 	filters: JSON.stringify(['is_active', 'like', true]),
							// }}
							params={{sort:'name'}}
							searchKey="name"
						/>
					</Box>
				)}
			/>
			{!!watch('company') && (
				<Card
					sx={{
						border: '1px solid',
						borderColor: 'grey.400',
						borderRadius: '8px',
						boxShadow: 'none',
						p: 2,
						mt: 2,
					}}
				>
					<Stack direction="row" spacing={1} height="100%" alignItems="center">
						<Avatar
							src={helper.fileUrl(getValues('company')?.logo_url ?? '')}
							alt="company-image"
							variant="rounded"
							sx={{
								height: '100%',
								width: '56px',
								aspectRatio: '1/1',
							}}
						/>
						<Stack
							justifyContent={'space-evenly'}
							sx={{ mr: 'auto !important' }}
						>
							<Stack direction="row" alignItems="center">
								<Typography
									color={'black'}
									fontWeight={700}
									mr="6px"
									variant="body1"
								>
									{getValues('company')?.name}
								</Typography>
							</Stack>
							<Stack direction="row" alignItems="center" spacing={1}>
								<BuildingIcon
									fillOpacity={0}
									sx={{
										fontSize: '16px',
										stroke: (theme) => theme.palette.grey[400],
									}}
								/>
								<Typography noWrap color={'grey.400'} variant="caption">
									{getValues('company')?.master_city.city_name}
								</Typography>
								<CircleIcon
									sx={{ color: 'grey.700', fontSize: '6px', mx: 1 }}
								/>
								<MailOutlineIcon
									sx={{
										fontSize: '14px',
										color: (theme) => theme.palette.grey[400],
									}}
								/>
								<Typography noWrap color={'grey.400'} variant="caption">
									{getValues('company')?.email}
								</Typography>
							</Stack>
						</Stack>
						<IconButton
							onClick={() => setValue('company', undefined)}
							sx={{ alignSelf: 'start' }}
							size="small"
						>
							<CloseIcon color="inherit" width="16px" height="16px" />
						</IconButton>
					</Stack>
				</Card>
			)}
			<Button
				sx={{ alignSelf: 'start', mt: 3 }}
				onClick={handleSubmit(nextForm)}
				variant="contained"
			>
				<Typography color="white" fontWeight={700} variant="body2">
					SELANJUTNYA
				</Typography>{' '}
			</Button>
		</Stack>
	)

	const renderSecondForm = (
		<Stack>
			<Typography variant="body1" fontWeight={700} color="grey.400" mb={2}>
				Informasi Developer
			</Typography>
			<Typography variant="caption" fontWeight={700} mb="10px">
				Logo Developer
			</Typography>
			<Box minWidth={'300px'} alignSelf={'start'} mb={2}>
				<Controller
					control={control2}
					name="logo"
					render={({ field: { onBlur, onChange, value } }) => (
						<UploadImageField
							onChange={(v) => setValue2('logo', { id: v?.id, url: v?.url })}
							value={value?.url}
							label={'Logo Developer (.JPEG, .JPG, .PNG)'}
							error={errors2.logo?.url?.message || errors2.logo?.id?.message}
						/>
					)}
				/>
			</Box>
			<Grid container columnSpacing={1}>
				<Grid item xs={12} sm={6}>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Nama Developer
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						placeholder="Tulis Nama Developer"
						{...register2('developer_name')}
						helperText={errors2.developer_name?.message ?? undefined}
						error={!!errors2.developer_name?.message}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Tahun Berdiri
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						placeholder="Contoh: 1990"
						{...register2('year_of_establishment')}
						helperText={errors2.year_of_establishment?.message ?? undefined}
						error={!!errors2.year_of_establishment?.message}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Nomor Telp Kantor Developer
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						placeholder="Contoh: 08xxxxxxxxxx"
						{...register2('office_phone')}
						helperText={errors2.office_phone?.message ?? undefined}
						error={!!errors2.office_phone?.message}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Nomor Telp Admin
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						placeholder="Contoh: 08xxxxxxxxxx"
						{...register2('admin_phone')}
						helperText={errors2.admin_phone?.message ?? undefined}
						error={!!errors2.admin_phone?.message}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Kota / Kabupaten (Kantor Pusat)
					</Typography>
					<Controller
						control={control2}
						name="master_city"
						render={({ field: { onBlur, onChange, value } }) => (
							<AutoCompleteAsyncField
								endpoint={ENDPOINTS.MASTER_CITY}
								servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
								labelKey={'city_name'}
								valueKey={'id'}
								value={value}
								onChange={onChange}
								placeholder="Pilih Kota / Kabupaten"
								error={
									errors2.master_city?.message ||
									errors2.master_city?.id?.message
								}
								params={{
									filters: ['active', '=', true],
									sort:"city_name"
								}}
								searchKey="city_name"
							/>
						)}
					/>
				</Grid>
			</Grid>
			<Typography variant="caption" fontWeight={700} mb="10px">
				Deskripsi Informasi Developer
			</Typography>
			<TextField
				sx={{ mb: '16px' }}
				size="small"
				fullWidth
				rows={4}
				multiline
				variant="outlined"
				placeholder="Tulis Deskripsi"
				{...register2('description')}
				helperText={errors2.description?.message ?? undefined}
				error={!!errors2.description?.message}
			/>
			<Stack direction="row" alignItems="center">
				<Controller
					control={control2}
					name="have_inhouse"
					render={({ field: { onBlur, onChange, value } }) => (
						<Checkbox
							disableRipple
							size="small"
							onBlur={onBlur}
							checked={value}
							onChange={onChange}
						/>
					)}
				/>

				<Typography variant="caption" color="black">
					Memiliki Agen Inhouse
				</Typography>
			</Stack>
			<Stack
				borderRadius={3}
				p={1}
				bgcolor={'primary.200'}
				spacing={1.5}
				direction="row"
				alignItems="center"
				mt={2}
			>
				<InfoIcon color="primary" />
				<Typography variant="caption" fontWeight={700}>
					Dengan mencentang checkbox di atas, Anda akan mendapatkan kode referral
					untuk pembuatan akun Agency Inhouse di Monster Pro
				</Typography>
			</Stack>
			<Typography
				variant="body1"
				fontWeight={700}
				color="grey.400"
				mb={2}
				mt={4}
			>
				Keanggotaan REI
			</Typography>
			<Box minWidth={'300px'} alignSelf={'start'} mb={2}>
				<Controller
					control={control2}
					name="rei_membership_document"
					render={({ field: { onBlur, onChange, value } }) => (
						<UploadFileField
							onChange={(v) =>
								setValue2('rei_membership_document', { id: v?.id, url: v?.url })
							}
							value={value?.url}
							label={'Sertifikat REI (.PDF)'}
							error={errors2.rei_membership_document?.id?.message}
							types={['PDF']}
							icon={
								<PictureAsPdfIcon sx={{ fontSize: 48, color: 'grey.400' }} />
							}
						/>
					)}
				/>
				<TextField
					sx={{ my: '16px' }}
					size="small"
					fullWidth
					variant="outlined"
					placeholder="No. Sertifikat"
					{...register2('rei_membership_number')}
					helperText={errors2.rei_membership_number?.message ?? undefined}
					error={!!errors2.rei_membership_number?.message}
				/>
			</Box>

			<Stack direction="row" spacing={2} mt={3}>
				<Button
					sx={{ alignSelf: 'start' }}
					onClick={handleSubmit2(nextForm)}
					variant="contained"
				>
					<Typography color="white" fontWeight={700} variant="body2">
						SELANJUTNYA
					</Typography>{' '}
				</Button>
				<Button
					sx={{ alignSelf: 'start' }}
					onClick={() => setStep(step - 1)}
					variant="contained"
					color="inherit"
				>
					<Typography color="grey.400" fontWeight={700} variant="body2">
						KEMBALI
					</Typography>{' '}
				</Button>
			</Stack>
		</Stack>
	)

	const renderThirdForm = (
		<Stack>
			<Typography variant="body1" fontWeight={700} color="grey.400" mb={2}>
				Akun Developer
			</Typography>
			<Typography variant="caption" fontWeight={700} mb="10px">
				Email Developer
			</Typography>
			<Box width={{ xs: '100%', sm: '50%' }}>
				<TextField
					sx={{ mb: '16px' }}
					size="small"
					fullWidth
					variant="outlined"
					placeholder="Contoh: Monster.pro@email.com"
					{...register3('email')}
					helperText={errors3.email?.message ?? undefined}
					error={!!errors3.email?.message}
				/>
			</Box>
			<Typography variant="caption" fontWeight={700} mb="10px">
				Membership
			</Typography>
			<Controller
				control={control}
				name="membership"
				render={({ field: { onBlur, onChange, value } }) => (
					<Box width={{ xs: '100%', md: '50%' }} mb={2}>
						<AutoCompleteAsyncField
							endpoint={ENDPOINTS.MEMBERSHIP}
							servicePath={process.env.NEXT_PUBLIC_USER_PATH}
							labelKey={'name'}
							valueKey={'id'}
							value={value}
							onChange={onChange}
							error={errors3.membership?.message}
							params={{
								filters: ['code', 'like', 'DEV'],
								sort:"name"
							}}
							searchKey="name"
						/>
					</Box>
				)}
			/>
			<Stack direction="row" spacing={2} mt={3}>
				<Button
					sx={{ alignSelf: 'start' }}
					onClick={handleSubmit3(nextForm)}
					variant="contained"
				>
					<Typography color="white" fontWeight={700} variant="body2">
						SELANJUTNYA
					</Typography>{' '}
				</Button>
				<Button
					sx={{ alignSelf: 'start' }}
					onClick={() => setStep(step - 1)}
					variant="contained"
					color="inherit"
				>
					<Typography color="grey.400" fontWeight={700} variant="body2">
						KEMBALI
					</Typography>{' '}
				</Button>
			</Stack>
		</Stack>
	)
	const renderFormByStep = () => {
		if (step == 0) return renderFirstForm
		if (step == 1) return renderSecondForm
		if (step == 2) return renderThirdForm
	}

	useEffect(() => {
		setTitle('Developer')
		setMenu([])
		setLeftHeader(undefined)
	}, [setLeftHeader, setMenu, setTitle])

	return (
		<>
			<Stack height="100%">
				<DefaultBreadcrumb data={dataBreadcrumb} />
				<Grid spacing={1} container sx={{ px: 4 }} flexGrow={1} overflow="auto">
					<Grid container item md={4} xs={12} lg={3}>
						<AddDeveloperStepperCard value={step} onChange={setStep} />
					</Grid>
					<Grid
						item
						md={8}
						xs={12}
						lg={9}
						flexDirection="column"
						display={'flex'}
					>
						<Box
							borderRadius="12px"
							p={3}
							boxShadow={1}
							bgcolor="background.paper"
							mb={1}
						>
							{renderFormByStep()}
						</Box>
					</Grid>
				</Grid>
			</Stack>
			<IllustrationConfirmDialog
				open={dialogIsOpen}
				onClose={dialogClose}
				loading={developerLoadingCud}
				title={'Anda yakin untuk menyimpan data developer?'}
				content={
					'Pihak developer akan menerima email yang berisi password yang akan digunakan untuk login portal'
				}
				onOk={doSave}
			/>
		</>
	)
}

export default AddDeveloper

import AddIcon from '@mui/icons-material/Add'
import { Divider } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'
import HelpIcon from '@mui/icons-material/Help'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import AutoCompleteField from '../../field/AutoCompleteField'
import NumberFormatField from '../../field/NumberFormatField'
import DropdownButton from '../../button/DropdownButton'
import DefaultPopover from '../../popover/DefaultPopover'

const bphtbData = [
	{ value: 5, label: '5%' },
	{ value: 6, label: '6%' },
	{ value: 7, label: '7%' },
	{ value: 8, label: '8%' },
	{ value: 9, label: '9%' },
	{ value: 10, label: '10%' },
]

interface PropsVariantSection {
	valuePpnMaster?: number
	valueUtjMaster?: number
	valueBphtbAmount?: number
	valueBphtbPercent?: string
	onChangeBphtbPercent?: (val: string) => void
	errorBphtbPercent?: string
	valueDiscount?: string
	onChangeDiscount?: (val: string) => void
	errorDiscount?: string
	valuePpn?: number
	onChangePpn?: (val: string) => void
	valueUtj?: number
	onChangeUtj?: (val: string) => void
	hideBphtpAmount?: boolean
	valueOther?: string
	onChangeOther?: (val: string) => void
	errorOther?: string
}

function VariantSection(props: PropsVariantSection) {
	const [isAddition, setIsAddition] = useState(false)
	const [isSubtraction, setIsSubtraction] = useState(false)
	const [isBphtb, setIsBphtb] = useState(false)
	const [isOther, setIsOther] = useState(false)
	const [isPpn, setIsPpn] = useState(false)
	const [isDiscount, setIsDiscount] = useState(false)
	const [isUtj, setIsUtj] = useState(false)

	const removeAddition = () => {
		setIsAddition(false)
		props?.onChangePpn?.('')
		props?.onChangeOther?.('')
		setIsOther(false)
		setIsPpn(false)
	}

	const onChangeBphtb = (val: boolean) => {
		setIsBphtb(val)
		props?.onChangeBphtbPercent?.(val ? bphtbData[0]?.value?.toString() : '')
	}
	const onChangeOther = (val: boolean) => {
		setIsOther(val)
		props?.onChangeOther?.(val ? props.valueOther?.toString() ?? '' : '')
	}
	const onChangePpn = (val: boolean) => {
		setIsPpn(val)
		props?.onChangePpn?.(val ? props.valuePpnMaster?.toString() ?? '' : '')
	}

	const removeSubtraction = () => {
		setIsSubtraction(false)
		props?.onChangeDiscount?.('')
		props?.onChangeUtj?.('')
		setIsDiscount(false)
		setIsUtj(false)
	}
	const onChangeDiscount = (val: boolean) => {
		setIsDiscount(val)
		props?.onChangeDiscount?.(val ? props.valueDiscount?.toString() ?? '' : '')
	}
	const onChangeUtj = (val: boolean) => {
		setIsUtj(val)
		props?.onChangeUtj?.(val ? props.valueUtjMaster?.toString() ?? '' : '')
	}

	useEffect(() => {
		if (Number(props.valueOther ?? '0') || props.valuePpn) {
			setIsAddition(true)
			if (props.valueOther) setIsOther(true)
			if (props.valuePpn) setIsPpn(true)
		}
	}, [props.valueOther, props.valuePpn])
	useEffect(() => {
		if (props.valueUtj || Number(props.valueDiscount ?? '0')) {
			setIsSubtraction(true)
			if (props.valueDiscount) setIsDiscount(true)
			if (props.valueUtj) setIsUtj(true)
		}
	}, [props.valueDiscount, props.valueUtj])
	return (
		<>
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				<Stack>
					<Typography variant="body2" fontWeight={700}>
						Tambah Varian
					</Typography>
					<Typography variant="caption" color="grey.400" mb="10px">
						Tambah varian pengurang atau penambah harga sesuai kebutuhan anda
					</Typography>
				</Stack>
				<DropdownButton
					variant="contained"
					color="primary"
					sx={{ background: 'primary.main' }}
					startIcon={<AddIcon color="warning" sx={{ fill: 'white' }} />}
					menuWidth={'auto'}
					disabled={isAddition && isSubtraction}
					menu={[
						{
							onClick: () => {
								setIsAddition(true)
							},
							disabled: isAddition,
							content: (
								<Stack direction="row" spacing={1}>
									<AddCircleOutlineOutlinedIcon />
									<Typography variant="caption">Penambah Harga</Typography>
								</Stack>
							),
						},
						{
							onClick: () => {
								setIsSubtraction(true)
							},
							disabled: isSubtraction,
							content: (
								<Stack direction="row" spacing={1}>
									<RemoveCircleOutlineOutlinedIcon />
									<Typography variant="caption">Pengurang Harga</Typography>
								</Stack>
							),
						},
					]}
				>
					<Typography fontWeight={700} variant="body2" color="white">
						Tambah Varian
					</Typography>
				</DropdownButton>
			</Stack>
			<Divider sx={{ my: 2 }} />
			{isAddition && (
				<>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Stack>
							<Typography variant="caption" fontWeight={700}>
								Penambah harga{' '}
								<Typography variant="caption" component="span" color="grey.400">
									(Akan ditambahkan ke harga bruto)
								</Typography>
							</Typography>
							<Typography variant="caption" color="grey.400" mb="10px">
								Contoh : PPN dan Penambah lainnya
							</Typography>
						</Stack>
						<Button onClick={removeAddition} variant="outlined" color="inherit">
							<Typography fontWeight={700} variant="body2">
								Hapus Varian
							</Typography>
						</Button>
					</Stack>
					<Stack direction="row" mb={2} alignItems="start" spacing={2}>
						<Stack spacing={1} flex={1}>
							<Stack direction="row" alignItems="center" spacing={1}>
								<Checkbox
									checked={isOther}
									onChange={(ev, val) => onChangeOther(val)}
									size="small"
									sx={{ p: 0 }}
								/>
								<Typography variant="body2">Penambah Lainnya</Typography>
								<DefaultPopover
									id="bphtb"
									renderContent={
										<Stack p={2} width="374px" spacing={2}>
											<Typography textAlign="center">
												Jika anda mencentang{' '}
												<Typography component="span" fontWeight={600}>
													“Penambah lainnya”
												</Typography>{' '}
												maka harga bruto unit yang anda masukkan akan otomatis{' '}
												<Typography component="span" fontWeight={600}>
													{' '}
													ditambah{' '}
												</Typography>
												sebesar pilihan anda.
											</Typography>
										</Stack>
									}
								>
									<HelpIcon
										sx={{
											width: '16px',
											height: '16px',
											fill: (thm) => thm.palette.grey[400],
										}}
									/>
								</DefaultPopover>
							</Stack>
							{/* {isBphtb && (
								<Stack direction="row" spacing={1}>
									<AutoCompleteField
										data={bphtbData}
										labelKey={'label'}
										valueKey={'value'}
										value={
											props?.valueBphtbPercent
												? {
														label: props?.valueBphtbPercent + '%',
														value: Number(props?.valueBphtbPercent),
												  }
												: undefined
										}
										onChange={(v) =>
											props?.onChangeBphtbPercent?.(v?.value?.toString() ?? '')
										}
										error={props?.errorBphtbPercent}
									/>
									{!props.hideBphtpAmount && (
										<NumberFormatField
											value={props?.valueBphtbAmount?.toString() ?? ''}
											readOnly
											startAdornment={<Typography>Rp</Typography>}
											onChange={function (value: string): void {
												throw new Error('Function not implemented.')
											}}
										/>
									)}
								</Stack>
							)} */}
							{isOther && (
								<NumberFormatField
									value={props?.valueOther}
									startAdornment={<Typography>Rp</Typography>}
									onChange={(v) => props?.onChangeOther?.(v)}
									error={props?.errorOther}
								/>
							)}
						</Stack>
						<Stack flex={1} spacing={1}>
							<Stack direction="row" alignItems="center" spacing={1}>
								<Checkbox
									checked={isPpn}
									onChange={(ev, val) => onChangePpn(val)}
									size="small"
									sx={{ p: 0 }}
								/>
								<Typography variant="body2">
									PPN {props?.valuePpnMaster ?? 0}%
								</Typography>
								<DefaultPopover
									id="ppn"
									renderContent={
										<Stack p={2} width="374px" spacing={2}>
											<Typography textAlign="center">
												Jika anda mencentang{' '}
												<Typography component="span" fontWeight={600}>
													“PPN {props?.valuePpnMaster ?? 0}%”
												</Typography>{' '}
												maka harga bruto unit yang anda masukkan akan otomatis
												<Typography component="span" fontWeight={600}>
													{' '}
													ditambah
												</Typography>{' '}
												sebesar {props?.valuePpnMaster ?? 0}%
											</Typography>
										</Stack>
									}
								>
									<HelpIcon
										sx={{
											width: '16px',
											height: '16px',
											fill: (thm) => thm.palette.grey[400],
										}}
									/>
								</DefaultPopover>
							</Stack>
						</Stack>
					</Stack>
					<Divider sx={{ my: 2 }} />
				</>
			)}
			{isSubtraction && (
				<>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Stack>
							<Typography variant="caption" fontWeight={700}>
								Pengurang harga{' '}
								<Typography variant="caption" component="span" color="grey.400">
									(Akan dikurangkan ke DP)
								</Typography>
							</Typography>
							<Typography variant="caption" color="grey.400" mb="10px">
								Contoh : UTJ, diskon, potongan, cashback, dll
							</Typography>
						</Stack>
						<Button
							onClick={removeSubtraction}
							variant="outlined"
							color="inherit"
						>
							<Typography fontWeight={700} variant="body2">
								Hapus Varian
							</Typography>
						</Button>
					</Stack>
					<Stack direction="row" mb={2} alignItems="start" spacing={2}>
						<Stack spacing={1} flex={1}>
							<Stack direction="row" alignItems="center" spacing={1}>
								<Checkbox
									checked={isDiscount}
									onChange={(ev, val) => onChangeDiscount(val)}
									size="small"
									sx={{ p: 0 }}
								/>
								<Typography variant="body2">
									Diskon/Cashback/Potongan lainnya
								</Typography>
								<DefaultPopover
									id="ppn"
									renderContent={
										<Stack p={2} width="374px" spacing={2}>
											<Typography textAlign="center">
												Jika anda mencentang{' '}
												<Typography component="span" fontWeight={600}>
													“Diskon/Cashback/Potongan lainnya”
												</Typography>{' '}
												maka harga yang anda masukkan akan otomatis{' '}
												<Typography component="span" fontWeight={600}>
													{' '}
													dikurangi{' '}
												</Typography>
												sebesar pilihan anda. Dan akan mengurangi DP Bruto
											</Typography>
										</Stack>
									}
								>
									<HelpIcon
										sx={{
											width: '16px',
											height: '16px',
											fill: (thm) => thm.palette.grey[400],
										}}
									/>
								</DefaultPopover>
							</Stack>

							{isDiscount && (
								<NumberFormatField
									value={props?.valueDiscount}
									startAdornment={<Typography>Rp</Typography>}
									onChange={(v) => props?.onChangeDiscount?.(v)}
									error={props?.errorDiscount}
								/>
							)}
						</Stack>
						<Stack flex={1} spacing={1}>
							<Stack direction="row" alignItems="center" spacing={1}>
								<Checkbox
									checked={isUtj}
									onChange={(ev, val) => onChangeUtj(val)}
									size="small"
									sx={{ p: 0 }}
								/>
								<Typography variant="body2">UTJ</Typography>
								<DefaultPopover
									id="ppn"
									renderContent={
										<Stack p={2} width="374px" spacing={2}>
											<Typography textAlign="center">
												Jika anda mencentang{' '}
												<Typography component="span" fontWeight={600}>
													“UTJ”
												</Typography>{' '}
												maka harga yang anda masukkan akan otomatis{' '}
												<Typography component="span" fontWeight={600}>
													{' '}
													dikurangi UTJ{' '}
												</Typography>
												Dan akan mengurangi DP Bruto
											</Typography>
										</Stack>
									}
								>
									<HelpIcon
										sx={{
											width: '16px',
											height: '16px',
											fill: (thm) => thm.palette.grey[400],
										}}
									/>
								</DefaultPopover>
							</Stack>
						</Stack>
					</Stack>
					<Divider sx={{ my: 2 }} />
				</>
			)}
		</>
	)
}

export default VariantSection

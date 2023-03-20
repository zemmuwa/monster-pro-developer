import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DefaultBreadcrumb from '../../../../components/breadcrumb/DefaultBreadcrumb'
import RoundedChip from '../../../../components/chip/RoundedChip'
import WhatsappIcon from '../../../../components/icons/WhatsappIcon'
import useMenuAppbar from '../../../../hooks/useMenuAppbar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import AllTransactionTab from '../../../../components/component-pages/e-wallet/AllTransactionTab'
import ProcessTransactionTab from '../../../../components/component-pages/e-wallet/ProcessTransactionTab'
import FinishedTransactionTab from '../../../../components/component-pages/e-wallet/FinishedTransactionTab'
import { IDeveloperGet } from '../../../../interfaces/interfaceApiDeveloper'
import useFetch from '../../../../hooks/useFetch'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import helper from '../../../../utils/helper'
import { formatNumber } from '../../../../utils/number'

const Ewallet: NextPage = () => {
	const router = useRouter()
	const { setCompanyApp } = useMenuAppbar()

	const { dataSingle: developerData, getOne: developerGetOne } =
		useFetch<IDeveloperGet>(
			ENDPOINTS.DEVELOPER,
			process.env.NEXT_PUBLIC_DEVELOPER_PATH
		)

	useEffect(() => {
		if (developerData) {
			setCompanyApp(
				developerData.developer_name,
				helper.fileUrl(developerData.logo_url)
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [developerData])

	useEffect(() => {
		if (router.query?.id) developerGetOne(`/${router.query.id}`)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])

	const dataBreadcrumb = [
		{ label: 'Dashboard', path: `/developer/${router.query.id}` },
		{ label: 'E-Wallet', path: '' },
	]

	const stepReimbursment = [
		'Pilih Transaksi yang ingin dicairkan',
		'Upload invoice sesuai denngan nominal yang akan dicairkan',
		'Tunggu proses pencairan dari Monster Pro kepada Anda',
		'Pencairan selesai dan Dana sudah masuk ke rekening Perusahaan Anda',
	]
	const renderSaldoCard = (
		<Stack height="100%" spacing={2}>
			<Stack
				borderRadius="12px"
				boxShadow={1}
				display="flex"
				flexGrow={1}
				bgcolor="background.paper"
				p={3}
				overflow="auto"
				className='custom-elevation-2'
			>
				<Typography variant="body1" color="black" mb={0.5}>
					Saldo E-Wallet
				</Typography>
				<Typography variant="h2" color="grey.700">
					Rp{' '}
					<Typography variant="h2" color="black" component="span">
						{formatNumber(developerData?.master_user?.ewallet?.balance ?? '')}
					</Typography>
				</Typography>
				<Divider sx={{ my: 3 }} />
				<Typography variant="body2" fontWeight={700} mb={2}>
					Bagaimana cara pencairan E-Wallet?
				</Typography>
				{stepReimbursment.map((srItem, srIndex) => (
					<Stack
						mb={2}
						direction="row"
						key={srIndex}
						spacing={1.5}
						alignItems="center"
					>
						<RoundedChip
							label={
								<Typography variant="body2" color="white" fontWeight={700}>
									{srIndex + 1}
								</Typography>
							}
						/>
						<Typography
							variant="caption"
							fontWeight={600}
							color="grey.400"
							component="span"
						>
							{srItem}
						</Typography>
					</Stack>
				))}
			</Stack>
			<Stack
				borderRadius="12px"
				boxShadow={1}
				flexShrink={1}
				flexGrow={0}
				bgcolor="background.paper"
				className='custom-elevation-2'
				p={2}
				overflow="auto"
			>
				<Stack width="fit-content" direction="row" spacing={2}>
					<WhatsappIcon />
					<Stack>
						<Typography fontWeight={700} variant="caption">
							Mengalami Kendala? Hubungi admin kami
						</Typography>
						<Typography variant="caption">
							Jika Anda mengalami kendala saat melakukan pencairan, harap
							hubungi kami melalui{' '}
							<Typography variant="caption" color="#317DFF">
								csmonsterpro@mail.com
							</Typography>
						</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	)
	const [tab, setTab] = useState(0)
	const renderDisbursementCard = (
		<Box
			borderRadius="12px"
			boxShadow={1}
			height="100%"
			bgcolor="background.paper"
			className='custom-elevation-2'
			p={3}
		>
			<Stack height="100%" spacing={3}>
				<Tabs sx={{ '& .Mui-selected': { color: 'black', fontWeight: 700, } }} value={tab} onChange={(ev, val) => setTab(val)}>
					<Tab label="Semua Transaksi" />
					<Tab label="Dalam Proses" />
					<Tab label="Pencairan Selesai" />
				</Tabs>
				{tab == 0 && <AllTransactionTab />}
				{tab == 1 && <ProcessTransactionTab showFile />}
				{tab == 2 && <FinishedTransactionTab showFile withReceipt />}
			</Stack>
		</Box>
	)

	return (
		<Stack height="100%">
			<DefaultBreadcrumb data={dataBreadcrumb} />
			<Container sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
				<Grid spacing={2} container pb={2} height="100%">
					<Grid item xs={12} md={4} height="100%">
						{renderSaldoCard}
					</Grid>
					<Grid item xs={12} md={8} height="100%">
						{renderDisbursementCard}
					</Grid>
				</Grid>
			</Container>
		</Stack>
	)
}

export default Ewallet

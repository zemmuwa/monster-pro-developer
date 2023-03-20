import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded'
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AppBarProviderContext } from '../components/appbar/DefaultAppBar'
import CompanyLeftToolbar from '../components/appbar/left-toolbar/CompanyLeftToolbar'
import BusinessmanIcon from '../components/icons/BusinessmanIcon'
import { TypeMuiIcon } from '../types/globals'

function useMenuAppbar() {
	const router = useRouter()
	const { setMenu, setLeftHeader, setTitle, setSettingContent } = useContext(
		AppBarProviderContext
	)

	const [loading, setLoading] = useState(false)

	const setCompanyApp = useCallback(
		(title: string, avatar: string) => {
			setLeftHeader(
				<CompanyLeftToolbar loading={loading} title={title} avatar={avatar} />
			)
		},
		[loading, setLeftHeader]
	)

	const setSettingContentDefault = useCallback(() => {
		setSettingContent([
			{
				content: (
					<Stack spacing={1} direction="row" alignItems="center">
						<AccountCircleIcon sx={{ fontSize: 20, fill: '#67748E' }} />
						<Typography fontWeight={700} variant="caption">
							Profil Developer
						</Typography>
					</Stack>
				),
				onClick: () =>
					router.push(`/cu/edit-developer/${router.query?.id ?? '0'}`),
			},
		])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setSettingContent])
	// State and setters for debounced value
	useEffect(
		() => {
			if (router.query?.id) {
				setSettingContentDefault()
			}
			// Update debounced value after delay
			setMenu([
				{
					label: 'Dashboard',
					icon: ViewComfyRoundedIcon,
					pathname: ['/developer/[id]', '/developer/[id]/e-wallet','/developer/[id]/e-wallet/order/[orderId]'],
					route: `/developer/${router.query.id}`,
				},
				{
					label: 'Daftar Proyek',
					icon: BusinessmanIcon as TypeMuiIcon,
					pathname: [
						'/developer/[id]/project-unit',
						'/developer/[id]/project-unit/[...cuProject]',
						'/developer/[id]/project-unit/add-unit',
						'/developer/[id]/project-unit/project/[projectId]',
						'/developer/[id]/project-unit/project/[projectId]/type-unit/[typeUnitId]/unit',
						'/developer/[id]/project-unit/project/[projectId]/type-unit/[typeUnitId]/unit/[...addUnit]',
						'/developer/[id]/project-unit/project/[projectId]/type-unit/[typeUnitId]',
						'/developer/[id]/project-unit/project/[projectId]/type-unit/cu/[...cuTypeUnit]',
					],
					route: `/developer/${router.query.id}/project-unit`,
				},
				{
					label: 'Transaksi',
					icon: CompareArrowsRoundedIcon,
					pathname: [
						'/developer/[id]/transaction',
						'/developer/[id]/transaction/[transactionId]',
					],
					route: `/developer/${router.query.id}/transaction`,
				},
			])
			return () => {
				setMenu([])
				setLeftHeader(undefined)
				setTitle('')
				setSettingContent([])
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[setMenu, router.query.id, setLeftHeader, setTitle] // Only re-call effect if value or delay changes
	)
	return { setCompanyApp, setLoading, setTitle }
}

export default useMenuAppbar

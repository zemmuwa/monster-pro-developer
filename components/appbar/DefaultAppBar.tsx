import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import AppsIcon from '@mui/icons-material/Apps'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import AppBar from '@mui/material/AppBar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useContext } from 'react'
import { TypeMuiIcon } from '../../types/globals'
import DropdownButton from '../button/DropdownButton'
import CircularProgress from '@mui/material/CircularProgress'
import useAuth from '../../hooks/useAuth'
import { PrivateRouteProviderContext } from '../../providers/PrivateRouteProvider'
import CommentDotIcon from '../icons/CommentDotIcon'
import LockIcon from '../icons/LockIcon'
import LogoutIcon from '../icons/LogoutIcon'
import NotificationButton from './notification/NotificationButton'

export type TypeSettingContent = { content: ReactNode; onClick?: () => void }

export const AppBarProviderContext = createContext({
	setTitle: (value: string) => {},
	setMenu: (value: TypeMenuItem[]) => {},
	setLeftHeader: (value: ReactNode) => {},
	setSettingContent: (value: TypeSettingContent[]) => {},
})

export interface TypeMenuItem {
	icon: TypeMuiIcon
	label: string
	route: string
	pathname: string | string[]
}

interface PropsDefaultAppbar {
	headerLogo?: ReactNode
	menuItem?: TypeMenuItem[]
	title?: string
	settingContent?: { content: ReactNode; onClick?: () => void }[]
}
function DefaultAppBar({
	headerLogo,
	menuItem,
	title,
	settingContent,
}: PropsDefaultAppbar) {
	const { userInfo } = useContext(PrivateRouteProviderContext)
	const theme = useTheme()
	const router = useRouter()
	const { logout, logoutLoading } = useAuth()
	const doLogout = async () => {
		logout()
	}
	return (
		<AppBar
			className="custom-elevation"
			sx={{ backgroundColor: 'background.paper', borderRadius: '35px' }}
			position="relative"
		>
			<Toolbar
				variant="dense"
				sx={{ justifyContent: 'space-between', alignItems: 'stretch' }}
			>
				<Box display={'flex'} alignItems={'center'}>
					{headerLogo ? (
						headerLogo
					) : (
						<>
							<IconButton
								edge="start"
								color="inherit"
								aria-label="apps"
								onClick={() => router.push(process.env.NEXT_PUBLIC_AUTH_URL)}
								// sx={{ mr: 2 }}
							>
								<AppsIcon sx={{ fontSize: 24, color: 'text.primary' }} />
							</IconButton>
							{title && (
								<Typography
									variant="h5"
									// color={theme.palette.text.primary}
									component="div"
								>
									{title}
								</Typography>
							)}
						</>
					)}
				</Box>
				<Stack
					sx={{ display: { xs: 'none', md: 'flex' } }}
					spacing={2}
					direction={'row'}
					alignItems={'center'}
				>
					{menuItem?.map((v) => {
						const Icon = v.icon
						const active =
							typeof v.pathname == 'string'
								? router.pathname == v.pathname
								: v.pathname.includes(router.pathname)
						return (
							<ButtonBase
								onClick={() => router.push(v.route)}
								key={v.label}
								sx={{ height: '100%', alignItems: 'stretch' }}
							>
								<Box
									display={'flex'}
									alignItems={'center'}
									sx={{ position: 'relative' }}
									// onCLick={()=>console.log('zzz')}
								>
									<Icon
										sx={{
											fontSize: 16,
											color: active ? 'primary.main' : '#A0AEC0',
											mr: 1,
										}}
									/>
									<Typography
										variant="body2"
										color={theme.palette.text.primary}
										fontWeight={active ? 700 : undefined}
										component="div"
									>
										{v.label}
									</Typography>
									{active && (
										<Box
											sx={{
												height: '4px',
												width: '100%',
												bgcolor: 'primary.main',
												position: 'absolute',
												bottom: 0,
												borderRadius: '100px 100px 0px 0px',
											}}
										/>
									)}
								</Box>
							</ButtonBase>
						)
					})}
				</Stack>
				<Stack direction={'row'} alignItems={'center'}>
					<Button
						onClick={() => {
							// signOut()
						}}
						color="inherit"
						startIcon={<AccountCircleRoundedIcon sx={{ fontSize: 20 }} />}
						sx={{ color: '#67748E', fontSize: 14 }}
					>
						{userInfo?.master_group_user?.name} - {userInfo?.name}
					</Button>
					{logoutLoading ? (
						<CircularProgress color="inherit" size={'20px'} />
					) : (
						<DropdownButton
							sx={{ minWidth: 0 }}
							variant="text"
							size="small"
							menuWidth={'auto'}
							color="inherit"
							menu={[
								...(settingContent?.map((settingContentItem) => ({
									content: settingContentItem.content,
									onClick: settingContentItem.onClick,
								})) ?? []),
								{
									content: (
										<Stack spacing={1} direction="row" alignItems="center">
											<LockIcon sx={{ fontSize: 20, fill: '#67748E' }} />
											<Typography fontWeight={700} variant="caption">
												Ubah Password
											</Typography>
										</Stack>
									),
									onClick: () =>
										router.push(
											(process?.env?.NEXT_PUBLIC_AUTH_URL ?? '') +
												'/change-password'
										),
								},
								{
									content: (
										<Stack spacing={1} direction="row" alignItems="center">
											<LogoutIcon sx={{ fontSize: 20, fill: '#67748E' }} />
											<Typography fontWeight={700} variant="caption">
												Keluar
											</Typography>
										</Stack>
									),
									onClick: () => doLogout(),
								},
							]}
						>
							<SettingsIcon sx={{ fontSize: 20, fill: '#67748E' }} />
						</DropdownButton>
					)}
					<IconButton
						onClick={() =>
							window.open(process.env.NEXT_PUBLIC_URL_CHAT, '_blank')?.focus()
						}
						color="inherit"
					>
						<Badge sx={{ color: '#67748E' }}>
							<CommentDotIcon sx={{ fontSize: 20 }} />
						</Badge>
					</IconButton>
					<NotificationButton userId={userInfo?.id} />
				</Stack>
			</Toolbar>
		</AppBar>
	)
}

export default DefaultAppBar

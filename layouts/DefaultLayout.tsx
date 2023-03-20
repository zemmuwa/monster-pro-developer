import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Stack from '@mui/material/Stack'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { PropsWithChildren, ReactNode, useMemo, useState } from 'react'
import DefaultAppBar, {
	AppBarProviderContext,
	TypeMenuItem,
	TypeSettingContent,
} from '../components/appbar/DefaultAppBar'
const hideLayoutRoute = ['/404']
function DefaultLayout({
	children,
}: // headerLogo,
// menuItem,
PropsWithChildren) {
	const router = useRouter()
	const isHide = hideLayoutRoute.includes(router.pathname)
	const [title, setTitle] = useState('')
	const [menu, setMenu] = useState<TypeMenuItem[] | undefined>(undefined)
	const [leftHeader, setLeftHeader] = useState<ReactNode | undefined>(undefined)
	const [settingContent, setSettingContent] = useState<
		TypeSettingContent[] | undefined
	>(undefined)
	const providerValue = useMemo(
		() => ({
			setTitle: (value: string) => {
				setTitle(value)
			},
			setMenu: (value: TypeMenuItem[] | undefined) => {
				setMenu(value)
			},
			setLeftHeader: (value: ReactNode | undefined) => {
				setLeftHeader(value)
			},
			setSettingContent: (value: TypeSettingContent[] | undefined) => {
				setSettingContent(value)
			},
		}),
		[]
	)
	return !isHide ? (
		<AppBarProviderContext.Provider value={providerValue}>
			<Head>
				<title>Developer MP</title>
			</Head>
			<Box
				sx={{
					display: 'flex',
					flexGrow: 1,
					height: '100vh',
					flexDirection: 'column',
					overflow: 'hidden',
				}}
			>
				<CssBaseline />
				<Box sx={{ mx: 4, mt: 2, mb: '6px', position: 'relative' }}>
					<DefaultAppBar
						title={title}
						headerLogo={leftHeader}
						menuItem={menu}
						settingContent={settingContent}
					/>
				</Box>
				<Box
					component="div"
					sx={{
						// backgroundColor: (theme) =>
						// 	theme.palette.mode === 'light'
						// 		? theme.palette.grey[100]
						// 		: theme.palette.grey[900],
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'column',
						// py:2,
						overflow: 'hidden',
					}}
				>
					{children}
				</Box>
			</Box>
		</AppBarProviderContext.Provider>
	) : (
		<>{children}</>
	)
}

export default DefaultLayout

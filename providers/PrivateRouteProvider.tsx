import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { IUserInfoGet } from '../interfaces/interfaceApiUserInfo'
import { getAuthStorage } from '../utils/storages/shared-storage'
import loadingAnimation from '../components/lottie-anim/loading.json'
import Lottie from 'lottie-react'
import { ILoginGet } from '../interfaces/interfaceApiLogin'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

export const PrivateRouteProviderContext = createContext<{
	userInfoFetch: (params: { token: string }) => void
	userInfo?: IUserInfoGet
}>({
	userInfoFetch: () => {},
	userInfo: {} as IUserInfoGet,
})
export default function PrivateRouteProvider({ children }: PropsWithChildren) {
	const router = useRouter()
	const [init, setInit] = useState(true)
	const [sync, setSync] = useState(false)
	const [loading, setLoading] = useState(true)
	const { authState, setAuthState, userInfo, userInfoGet, logoutLoading } =
		useAuth()
	const devRedirectPath =
		['/'].includes(router.pathname) && userInfo?.user_role == 'DEV'
	const [localStorage, setlocalStorage] = useState<ILoginGet | undefined>(
		undefined
	)
	const guard = () => {
		if (userInfo?.user_role == 'DEV') {
			if (devRedirectPath)
				router
					.replace(`/developer/${userInfo?.user_role_id}`)
					.then((v) => setInit(false))
			else setInit(false)
		} else if (userInfo?.user_role != 'ADM-MP')
			window.location.replace(process.env.NEXT_PUBLIC_AUTH_URL ?? '')
		else setInit(false)
	}

	useEffect(() => {
		if (sync) {
			if (authState && router.pathname.includes('auth')) {
				guard()
				router.replace('/').then((v) => setInit(false))
				// setInit(false)
			} else if (!authState && !router.pathname.includes('auth')) {
				window.location.replace(process.env.NEXT_PUBLIC_AUTH_URL ?? '')
				// setInit(false)
			} else {
				guard()
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authState, loading, sync, userInfo, router.asPath])
	useEffect(() => {
		syncStorageFromPortal()
		return () => {
			setAuthState(undefined)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	useEffect(() => {
		if (localStorage) syncUserInfo(localStorage.access_token)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [localStorage])

	const syncStorageFromPortal = async () => {
		setLoading(true)
		const localStorage = await getAuthStorage()
		setlocalStorage(localStorage)
		setAuthState(localStorage)
		if (!localStorage) {
			setSync(true)
			setLoading(false)
		}
	}

	const syncUserInfo = async (token: string) => {
		await userInfoGet({ token })
		setSync(true)
		setLoading(false)
	}

	return init || loading || devRedirectPath || logoutLoading || !sync ? (
		<Stack
			height="100vh"
			width="100vw"
			alignItems="center"
			justifyContent="center"
		>
			<Box width={{ xs: '50%', sm: '200px' }}>
				<Lottie animationData={loadingAnimation} loop={true} />
			</Box>
		</Stack>
	) : (
		<PrivateRouteProviderContext.Provider
			value={{ userInfo: userInfo, userInfoFetch: userInfoGet }}
		>
			<Box display={{ xs: 'none', md: 'inherit' }}>{children}</Box>
			<Stack
				height="100vh"
				justifyContent="center"
				alignItems="center"
				display={{ xs: 'flex', md: 'none' }}
			>
				<Stack mx={3} maxWidth="304px" alignItems="center">
					<Avatar
						sx={{ width: '250px', height: '250px' }}
						src="/assets/responsive-illustration.png"
					/>
					<Typography variant="h5" mt={4}>
						Layar Terlalu Kecil
					</Typography>
					<Typography mt={1.5} textAlign="center" variant="body2">
						Anda terdeteksi menggunakan ukuran layar terlalu kecil. Silakan buka
						laman ini menggunakan Laptop atau PC untuk pengalaman yang lebih
						baik.
					</Typography>
				</Stack>
			</Stack>
		</PrivateRouteProviderContext.Provider>
	)
	// return children
}

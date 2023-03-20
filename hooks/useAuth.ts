import React, { useContext, useEffect, useState } from 'react'
import { ILoginGet } from '../interfaces/interfaceApiLogin'
import ENDPOINTS from '../utils/constants/endpoints'
import ConsumeApi from '../utils/consume-api/ConsumeApi'
import { setValue as setAuth, authSlice, AuthState } from '../redux/AuthSlice'
import { useAppDispatch, useAppSelector } from './useStore'
import { useRouter } from 'next/router'
import { ToastProviderContext } from '../providers/ToastProvider'
import {
	getAuthStorage,
	removeAuthStorage,
} from '../utils/storages/shared-storage'
import { IUserInfoGet } from '../interfaces/interfaceApiUserInfo'
import useFetch from './useFetch'
function useAuth() {
	const router = useRouter()

	const { openToast } = useContext(ToastProviderContext)
	const [loginLoading, setLoginLoading] = useState(false)
	const [logoutLoading, setLogoutLoading] = useState(false)
	const [userInfoLoading, setUserInfoLoading] = useState(false)
	const [userInfo, setUserInfo] = useState<IUserInfoGet | undefined>(undefined)
	const dispatch = useAppDispatch()
	const authState = useAppSelector(AuthState)
	const login = async (params: { username: string; password: string }) => {
		setLoginLoading(true)
		let res = await ConsumeApi<ILoginGet>(
			ENDPOINTS.LOGIN,
			'POST',
			{
				body: {
					password: params?.password,
					email: params?.username,
				},
			},
			process.env.NEXT_PUBLIC_USER_PATH
		)
		if (res && 'access_token' in res) {
			dispatch(setAuth(res))
			router.replace('/')
		} else {
			openToast(true, 'error', res.message)
		}
		setLoginLoading(false)
	}
	const logout = async () => {
		let res = await ConsumeApi<undefined>(
			ENDPOINTS.LOGOUT,
			'POST',
			undefined,
			process.env.NEXT_PUBLIC_USER_PATH
		)
		await removeAuthStorage()
		// await ConsumeApi<InterfaceUser>('auth/logout', 'POST')
		dispatch(setAuth(undefined))
	}

	const userInfoGet = async (params: { token: string }) => {
		setLoginLoading(true)
		let res = await ConsumeApi<IUserInfoGet>(
			ENDPOINTS.MASTER_USER_INFO,
			'GET',
			{ tokenArg: params.token },
			process.env.NEXT_PUBLIC_USER_PATH
		)
		if (res && 'name' in res) {
			setUserInfo(res)
		} else {
			openToast(true, 'error', res.message)
			window.location.replace(process.env.NEXT_PUBLIC_AUTH_URL)
		}
		setLoginLoading(false)
	}

	const setAuthState = (value?: ILoginGet) => dispatch(setAuth(value))

	return {
		login,
		loginLoading,
		logout,
		logoutLoading,
		authState,
		setAuthState,
		userInfo,
		userInfoGet,
		userInfoLoading,
	}
}

export default useAuth

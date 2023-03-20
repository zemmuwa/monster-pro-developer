import createGuest from 'cross-domain-storage/guest'
import { ILoginGet } from '../../interfaces/interfaceApiLogin'

const getAuthStorage = () => {
	const portalStorage = createGuest(process.env.NEXT_PUBLIC_AUTH_URL)
	return new Promise<ILoginGet | undefined>((resolve) => {
		portalStorage.get('persist:root', (err: any, val: any) => {
			if (val) {
				const auth = JSON.parse(val)?.auth
				const authVal = JSON.parse(auth)?.value
				portalStorage.close()
				resolve(authVal)
			} else {
				portalStorage.close()
				resolve(undefined)
			}
		})
	})
}

const getAuthStorageLocal: () => ILoginGet | undefined = () => {
	const storage = window.localStorage.getItem('persist:root')
	const auth = JSON.parse(storage ?? '')?.auth
	return JSON.parse(auth)?.value
}

const removeAuthStorage = () => {
	const portalStorage = createGuest(process.env.NEXT_PUBLIC_AUTH_URL)
	return new Promise<boolean>((resolve) => {
		portalStorage.remove('persist:root', (err: any, val: any) => {
			if (err) {
				portalStorage.close()
				resolve(false)
			} else {
				portalStorage.close()
				resolve(true)
			}
		})
	})
}

export { getAuthStorage, removeAuthStorage, getAuthStorageLocal }

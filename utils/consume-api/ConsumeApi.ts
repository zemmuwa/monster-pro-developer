import { IApiResponseError } from '../../interfaces/interfaceApiResponse'
import {
	getAuthStorage,
	getAuthStorageLocal,
	removeAuthStorage,
} from '../storages/shared-storage'
type METHODS = 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE'

const ConsumeApi = async <Type>(
	endpoint: string,
	method: METHODS,
	optional?: { body?: any; tokenArg?: string; header?: any; noJson?: boolean },
	service?: string
): Promise<Type | IApiResponseError> => {
	let json: Type | IApiResponseError = {
		message: 'Error Server',
		status: 500,
	}
	try {
		const secureData = getAuthStorageLocal()
		const token = secureData ? secureData?.access_token || '' : null
		const bearer = optional?.tokenArg
			? `Bearer ${optional?.tokenArg}`
			: token
			? `Bearer ${token}`
			: ''
		let bodyData = undefined
		if (optional?.body && !optional.noJson)
			bodyData = JSON.stringify(optional.body)
		else if (optional?.body && optional.noJson) bodyData = optional.body

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASEURL}${service ? '/' + service : ''}/${
				process.env.NEXT_PUBLIC_API_PATH
			}/${endpoint}`,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: bearer,
					...optional?.header,
				},
				method,
				body: bodyData,
			}
		)
		if (response.status == 401) {
			await removeAuthStorage()
			window.localStorage.clear()
			window.location.replace(process.env.NEXT_PUBLIC_AUTH_URL)
		}

		json = await response.json()
	} catch (error) {
		console.error(error)
	} finally {
		return json
	}
}

export default ConsumeApi

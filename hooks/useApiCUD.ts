import React, { useState } from 'react'
import ConsumeApi from '../utils/consume-api/ConsumeApi'

function useApiCUD(endpointArg: string, servicePathArg?: string) {
	const [loading, setLoading] = useState(false)

	const create = async <T>(body: T) => {
		setLoading(true)
		const endpoint = endpointArg
		let json = await ConsumeApi<undefined>(
			endpoint,
			'POST',
			{ body },
			servicePathArg
		)
		setLoading(false)
		return json
	}

	const edit = async <T>(body: T, id: string | number) => {
		setLoading(true)
		const endpoint = endpointArg + '/' + id
		let json = await ConsumeApi<undefined>(
			endpoint,
			'PUT',
			{ body },
			servicePathArg
		)
		setLoading(false)
		return json
	}

	const del = async <T>(id: string | number) => {
		setLoading(true)
		const endpoint = endpointArg + '/' + id
		let json = await ConsumeApi<undefined>(
			endpoint,
			'DELETE',
			undefined,
			servicePathArg
		)
		setLoading(false)
		return json
	}
	return { loading, create, edit, del }
}

export default useApiCUD

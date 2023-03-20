import { useEffect, useRef, useState } from 'react'
import {
	IUploadResponse,
	IUploadPostBody,
} from '../interfaces/interfaceApiUpload'
import ENDPOINTS from '../utils/constants/endpoints'
import axios from 'axios'
import { IApiResponseError } from '../interfaces/interfaceApiResponse'
import useAuth from './useAuth'

function useApiUpload() {
	const [loading, setLoading] = useState(false)
	const { authState, logout } = useAuth()
	const isUpdate = useRef(true)

	const upload = async (
		arg: IUploadPostBody
	): Promise<IApiResponseError | IUploadResponse> => {
		let response: IApiResponseError | IUploadResponse
		setLoading(true)
		const formData = new FormData()
		formData.append('files', arg.files as Blob)
		const config = {
			headers: {
				'content-type': 'multipart/form-data',
				Authorization: authState?.access_token
					? `Bearer ${authState?.access_token}`
					: '',
			},
		}
		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${process.env.NEXT_PUBLIC_API_PATH}/${ENDPOINTS.UPLOAD}`,
				formData,
				config
			)
			response = res?.data
			if (res.status == 401) {
				logout()
			}
		} catch (error) {
			response = {
				status: 500,
				message: 'Server Error',
			}
		}

		setLoading(false)
		return response
	}
	useEffect(() => {
		isUpdate.current == true
		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			isUpdate.current == false
		}
	}, [])
	return { upload, loading }
}

export default useApiUpload

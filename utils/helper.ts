import { IApiResponseError } from '../interfaces/interfaceApiResponse'

const helper = {
	fileUrl: (url: string) =>
		url ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}${url}` : '',
	filePath: (url: string) =>
		url ? url.replace(process.env.NEXT_PUBLIC_UPLOAD_URL ?? '', '') : '',
	isErrorApi: (res: IApiResponseError | undefined) => {
		return (
			res &&
			'status' in res &&
			![200, 201, 202].includes(res.status) &&
			'message' in res
		)
	},
}

export default helper

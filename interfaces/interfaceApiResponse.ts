export interface IApiResponseList<T> {
	first: boolean
	items: T
	last: boolean
	max_page: number
	page: number
	size: number
	total: number
	total_pages: number
	visible: number
}
export interface IApiResponseError {
	status: number
	message: string
}

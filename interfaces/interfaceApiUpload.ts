export interface IUploadResponse {
	id: string
	title: string
	file_name: string
	file_size: number
	dimension_width: number
	dimension_height: number
	original_file_name: string
	url: string
	ext: string
}

export interface IUploadPostBody {
	files: File | File[]
}

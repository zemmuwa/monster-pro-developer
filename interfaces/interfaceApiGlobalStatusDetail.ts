export interface IGlobalStatusDetailGet {
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	code: string
	created_at: string
	creator_id: string
	description: string
	id: string
	master_status: string
	master_status_id: string
	modifier_id: string
	sort: number
	status_name: string
	updated_at: string
}

export interface IGlobalStatusDetailPostBody {
	code: string
	description: string
	id?: string
	status_name: string
}

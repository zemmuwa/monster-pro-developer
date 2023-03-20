export interface ITaxGet {
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	created_at: string
	creator_id: string
	id: string
	modifier_id: string
	sort: number
	tax_type: string
	updated_at: string
	value: string
	visibility: boolean
}

export interface ITaxPutBody {
	value?: string
	visibility?: boolean
	tax_type?: string
}
export interface ITaxPostBody {
	value: string
	visibility: boolean
	tax_type: string
}

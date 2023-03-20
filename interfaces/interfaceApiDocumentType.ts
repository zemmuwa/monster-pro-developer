export interface IDocumentTypeGet {
	active: boolean
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	// code: string
	created_at: Date
	creator_id: string
	id: string
	modifier_id: string
	name: string
	sort: number
	updated_at: Date
}

export interface IDocumentTypePutBody {
	active?: boolean
	// code?: string
	name?: string
}

export interface IDocumentTypePostBody {
	active: boolean
	// code: string
	name: string
}

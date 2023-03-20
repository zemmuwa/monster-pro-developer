export interface IBankGet {
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	created_at: string
	creator_id: string
	id: string
	modifier_id: string
	name: string
	payment_code: string
	sort: number
	updated_at: string
	active: boolean
}

export interface IBankPutBody {
	active?: boolean
	payment_code?: string
	name?: string
}

export interface IBankPostBody {
	active: boolean
	payment_code: string
	name: string
}

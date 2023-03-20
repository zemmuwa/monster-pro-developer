export interface IProvinceGet {
	active: boolean
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	created_at: string
	creator_id: string
	id: string
	modifier_id: string
	province_name: string
	sort: number
	updated_at: string
}

export interface IProvincePutBody {
	province_name?: string
	active?: boolean
}

export interface IProvincePostBody {
	province_name: string
	active: boolean
}

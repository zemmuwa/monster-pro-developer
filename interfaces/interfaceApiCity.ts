import { IProvinceGet } from './interfaceApiProvince'

export interface ICityGet {
	active: boolean
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	city_name: string
	created_at: string
	creator_id: string
	id: string
	master_province: IProvinceGet
	master_province_id: string
	modifier_id: string
	sort: number
	updated_at: string
}

export interface ICityPutBody {
	city_name?: string
	active?: boolean
	master_province_id?: string
}

export interface ICityPostBody {
	city_name: string
	active: boolean
	master_province_id: string
}

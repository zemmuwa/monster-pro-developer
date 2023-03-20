import { ICityGet } from './interfaceApiCity'
import { IProvinceGet } from './interfaceApiProvince'

export interface IDistrictGet {
	active: boolean
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	district_name: string
	created_at: string
	creator_id: string
	id: string
	master_city: ICityGet
	master_city_id: string
	modifier_id: string
	sort: number
	updated_at: string
}

export interface IDistrictPutBody {
	district_name?: string
	active?: boolean
	master_city_id?: string
}

export interface IDistrictPostBody {
	district_name: string
	active: boolean
	master_city_id: string
}

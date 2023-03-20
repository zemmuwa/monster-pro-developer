import { IDetailCategoryGet } from './interfaceApiDetailCategory'
import { IDeveloperGet } from './interfaceApiDeveloper'
import { IGlobalStatusDetailGet } from './interfaceApiGlobalStatusDetail'
import { IProjectGet } from './interfaceApiProject'
import { ITypeUnitGet } from './interfaceApiTypeUnit'
import { IUnitDataPricePostBody, IUnitGet } from './interfaceApiUnit'

export interface IUnitBlockGet {
	id: string
	sort: number
	created_at: string
	updated_at: string
	unit_data_id: string
	developer_project_data_id: string
	data_type_unit_id: string
	master_category_unit_id: string
	master_certificate_unit_id: string
	block_name: string
	block_number: number
	development_status_id: string
	transaction_status_id: string
	activities_status_id?: any
	is_transaction_on_mp?: any
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	unit_data: IUnitGet
	developer_project_data: IProjectGet
	data_type_unit: ITypeUnitGet
	development_status: IGlobalStatusDetailGet
	transaction_status: IGlobalStatusDetailGet
	activities_status?: IGlobalStatusDetailGet
	unit_block_facility: {
		type: string
		master_detail_category_id: string
		master_detail_category?: IDetailCategoryGet
		id: string
	}[]
	unit_block_price: IUnitBlockPrice[]
	master_certificate: IDetailCategoryGet
	master_category: IDetailCategoryGet
	price_minimum?: number
	map?: string
	handover_year?: number
	selling_point?: string
}

export interface IUnitBlockPrice {
	id: string
	sort: number
	created_at: string
	updated_at: string
	unit_block_data_id: string
	utj_price: number
	type_payment: string
	unit_nominal: number
	payment_termin: number
	dp_percentage: number
	dp_total: number
	dp_installment_termin: number
	price_after_dp: number
	monthly_installment: number
	ppn: number
	bphtb: number
	include_utj: number
	discount: number
	dp_nett:number
	unit_nominal_nett:number
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	unit_block_data?: any
	other?:number
}

export interface IUnitBlockPostBody {
	master_category_unit_id?: string
	master_certificate_unit_id?: string
	map?: string
	handover_year?: number
	selling_point?: string
	unit_block_facility?: IUnitBlockFacilityPostBody[]
	unit_block_price?: IUnitDataPricePostBody[]
	block_name?: string
	block_number?: number
	development_status_id?: string
	unit_data_id?: string
}

export interface IUnitBlockFacilityPostBody {
	id?: string
	master_detail_category_id?: string
	type?: string
}

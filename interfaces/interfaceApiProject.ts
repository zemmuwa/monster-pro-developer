import { IBankGet } from "./interfaceApiBank"
import { ICityGet } from "./interfaceApiCity"
import { IDetailCategoryGet } from "./interfaceApiDetailCategory"
import { IDeveloperGet } from "./interfaceApiDeveloper"
import { IDistrictGet } from "./interfaceApiDistrict"
import { IProvinceGet } from "./interfaceApiProvince"

export interface IProjectBankCooperationPostBody {
	master_bank_id?: string
}
export interface IProjectBankCooperationGet {
	master_bank_id: string
	master_bank:IBankGet
}

export interface IProjectClusterPostBody {
	cluster_name: string
	id?:string
}

export interface IProjectDocumentPostBody {
	document_id: string
	document_url: string
	master_document_type_id: string
	id?:string
}
export interface IProjectGalleryPostBody {
	gallery_id: string
	gallery_type: string
	gallery_url: string
	id?:string
}

export interface IProjectPostBody {
	attribute1?: string
	attribute2?: string
	attribute3?: string
	attribute4?: string
	attribute5?: string
	bank_cooperation?: IProjectBankCooperationPostBody[]
	developer_id?: string
	master_city_id?: string
	master_district_id?: string
	master_province_id?: string
	maximum_installment?: number
	maximum_price?: number
	minimum_installment?: number
	minimum_price?: number
	developer_legal_documents?: IProjectDocumentPostBody[]
	optional_data_cluster?: IProjectClusterPostBody[]
	developer_support_documents?: IProjectDocumentPostBody[]
	project_address?: string
	project_cover_id?: string
	project_cover_url?: string
	project_name?: string
	project_status_id?: string
	project_type_id?: string
	gallery_project_data?: IProjectGalleryPostBody[]
	is_publish?:boolean
}

export interface IProjectGet {
	id: string
	sort: number
	created_at: string
	updated_at: string
	developer_id: string
	project_type_id?: string
	project_type?: IDetailCategoryGet
	project_name: string
	is_publish?: boolean
	project_cover_id?: string
	project_cover_url: string
	master_province_id: string
	master_province: IProvinceGet
	master_city_id: string
	master_city: ICityGet
	master_district_id: string
	master_district: IDistrictGet
	project_address: string
	minimum_price: number
	maximum_price: number
	minimum_installment: number
	maximum_installment: number
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	developer?: IDeveloperGet
	optional_data_cluster: IProjectClusterPostBody[]
	bank_cooperation: IProjectBankCooperationGet[]
	data_type_unit: any[]
	gallery_project_data?: IProjectGalleryPostBody[]
	developer_legal_documents?: IProjectDocumentPostBody[]
	developer_support_documents?: IProjectDocumentPostBody[]
	sum_of_block?:number
}

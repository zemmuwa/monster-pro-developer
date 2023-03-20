import { ICityGet } from './interfaceApiCity'
// import { IDocumentTypeGet } from './interfaceApiDocumentType'
// import { IBankGet } from './interfaceApiBank'
export interface ICompanyGet {
	agency_registered?: number
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	created_at: string
	creator_id: string
	developer_registered?: number
	email: string
	id: string
	logo_id: string
	logo_url: string
	master_city: ICityGet
	master_company_bank: ICompanyBank[]
	master_company_document: ICompanyDocument[]
	master_company_npwp: ICompanyNpwp[]
	modifier_id: string
	name: string
	office_address: string
	phone_number: string
	sort: number
	updated_at: string
}

export interface ICompanyBankPostBody {
	account_number: string
	master_bank_id: string
	on_behalf: string
	branch_name: string
}
export interface ICompanyNpwpPostBody {
	npwp_number: string
	on_behalf: string
	registered_address: string
	npwp_type: string
}
export interface ICompanyDocumentPostBody {
	document_id: string
	document_url: string
	master_document_type_id: string
}

export interface ICompanyPostBody {
	email: string
	phone_number: string
	office_address: string
	logo_id: string
	logo_url: string
	name: string
	master_city_id: string
	master_company_bank: ICompanyBankPostBody[]
	master_company_npwp: ICompanyNpwpPostBody[]
	master_company_document: ICompanyDocumentPostBody[]
}

export interface ICompanyBank {
	account_number: string
	active: boolean
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	branch_name: string
	created_at: string
	creator_id: string
	id: string
	// master_bank: IBankGet
	master_bank_id: string
	master_company: string
	master_company_id: string
	modifier_id: string
	on_behalf: string
	sort: number
	updated_at: string
}

export interface MasterDocumentRequirement {
	active: boolean
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	code: string
	created_at: string
	creator_id: string
	group_name: string
	id: string
	master_document_type: string[]
	master_group_user_id: string
	modifier_id: string
	sort: number
	updated_at: string
}

export interface ICompanyDocument {
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	created_at: string
	creator_id: string
	document_id: string
	document_url: string
	id: string
	master_company: string
	master_company_id: string
	// master_document_type: IDocumentTypeGet
	master_document_type_id: string
	modifier_id: string
	name: string
	sort: number
	updated_at: string
}

export interface ICompanyNpwp {
	active: boolean
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	created_at: string
	creator_id: string
	id: string
	legality_id: string
	legality_url: string
	master_company: string
	master_company_id: string
	modifier_id: string
	npwp_number: string
	npwp_type: string
	on_behalf: string
	registered_address: string
	sort: number
	updated_at: string
}

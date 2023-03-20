import { ICityGet } from './interfaceApiCity'
import { ICompanyGet } from './interfaceApiCompany'

export interface IAgencyGet {
	admin_phone: string
	agency_name: string
	arebi_membership_document_id: string
	arebi_membership_document_url: string
	arebi_membership_number: string
	arebi_membership_status: string
	attribute1: string
	attribute2: string
	attribute3: string
	attribute4: string
	attribute5: string
	banner_id: string
	banner_url: string
	company_id: string
	created_at: string
	creator_id: string
	description: string
	developer_id: string
	email: string
	email_principal: string
	group_user_id: string
	id: string
	logo_id: string
	logo_url: string
	master_city_id: string
	membership_type: string
	modifier_id: string
	office_address: string
	office_phone: string
	password: string
	refferal_agency: string
	refferal_developer: string
	sort: number
	sum_of_agent: number
	updated_at: string
	year_of_establishment: number
	active: boolean
	company?: ICompanyGet
	master_city?: ICityGet
}

export interface IAgencyPostBody {
	active?: boolean
	company_id?: string
	logo_id?: string
	logo_url?: string
	agency_name?: string
	year_of_establishment?: number
	office_phone?: string
	admin_phone?: string
	master_city_id?: string
	description?: string
	arebi_membership_number?: string
	arebi_membership_document_url?: string
	arebi_membership_document_id?: string
	email?: string
	email_principal?: string
	developer_id?: string
}

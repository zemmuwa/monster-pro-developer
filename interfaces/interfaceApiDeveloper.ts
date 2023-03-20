import { ICityGet } from './interfaceApiCity'
import { ICompanyGet } from './interfaceApiCompany'
import { IMembershipGet } from './interfaceApiMembership'
import { IUserInfoGet } from './interfaceApiUserInfo'

export interface IDeveloperGet {
	id: string
	sort: number
	created_at: string
	updated_at: string
	company_id: string
	developer_name: string
	year_of_establishment: number
	description: string
	office_phone: string
	admin_phone: string
	master_city_id: string
	logo_id: string
	logo_url: string
	rei_membership_status: number
	rei_membership_number: number
	rei_membership_document_id: string
	rei_membership_document_url: string
	membership_id?: any
	reff: string
	master_document_requirement_id: string
	group_user_id: string
	have_inhouse: boolean
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	sum_of_project?: number
	sum_of_unit?: number
	sum_of_active_transactions?: number
	sum_of_developer: {
		sum_of_active_transactions?: number
		sum_of_project?: number
		sum_of_unit?: number
	}
	company?: ICompanyGet
	master_city?: ICityGet
	email?: string
	membership?:IMembershipGet
	master_user?:IUserInfoGet
}

export interface IDeveloperPostBody {
	admin_phone?: string
	attribute1?: string
	attribute2?: string
	attribute3?: string
	attribute4?: string
	attribute5?: string
	company_id?: string
	description?: string
	developer_name?: string
	email?: string
	group_user_id?: string
	have_inhouse?: boolean
	logo_id?: string
	logo_url?: string
	master_city_id?: string
	membership_id?: string
	office_phone?: string
	reff?: string
	rei_membership_document_id?: string
	rei_membership_document_url?: string
	rei_membership_number?: number
	rei_membership_status?: number
	year_of_establishment?: number
}

// import { IGroupUserGet } from './interfaceApiGroupUser'
// import { IServiceGet } from './interfaceApiService'

export interface IMembershipGet {
	id: string
	sort: number
	status: number
	createdAt: string
	name: string
	code: string
	description: string
	membership_fee: number
	// master_service: IServiceGet[]
	// master_group_user: IGroupUserGet
}
export interface IMembershipPostBody {
	code?: string
	description?: string
	master_group_user_id?: string
	name?: string
	status?: number
	membership_fee?: number
}

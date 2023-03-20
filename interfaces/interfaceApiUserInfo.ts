import { IGetEwallet } from './interfaceApiEwallet'
import { IGroupUserGet } from './interfaceApiGroupUser'

export interface IUserInfoGet {
	id: string
	sort: number
	status: number
	created_at: string
	updated_at: string
	master_group_user_id: string
	master_group_user: IGroupUserGet
	name: string
	username: string
	email: string
	user_role: string
	user_role_id?: string
	is_activated: boolean
	is_password_system_generated: boolean
	activated_at: string
	ewallet?: IGetEwallet
}

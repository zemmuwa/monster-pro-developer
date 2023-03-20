import { IGlobalStatusDetailGet } from './interfaceApiGlobalStatusDetail';
export interface ILogBookingGet {
	id: string
	sort: number
	created_at: string
	updated_at: string
	creator_id?: any
	modifier_id?: any
	booking_id: string
	transaction_id: string
	transaction_status_id: string
	activities_status_id: string
	deadline_sla?: string
	is_auto_sla_changed?: boolean
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	booking?: any
	transaction?: any
	transaction_status: IGlobalStatusDetailGet
	activities_status: IGlobalStatusDetailGet
	desc?:string
}

import { IAgencyGet } from './interfaceApiAgency'
import { IAgentGet } from './interfaceApiAgent'
import { IBookingGet, LastLogBooking } from './interfaceApiBooking'
import { IBuyerGet } from './interfaceApiBuyer'
import { IDeveloperGet } from './interfaceApiDeveloper'
import { IDeveloperRedeemMultipleGet } from './interfaceApiDeveloperRedeemMultiple'
import { IUnitBlockGet, IUnitBlockPrice } from './interfaceApiUnitBlock'

export interface ITransactionGet {
	id: string
	sort: number
	created_at: string
	updated_at: string
	creator_id?: any
	modifier_id?: any
	developer_payment_schedule_id?: any
	buyer_id: string
	developer_id: string
	agent_id: string
	agency_id: string
	unit_block_data_id: string
	unit_block_price_id: string
	booking_id: string
	redeem_id?: any
	refund_id?: any
	transaction_code: string
	transaction_type: string
	total: number
	payment_gateway_code?: any
	payment_gateway_trx?: any
	payment_gateway_status?: any
	tax?: any
	discount?: any
	payment_gateway_fee?: any
	service_charge_mp?: any
	grand_total?: any
	is_paid: boolean
	payment_schedule_due_date?: any
	developer_payment_schedule?: any
	unit_block_data: IUnitBlockGet
	unit_block_price: IUnitBlockPrice
	developer: IDeveloperGet
	agent: IAgentGet
	agency: IAgencyGet
	booking: IBookingGet
	redeem?: any
	refund?: any
	buyer: IBuyerGet
	last_log_booking: LastLogBooking
	redeem_status?: number
	current_redeem?:IDeveloperRedeemMultipleGet
}

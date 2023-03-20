import * as yup from 'yup'
export type RedeemApprovalFormValues = {
	transaction: {
		id: string
		checked?: boolean
		redeemId?:string
	}[]
}

const redeemApprovalFormSchema = yup
	.object({
	})
	.required()

export default redeemApprovalFormSchema

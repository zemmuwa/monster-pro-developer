import * as yup from 'yup'
export type RedeemFormValues = {
	transaction: {
		id: string
		checked?: boolean
		kwitansi: { url: string | undefined; id: string | undefined }
		invoice: { url: string | undefined; id: string | undefined }
	}[]
}

const redeemFormValues = yup
	.object({
		transaction: yup.array().of(
			yup.object().shape({
				kwitansi: yup.object().when('checked', {
					is: (val: boolean) => val == true,
					then: yup
						.object()
						.shape({
							id: yup.string().required('Invoice dan kwitansi tidak boleh kosong'),
						})
						.typeError('Invoice dan kwitansi tidak boleh kosong'),
				}),
				invoice: yup.object().when('checked', {
					is: (val: boolean) => val == true,
					then: yup
						.object()
						.shape({
							id: yup.string().required('Invoice dan kwitansi tidak boleh kosong'),
						})
						.typeError('Invoice dan kwitansi tidak boleh kosong'),
				}),
			})
		),
	})
	.required()

export default redeemFormValues

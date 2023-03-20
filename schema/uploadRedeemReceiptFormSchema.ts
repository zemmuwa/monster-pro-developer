import * as yup from 'yup'
export type UploadRedeemReceiptFormValues = {
	transaction: {
		id: string
		redeemId?:string
		checked?: boolean
		receipt: { url: string | undefined; id: string | undefined }
	}[]
}

const uploadRedeemReceiptFormSchema = yup
	.object({
		transaction: yup.array().of(
			yup.object().shape({
				receipt: yup.object().when('checked', {
					is: (val: boolean) => val == true,
					then: yup
						.object()
						.shape({
							id: yup.string().required('Bukti pembayaran tidak boleh kosong'),
						})
						.typeError('Bukti pembayaran tidak boleh kosong'),
				}),
			})
		),
	})
	.required()

export default uploadRedeemReceiptFormSchema

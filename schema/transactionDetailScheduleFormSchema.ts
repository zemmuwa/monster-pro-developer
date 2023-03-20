import { IDocumentTypeGet } from './../interfaces/interfaceApiDocumentType'
import * as yup from 'yup'
export type TransactionDetailScheduleFormValues = {
	schedule: {
		name?: IDocumentTypeGet
		date: string
		file?: { id: string; url: string }
	}[]
}
const transactionDetailScheduleFormSchema = yup
	.object({
		schedule: yup
			.array()
			.of(
				yup.object().shape({
					name: yup.object().shape({
						id: yup.string().required('Wajib diisi'),
					}),
					date: yup.string().required('Wajib diisi'),
					// file: yup.object().shape({
					// 	id: yup.string().required('Wajib diisi'),
					// }),
				})
			)
			.min(1, 'Minimal 1 opsi terisi')
			.typeError('Minimal 1 opsi terisi')
			.required('Minimal 1 opsi terisi')
			.test('unique', 'Tidak boleh ada data yg sama', (value) => {
				const ids = value?.map((obj) => obj?.name?.id)
				const set = new Set(ids)
				return !(set.size < (value?.length ?? 0))
			}),
	})
	.required()

export default transactionDetailScheduleFormSchema

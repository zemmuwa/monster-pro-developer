import * as yup from 'yup'
import { ICityGet } from '../interfaces/interfaceApiCity'
import { ICompanyGet } from '../interfaces/interfaceApiCompany'
import { IMembershipGet } from '../interfaces/interfaceApiMembership'
import REGEX from '../utils/regex'
export type DeveloperFormValues = {
	company?: ICompanyGet
	master_city?: ICityGet
	developer_name: string
	description: string
	year_of_establishment: string
	office_phone: string
	admin_phone: string
	email: string
	have_inhouse: boolean
	logo?: { url: string | undefined; id: string | undefined }
	membership?: IMembershipGet
	rei_membership_document?: { url: string | undefined; id: string | undefined }
	rei_membership_number: string
}

const developerFormSchema1 = yup
	.object({
		company: yup
			.object()
			.shape({
				id: yup.string().required('Wajib diisi'),
			})
			.typeError('Wajib diisi'),
	})
	.required()
const developerFormSchema2 = yup
	.object({
		logo: yup
			.object()
			.shape({
				id: yup.string().required('Wajib diisi'),
			})
			.typeError('Wajib diisi'),
		developer_name: yup.string().required('Wajib diisi'),
		year_of_establishment: yup
			.string()
			.required('Wajib diisi')
			.matches(REGEX.YEAR, 'Tahun berdiri terdiri dari 4 digit angka'),
		office_phone: yup
			.string()
			.required('Wajib diisi')
			.min(7, 'Minimal 7 karakter')
			.max(14, 'Maksimal 14 karakter')
			.matches(
				REGEX.PHONE_NUMBER,
				'Harus diawali dengan 0, 62 atau +62 dan hanya angka'
			),
		admin_phone: yup
			.string()
			.required('Wajib diisi')
			.min(7, 'Minimal 7 karakter')
			.max(14, 'Maksimal 14 karakter')
			.matches(
				REGEX.PHONE_NUMBER,
				'Harus diawali dengan angka 0, 62 atau +62 dan hanya angka'
			),
		description: yup.string().required('Wajib diisi'),
		master_city: yup
			.object()
			.shape({
				id: yup.string().required('Wajib diisi'),
			})
			.typeError('Wajib diisi'),
		// rei_membership_document: yup
		// 	.object()
		// 	.shape({
		// 		id: yup.string().required('Wajib diisi'),
		// 	})
		// 	.typeError('Wajib diisi'),
		rei_membership_number: yup
			.string()
			.nullable()
			.transform((curr, orig) => (orig === '' ? null : curr))
			// .required('Wajib diisi')
			.matches(
				REGEX.ONLY_NUMBER,
				'Nomor sertifikat REI terdiri dari 7 digit angka'
			)
			.min(7, 'Minimal 7 karakter')
			.max(7, 'Maksimal 7 karakter'),
	})
	.required()

const developerFormSchema3 = yup
	.object({
		email: yup
			.string()
			.required('Wajib diisi')
			.email('Tidak sesuai format')
			.matches(
				REGEX.EMAIL_UNIQUE_REGEX,
				'Panjang sebelum @ harus 7-60 karakter'
			),
		membership: yup
			.object()
			.shape({
				id: yup.string().required('Wajib diisi'),
			})
			.typeError('Wajib diisi'),
	})
	.required()

const developerFormSchema = {
	developerFormSchema1,
	developerFormSchema2,
	developerFormSchema3,
}
export default developerFormSchema

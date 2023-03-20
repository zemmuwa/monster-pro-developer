import * as yup from 'yup'
import { IDetailCategoryGet } from '../interfaces/interfaceApiDetailCategory'
import { IGlobalStatusDetailGet } from '../interfaces/interfaceApiGlobalStatusDetail'
import { IUnitDataPricePostBody } from '../interfaces/interfaceApiUnit'
import REGEX from '../utils/regex'
export type UnitFormValues = {
	master_category_unit?: IDetailCategoryGet
	master_certificate_unit?: IDetailCategoryGet
	map: string
	handover_year: string
	selling_point: string
	unit_facility_previlege: IDetailCategoryGet[]
	unit_facility_facilities: IDetailCategoryGet[]
	unit_facility_extra: IDetailCategoryGet[]
	unit_facility_fee: IDetailCategoryGet[]
}
export type UnitFormValues2 = {
	utj_price: string
	unit_data_price_cash_nominal: string
	bphtb_cash: string
	other_cash: string
	ppn_cash: string
	discount_cash: string
	include_utj_cash: string
	unit_data_price_cash: IUnitDataPricePostBody[]
	bphtb_inhouse: string
	other_inhouse: string
	ppn_inhouse: string
	discount_inhouse: string
	include_utj_inhouse: string
	unit_data_price_inhouse: IUnitDataPricePostBody[]
	bphtb_inhouse_dp: string
	other_inhouse_dp: string
	ppn_inhouse_dp: string
	discount_inhouse_dp: string
	include_utj_inhouse_dp: string
	unit_data_price_inhouse_dp: IUnitDataPricePostBody[]
	unit_data_price_kpr_nominal: string
	bphtb_kpr: string
	other_kpr: string
	ppn_kpr: string
	discount_kpr: string
	include_utj_kpr: string
	unit_data_price_kpr: IUnitDataPricePostBody[]
}
export type UnitFormValues3 = {
	unit_block_data: {
		id?: string
		block_name: string
		block_number: string
		development_status?: IGlobalStatusDetailGet
	}[]
}

const unitFormSchema = yup
	.object({
		master_category_unit: yup
			.object()
			.shape({
				id: yup.string().required('Wajib diisi'),
			})
			.typeError('Wajib diisi'),
		master_certificate_unit: yup
			.object()
			.shape({
				id: yup.string().required('Wajib diisi'),
			})
			.typeError('Wajib diisi'),
		map: yup.string().required('Wajib diisi'),
		handover_year: yup
			.string()
			.required('Wajib diisi')
			.matches(REGEX.YEAR, 'Tidak sesuai format'),
		selling_point: yup.string().required('Wajib diisi'),
		unit_facility_previlege: yup
			.array()
			.of(
				yup.object().shape({
					id: yup.string().required('Wajib diisi'),
				})
			)
			.min(1, 'Minimal 1 opsi terisi')
			.typeError('Minimal 1 opsi terisi')
			.required('Minimal 1 opsi terisi'),
		unit_facility_facilities: yup
			.array()
			.of(
				yup.object().shape({
					id: yup.string().required('Wajib diisi'),
				})
			)
			.min(1, 'Minimal 1 opsi terisi')
			.typeError('Minimal 1 opsi terisi')
			.required('Minimal 1 opsi terisi'),
		unit_facility_extra: yup
			.array()
			.of(
				yup.object().shape({
					id: yup.string().required('Wajib diisi'),
				})
			)
			.min(1, 'Minimal 1 opsi terisi')
			.typeError('Minimal 1 opsi terisi')
			.required('Minimal 1 opsi terisi'),

		unit_facility_fee: yup
			.array()
			.of(
				yup.object().shape({
					id: yup.string().required('Wajib diisi'),
				})
			)
			.min(1, 'Minimal 1 opsi terisi')
			.typeError('Minimal 1 opsi terisi')
			.required('Minimal 1 opsi terisi'),
	})
	.required()
const unitFormSchema2 = yup
	.object({
		utj_price: yup
			.string()
			.required('Wajib diisi')
			.test(
				'Is positive?',
				'Harus lebih dari 0',
				(value) => Number(value ?? 0) > 0
			),
		unit_data_price_cash: yup
			.array()
			.of(
				yup.object().shape({
					dp_installment_termin: yup
						.string()
						.required('Wajib diisi')
						.test(
							'Is positive?',
							'Harus lebih dari 0',
							(value) => Number(value ?? 0) > 0
						),
					// dp_percentage: yup.string().required('Wajib diisi'),
					// dp_total: yup.string().required('Wajib diisi'),
				})
			)
			.when(['unit_data_price_inhouse', 'unit_data_price_kpr'], {
				is: (val: any[], val2: any[]) =>
					(val?.length ?? 0) == 0 && (val2?.length ?? 0) == 0,
				then: yup
					.array()
					.min(1, 'Minimal 1 opsi terisi')
					.typeError('Minimal 1 opsi terisi')
					.required('Minimal 1 opsi terisi'),
			}),
		unit_data_price_cash_nominal: yup.string().when('unit_data_price_cash', {
			is: (val: any[]) => val?.length > 0,
			then: yup
				.string()
				.required('Wajib diisi')
				.test(
					'Is positive?',
					'Harus lebih dari 0',
					(value) => Number(value ?? 0) > 0
				),
		}),
		unit_data_price_inhouse: yup.array().of(
			yup.object().shape({
				unit_nominal: yup
					.string()
					.required('Wajib diisi')
					.test(
						'Is positive?',
						'Harus lebih dari 0',
						(value) => Number(value ?? 0) > 0
					),
				dp_installment_termin: yup
					.string()
					.required('Wajib diisi')
					.test(
						'Is positive?',
						'Harus lebih dari 0',
						(value) => Number(value ?? 0) > 0
					),
			})
		),
		unit_data_price_inhouse_dp: yup.array().of(
			yup.object().shape({
				unit_nominal: yup
					.string()
					.required('Wajib diisi')
					.test(
						'Is positive?',
						'Harus lebih dari 0',
						(value) => Number(value ?? 0) > 0
					),
				dp_percentage: yup
					.string()
					.required('Wajib diisi')
					.test(
						'Is positive?',
						'Nilai tidak boleh minus',
						(value) => Number(value ?? 0) >= 0
					),
				// dp_total: yup.string().required('Wajib diisi'),
				// price_after_dp: yup.string().required('Wajib diisi'),
				// dp_installment_termin: yup.string().required('Wajib diisi'),
				// monthly_installment: yup.string().required('Wajib diisi'),
			})
		),
		unit_data_price_kpr: yup.array().of(
			yup.object().shape({
				dp_percentage: yup
					.string()
					.required('Wajib diisi')
					.test(
						'Is positive?',
						'Nilai tidak boleh minus',
						(value) => Number(value ?? 0) >= 0
					),
				dp_total: yup
					.string()
					.required('Wajib diisi')
					.test(
						'Is positive?',
						'Harus lebih dari 0',
						(value) => Number(value ?? 0) > 0
					),
				dp_installment_termin: yup
					.string()
					.required('Wajib diisi')
					.test(
						'Is positive?',
						'Harus lebih dari 0',
						(value) => Number(value ?? 0) > 0
					),
				// monthly_installment: yup.string().required('Wajib diisi'),
			})
		),
		unit_data_price_kpr_nominal: yup.string().when('unit_data_price_kpr', {
			is: (val: any[]) => val?.length > 0,
			then: yup.string().required('Wajib diisi'),
		}),
		other_cash: yup
			.string()
			.test(
				'Is positive?',
				'Nilai tidak boleh minus',
				(value) => Number(value ?? 0) >= 0
			),
		discount_cash: yup
			.string()
			.test(
				'Is positive?',
				'Nilai tidak boleh minus',
				(value) => Number(value ?? 0) >= 0
			),
			other_inhouse: yup
			.string()
			.test(
				'Is positive?',
				'Nilai tidak boleh minus',
				(value) => Number(value ?? 0) >= 0
			),
			discount_inhouse: yup
			.string()
			.test(
				'Is positive?',
				'Nilai tidak boleh minus',
				(value) => Number(value ?? 0) >= 0
			),
			other_inhouse_dp: yup
			.string()
			.test(
				'Is positive?',
				'Nilai tidak boleh minus',
				(value) => Number(value ?? 0) >= 0
			),
			discount_inhouse_dp: yup
			.string()
			.test(
				'Is positive?',
				'Nilai tidak boleh minus',
				(value) => Number(value ?? 0) >= 0
			),
			other_kpr: yup
			.string()
			.test(
				'Is positive?',
				'Nilai tidak boleh minus',
				(value) => Number(value ?? 0) >= 0
			),
			discount_kpr: yup
			.string()
			.test(
				'Is positive?',
				'Nilai tidak boleh minus',
				(value) => Number(value ?? 0) >= 0
			),
	})
	.required()
const unitFormSchema3 = yup
	.object({
		unit_block_data: yup
			.array()
			.of(
				yup.object().shape({
					block_name: yup.string().required('Wajib diisi'),
					block_number: yup.string().required('Wajib diisi'),
					development_status: yup
						.object()
						.shape({
							id: yup.string().required('Wajib diisi'),
						})
						.typeError('Wajib diisi'),
				})
			)
			.min(1, 'Minimal 1 blok terisi'),
	})
	.required()
const unitFormSchemas = { unitFormSchema, unitFormSchema2, unitFormSchema3 }
export default unitFormSchemas

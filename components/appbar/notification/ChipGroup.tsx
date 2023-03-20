import ButtonBase from '@mui/material/ButtonBase'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import React from 'react'
import { NestedKeyOf, TypeMuiIcon } from '../../../types/globals'
import getByKey from '../../../utils/object-utils'

interface PropsChipGroup<T extends object> {
	data: T[]
	value: string
	labelKey: NestedKeyOf<T>
	valueKey: NestedKeyOf<T>
	iconKey?: NestedKeyOf<T>
	onChange: (valueKey: string) => void
	loading?: boolean
	persistent?:boolean
}
function ChipGroup<T extends object>(props: PropsChipGroup<T>) {
	return (
		<Stack direction={'row'} spacing={2}>
			{props.loading
				? [1, 2, 3].map((v) => (
						<Skeleton key={v}>{renderChip(undefined)}</Skeleton>
				  ))
				: props.data.map((v) => renderChip(v))}
		</Stack>
	)

	function renderChip(v: T | undefined): JSX.Element {
		const isSelected = !props.loading
			? props.value == getByKey(v, props.valueKey)
			: false
		const label = getByKey(v, props.labelKey)
		const value = getByKey(v, props.valueKey)
		const Icon = props.iconKey
			? (getByKey(v, props.iconKey) as TypeMuiIcon)
			: undefined
		return (
			<ButtonBase
				onClick={() => props.onChange(isSelected && !props.persistent ?  undefined : value)}
				key={value}
				sx={{ borderRadius: 4 }}
			>
				<Chip
					avatar={
						Icon != undefined ? (
							<Icon
								sx={{
									fontSize: 14,
									fillOpacity:0,
									stroke: (theme) =>
										isSelected
											? theme.palette.primary.main
											: theme.palette.grey[700],
									mr: 1,
								}}
							/>
						) : undefined
					}
					variant="outlined"
					label={label}
					sx={{
						fontSize: '16px',
						py: '10px',
						px: '8px',
						backgroundColor: isSelected ? 'primary.200' : 'background.paper',
						borderColor: isSelected ? 'primary.main' : 'grey.700',
					}}
				/>
			</ButtonBase>
		)
	}
}

export default ChipGroup

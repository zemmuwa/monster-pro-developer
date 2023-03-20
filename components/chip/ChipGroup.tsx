import ButtonBase from '@mui/material/ButtonBase'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import React from 'react'
import { NestedKeyOf, TypeMuiIcon } from '../../types/globals'
import getByKey from '../../utils/object-utils'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'

interface PropsChipGroup<T extends object> {
	data: T[]
	value: string
	labelKey: NestedKeyOf<T>
	valueKey: NestedKeyOf<T>
	iconKey?: NestedKeyOf<T>
	onChange: (valueKey: string) => void
	loading?: boolean
	persistent?: boolean
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
			<Card
				sx={{
					backgroundColor: isSelected ? 'primary.main' : 'background.paper',
					borderRadius:'100px'
				}}
			>
				<CardActionArea
					onClick={() =>
						props.onChange(isSelected && !props.persistent ? undefined : value)
					}
				>
					<Stack direction="row" spacing={0.5} my="10px" mx="20px">
						{Icon != undefined ? (
							<Icon
								sx={{
									width: '18px',
									height: '18px',
									fillOpacity: 0,
									stroke: (theme) =>
										isSelected ? 'white' : theme.palette.grey[700],
									mr: 1,
								}}
							/>
						) : undefined}
						<Typography
							color={(theme) =>
								isSelected ? 'white' : theme.palette.grey[700]
							}
							variant="body2"
							fontWeight={700}
						>
							{label}
						</Typography>
					</Stack>
				</CardActionArea>
			</Card>
			// <ButtonBase
			// 	onClick={() =>
			// 		props.onChange(isSelected && !props.persistent ? undefined : value)
			// 	}
			// 	key={value}
			// 	sx={{
			// 		borderRadius: 4,
			// 		backgroundColor: isSelected ? 'primary.main' : 'background.paper',
			// 		borderColor: isSelected ? 'primary.main' : 'background.paper',
			// 		py: 1.2,
			// 		px: 2.2,
			// 	}}
			// >
			// 	<Chip
			// 		avatar={
			// 			Icon != undefined ? (
			// 				<Icon
			// 					sx={{
			// 						fontSize: 14,
			// 						fillOpacity: 0,
			// 						stroke: (theme) =>
			// 							isSelected ? 'white' : theme.palette.grey[700],
			// 						mr: 1,
			// 					}}
			// 				/>
			// 			) : undefined
			// 		}
			// 		variant="outlined"
			// 		label={label}
			// 		sx={{
			// 			fontSize: '14px',
			// 			// py: '12px',
			// 			// px: '8px',
			// 			color: (theme) => (isSelected ? 'white' : theme.palette.grey[700]),
			// 			borderColor: isSelected ? 'primary.main' : 'background.paper',
			// 		}}
			// 	/>
			// </ButtonBase>
		)
	}
}

export default ChipGroup

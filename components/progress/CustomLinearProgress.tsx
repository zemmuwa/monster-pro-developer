import LinearProgress, {
	linearProgressClasses,
} from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor:
			theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
	},
}))

export default CustomLinearProgress

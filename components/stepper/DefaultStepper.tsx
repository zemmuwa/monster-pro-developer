import React from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

interface PropsDefaultStepper {
	labels: string[]
	activeStep: number
}
function DefaultStepper({ activeStep, labels }: PropsDefaultStepper) {
	return (
		<Stepper activeStep={activeStep} alternativeLabel>
			{labels.map((label, index) => (
				<Step key={index}>
					<StepLabel
						StepIconProps={{
							sx: {
								// width: '40px',
								// height: '40px',
								'& .MuiStepIcon-text': { stroke: 'white' },
								'& .MuiStepLabel-label': { fontWeight: 700 },
							},
						}}
					>
						{label}
					</StepLabel>
				</Step>
			))}
		</Stepper>
	)
}

export default DefaultStepper

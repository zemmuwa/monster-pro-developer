import { createContext, useState, useMemo, PropsWithChildren } from 'react'
import {
	ThemeProvider as MuiThemeProvider,
	createTheme,
} from '@mui/material/styles'
import { PaletteMode } from '@mui/material'
export const ThemeProviderContext = createContext({ toggleColorMode: () => {} })
export default function ThemeProvider({ children }: PropsWithChildren) {
	const [mode, setMode] = useState<PaletteMode>('light')
	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
			},
		}),
		[]
	)

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					...(mode === 'light'
						? {
								background: {
									default: '#f8f9fa',
								},
								primary: {
									main: '#EFC40A',
									'200': '#FDF5D3',
									'300': '#FCF0BC',
								},
								success: {
									main: '#81C828',
									'300': '#A4F4C9',
								},
								warning: {
									main: '#F58E14',
								},
								error: {
									main: '#EF2744',
									300: '#FBD0D6',
								},
								grey: {
									'100': '#E9ECEF',
									'200': '#E7EAEE',
									'300': '#EBEFF4',
									'400': '#67748E',
									'700': '#A0AEC0',
								},

								text: {
									primary: '#252F40',
									secondary: '#9398a1',
									disabled: '#718096',
								},
						  }
						: {}),
				},
				typography: {
					h5: {
						fontWeight: 700,
						lineHeight: '27px',
						fontSize: 20,
						letterSpacing: -0.553191,
					},
					h4: {
						fontWeight: 700,
						lineHeight: '33px',
						fontSize: 24,
						letterSpacing: -0.66383,
					},
					h3: {
						fontWeight: 700,
						lineHeight: '40.85px',
						fontSize: 30,
						letterSpacing: -0.66383,
					},
					h2: {
						fontWeight: 700,
						lineHeight: '49px',
						fontSize: 36,
						letterSpacing: -1,
					},
					h1: {
						fontWeight: 700,
						lineHeight: '65.37px',
						fontSize: 48,
						letterSpacing: -1.33,
					},
				},
			}),
		[mode]
	)
	return (
		<ThemeProviderContext.Provider value={colorMode}>
			<MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
		</ThemeProviderContext.Provider>
	)
}

import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '../redux/index'
import ThemeProvider from '../providers/ThemeProvider'
import ToastProvider from '../providers/ToastProvider'
import DefaultLayout from '../layouts/DefaultLayout'
import PrivateRouteProvider from '../providers/PrivateRouteProvider'
import { Connector } from 'mqtt-react-hooks'

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Connector
					options={{
						username: process.env.NEXT_PUBLIC_MQQT_USERNAME,
						password: process.env.NEXT_PUBLIC_MQQT_PASSWORD,
						keepalive: 30,
					}}
					brokerUrl={process.env.NEXT_PUBLIC_MQQT_BROKER ?? ''}
				>
					<ThemeProvider>
						<ToastProvider>
							<PrivateRouteProvider>
								<DefaultLayout>
									<Component {...pageProps} />
								</DefaultLayout>
							</PrivateRouteProvider>
						</ToastProvider>
					</ThemeProvider>
				</Connector>
			</PersistGate>
		</Provider>
	)
}

export default MyApp

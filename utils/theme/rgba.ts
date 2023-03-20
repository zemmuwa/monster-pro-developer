/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { hexToRgb } from '@mui/material'

function rgba(color: string, opacity: number | string) {
	let rgb = hexToRgb(color).replace('rgb(', '').replace(')', '')
	return `rgba(${rgb}, ${opacity})`
}

export default rgba

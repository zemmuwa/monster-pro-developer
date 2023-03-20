import React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

function SoldUnitIcon(props: SvgIconProps) {
	return (
		<SvgIcon {...props} viewBox="0 0 32 32">
			<path
				d="M23.2337 14.3126H22.874V16.5001H23.2337C23.5077 16.5001 23.6865 16.3839 23.6865 16.0772V14.7821C23.6865 14.4755 23.5077 14.3126 23.2337 14.3126ZM21.1473 26.1876H11.025C10.749 26.1876 10.5615 26.0074 10.5615 25.7314V14.9057L6.66016 25.8514L19.6511 30.4466L21.1473 26.1876ZM16.8403 16.5759C17.1182 16.5759 17.249 16.4182 17.249 16.1072V14.7822C17.249 14.4712 17.1182 14.3134 16.8403 14.3134C16.5657 14.3134 16.4365 14.4712 16.4365 14.7822V16.1072C16.4365 16.4182 16.5657 16.5759 16.8403 16.5759ZM13.0066 4.18318L13.6274 3.38986C13.6735 3.32913 13.7326 3.27946 13.8004 3.24447C13.8682 3.20949 13.9429 3.19006 14.0191 3.18761H16.3628C15.1003 1.75011 13.6741 1.24561 13.0699 1.69543C12.7444 1.93761 12.6223 2.49249 12.7347 3.20243C12.7904 3.53802 12.8816 3.86677 13.0066 4.18318Z"
				fill="#252F40"
			/>
			<path
				d="M25.375 7.6625L22.5867 4.1875H14.2617L13.4959 5.166C13.6323 5.39766 13.7804 5.62221 13.9397 5.83875C14.7334 6.90525 15.6443 7.5905 16.397 7.871C16.5763 7.37418 16.9314 6.96027 17.3951 6.70752C17.8589 6.45478 18.3992 6.38073 18.9139 6.49937C19.4286 6.61802 19.8819 6.92113 20.1883 7.3514C20.4946 7.78166 20.6327 8.30926 20.5763 8.83442C20.52 9.35958 20.2732 9.84591 19.8826 10.2014C19.492 10.557 18.9847 10.7571 18.4566 10.7639C17.9285 10.7707 17.4161 10.5837 17.0165 10.2384C16.6169 9.89308 16.3576 9.41328 16.2878 8.88975C16.0817 8.82707 15.8808 8.74839 15.687 8.65444C14.7826 8.21912 13.8792 7.43269 13.1406 6.43994C13.0353 6.29844 12.9507 6.15469 12.8556 6.00969L11.5625 7.6625V25.1875H25.375V7.6625ZM19.0625 13.8369C19.0625 13.6404 19.2744 13.5706 19.4688 13.5706C19.6631 13.5706 19.875 13.6404 19.875 13.8369V16.5H20.9697C21.1457 16.5 21.226 16.6962 21.226 16.875C21.226 17.0538 21.1458 17.25 20.9697 17.25H19.3897C19.2109 17.25 19.0625 17.2034 19.0625 17.0171V13.8369ZM15.5625 14.7819C15.5625 14.0006 16.0312 13.5706 16.8413 13.5706C17.6546 13.5706 18.125 14.0008 18.125 14.7819V16.1069C18.125 16.8881 17.6546 17.3181 16.8413 17.3181C16.0311 17.3181 15.5625 16.888 15.5625 16.1069V14.7819ZM12.2635 16.6569C12.2635 16.4752 12.4194 16.2056 12.6348 16.2056C12.7431 16.2056 12.8303 16.2728 12.9314 16.3506C13.0684 16.4561 13.2236 16.5756 13.4848 16.5756C13.6941 16.5756 13.9386 16.4974 13.9386 16.2769C13.9386 16.0437 13.6689 15.9184 13.3566 15.7734C12.9097 15.5658 12.3535 15.3074 12.3535 14.6068C12.3535 13.8198 13.0597 13.5406 13.6648 13.5406C13.8362 13.5406 14.6911 13.5632 14.6911 14.0118C14.6911 14.1657 14.5911 14.4531 14.3498 14.4531C14.2736 14.4481 14.1999 14.4241 14.1354 14.3831C13.9924 14.3011 13.8297 14.2596 13.6648 14.2631C13.3192 14.2631 13.1961 14.4019 13.1961 14.5318C13.1961 14.7047 13.4205 14.8036 13.7046 14.9289C14.1589 15.1289 14.7811 15.4035 14.7811 16.1969C14.7811 16.9008 14.2901 17.3381 13.4998 17.3381C12.8412 17.3383 12.2635 17.02 12.2635 16.6571V16.6569ZM23.4649 23.875H13.3836C13.251 23.875 13.1238 23.8223 13.0301 23.7286C12.9363 23.6348 12.8836 23.5076 12.8836 23.375C12.8836 23.2424 12.9363 23.1152 13.0301 23.0214C13.1238 22.9277 13.251 22.875 13.3836 22.875H23.4649C23.5975 22.875 23.7247 22.9277 23.8184 23.0214C23.9122 23.1152 23.9649 23.2424 23.9649 23.375C23.9649 23.5076 23.9122 23.6348 23.8184 23.7286C23.7247 23.8223 23.5975 23.875 23.4649 23.875ZM23.4649 21.5H13.3836C13.251 21.5 13.1238 21.4473 13.0301 21.3536C12.9363 21.2598 12.8836 21.1326 12.8836 21C12.8836 20.8674 12.9363 20.7402 13.0301 20.6464C13.1238 20.5527 13.251 20.5 13.3836 20.5H23.4649C23.5975 20.5 23.7247 20.5527 23.8184 20.6464C23.9122 20.7402 23.9649 20.8674 23.9649 21C23.9649 21.1326 23.9122 21.2598 23.8184 21.3536C23.7247 21.4473 23.5975 21.5 23.4649 21.5ZM24.5 16.0771C24.5 16.8583 24.048 17.25 23.2347 17.25H22.3496C22.138 17.25 22 17.1739 22 17.0221V13.837C22 13.6852 22.138 13.5625 22.3496 13.5625H23.2347C24.048 13.5625 24.5 14.0009 24.5 14.782V16.0771Z"
				fill="#252F40"
			/>
			<path
				d="M17.8745 7.59026C17.7107 7.67901 17.5705 7.80579 17.4658 7.95995C17.5312 7.93647 17.5929 7.90374 17.649 7.86276C17.7439 7.7903 17.8211 7.69709 17.8745 7.59026ZM18.4231 9.76451C18.6835 9.76474 18.9364 9.67699 19.1407 9.51548C19.345 9.35398 19.4888 9.12819 19.5487 8.87474C19.6086 8.62128 19.5811 8.35503 19.4707 8.11914C19.3603 7.88326 19.1735 7.69158 18.9405 7.5752C18.8243 8.0382 18.5898 8.40951 18.2461 8.66526C17.9809 8.86001 17.6675 8.97867 17.3398 9.00845C17.4217 9.22993 17.5694 9.42108 17.763 9.55623C17.9566 9.69137 18.187 9.76405 18.4231 9.76451Z"
				fill="#252F40"
			/>
		</SvgIcon>
	)
}

export default SoldUnitIcon
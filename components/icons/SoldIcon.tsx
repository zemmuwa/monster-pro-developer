import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import React from 'react'

function SoldIcon(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<g id="surface1">
				<path d="M 4.492188 15.039062 C 4.394531 15.042969 4.300781 15.03125 4.210938 15 C 4.121094 14.964844 4.035156 14.917969 3.964844 14.855469 C 3.859375 14.757812 3.78125 14.632812 3.742188 14.492188 C 3.707031 14.351562 3.710938 14.203125 3.757812 14.066406 C 3.804688 13.929688 3.890625 13.808594 4.003906 13.71875 C 4.121094 13.628906 4.257812 13.578125 4.402344 13.566406 C 4.496094 13.5625 4.59375 13.574219 4.683594 13.605469 C 4.773438 13.636719 4.855469 13.6875 4.925781 13.75 C 5 13.8125 5.058594 13.890625 5.101562 13.980469 C 5.140625 14.066406 5.167969 14.160156 5.171875 14.257812 C 5.175781 14.308594 5.1875 14.355469 5.210938 14.398438 C 5.230469 14.445312 5.261719 14.484375 5.296875 14.515625 C 5.335938 14.550781 5.378906 14.574219 5.425781 14.589844 C 5.472656 14.605469 5.519531 14.613281 5.570312 14.609375 C 5.617188 14.605469 5.667969 14.59375 5.710938 14.574219 C 5.757812 14.550781 5.796875 14.519531 5.828125 14.484375 C 5.859375 14.449219 5.886719 14.40625 5.902344 14.359375 C 5.917969 14.3125 5.925781 14.261719 5.921875 14.210938 C 5.90625 13.96875 5.832031 13.734375 5.703125 13.53125 C 5.574219 13.324219 5.398438 13.152344 5.191406 13.03125 C 4.980469 12.910156 4.742188 12.839844 4.5 12.832031 C 4.257812 12.824219 4.015625 12.875 3.800781 12.980469 C 3.582031 13.085938 3.394531 13.246094 3.25 13.441406 C 3.109375 13.640625 3.015625 13.867188 2.984375 14.109375 C 2.953125 14.347656 2.976562 14.59375 3.0625 14.820312 C 3.144531 15.046875 3.285156 15.25 3.46875 15.414062 C 3.609375 15.542969 3.78125 15.644531 3.964844 15.707031 C 4.148438 15.773438 4.34375 15.800781 4.539062 15.789062 C 4.632812 15.78125 4.726562 15.792969 4.820312 15.824219 C 4.910156 15.855469 4.992188 15.90625 5.0625 15.96875 C 5.171875 16.066406 5.246094 16.191406 5.285156 16.332031 C 5.320312 16.472656 5.316406 16.621094 5.269531 16.757812 C 5.222656 16.894531 5.136719 17.015625 5.023438 17.105469 C 4.910156 17.195312 4.769531 17.246094 4.625 17.257812 C 4.53125 17.261719 4.433594 17.25 4.34375 17.21875 C 4.253906 17.1875 4.171875 17.136719 4.101562 17.074219 C 4.027344 17.011719 3.96875 16.933594 3.925781 16.84375 C 3.886719 16.757812 3.859375 16.664062 3.855469 16.566406 C 3.851562 16.515625 3.839844 16.46875 3.816406 16.425781 C 3.796875 16.378906 3.765625 16.339844 3.730469 16.308594 C 3.691406 16.273438 3.648438 16.25 3.601562 16.234375 C 3.554688 16.21875 3.507812 16.210938 3.457031 16.214844 C 3.410156 16.21875 3.359375 16.230469 3.316406 16.25 C 3.273438 16.273438 3.230469 16.304688 3.199219 16.339844 C 3.167969 16.375 3.140625 16.417969 3.125 16.464844 C 3.109375 16.511719 3.101562 16.5625 3.105469 16.613281 C 3.117188 16.804688 3.164062 16.996094 3.25 17.171875 C 3.335938 17.347656 3.453125 17.503906 3.601562 17.632812 C 3.867188 17.875 4.21875 18.007812 4.578125 18.007812 C 4.609375 18.007812 4.640625 18.007812 4.671875 18.007812 C 4.960938 17.988281 5.242188 17.878906 5.476562 17.703125 C 5.707031 17.523438 5.882812 17.28125 5.976562 17.003906 C 6.070312 16.726562 6.082031 16.429688 6.007812 16.144531 C 5.933594 15.863281 5.78125 15.605469 5.5625 15.410156 C 5.417969 15.28125 5.246094 15.179688 5.0625 15.117188 C 4.878906 15.050781 4.683594 15.023438 4.492188 15.039062 Z M 11.246094 13.136719 C 10.988281 12.90625 10.6875 12.730469 10.363281 12.617188 C 10.035156 12.503906 9.691406 12.457031 9.347656 12.476562 C 9.003906 12.5 8.664062 12.589844 8.355469 12.738281 C 8.046875 12.890625 7.769531 13.105469 7.542969 13.363281 C 7.207031 13.742188 6.992188 14.210938 6.914062 14.710938 C 6.839844 15.214844 6.910156 15.726562 7.117188 16.1875 C 7.324219 16.648438 7.660156 17.042969 8.082031 17.320312 C 8.507812 17.597656 9 17.746094 9.507812 17.75 C 9.558594 17.75 9.613281 17.75 9.664062 17.746094 C 10.183594 17.710938 10.679688 17.523438 11.09375 17.207031 C 11.503906 16.890625 11.816406 16.457031 11.984375 15.964844 C 12.152344 15.472656 12.171875 14.945312 12.039062 14.441406 C 11.910156 13.9375 11.632812 13.484375 11.246094 13.136719 Z M 9.621094 16.996094 C 9.25 17.015625 8.878906 16.921875 8.558594 16.734375 C 8.242188 16.542969 7.984375 16.261719 7.824219 15.929688 C 7.660156 15.59375 7.601562 15.21875 7.652344 14.851562 C 7.703125 14.480469 7.859375 14.136719 8.105469 13.855469 C 8.269531 13.671875 8.464844 13.519531 8.6875 13.410156 C 8.90625 13.304688 9.148438 13.238281 9.394531 13.226562 C 9.429688 13.222656 9.46875 13.222656 9.503906 13.222656 C 9.960938 13.222656 10.402344 13.390625 10.742188 13.695312 C 11.019531 13.945312 11.21875 14.269531 11.3125 14.628906 C 11.40625 14.988281 11.394531 15.367188 11.273438 15.71875 C 11.152344 16.070312 10.933594 16.382812 10.636719 16.609375 C 10.34375 16.835938 9.988281 16.96875 9.617188 16.996094 Z M 15.976562 16.433594 L 13.878906 16.558594 L 13.648438 12.773438 C 13.644531 12.675781 13.597656 12.582031 13.523438 12.515625 C 13.449219 12.449219 13.351562 12.414062 13.25 12.421875 C 13.152344 12.425781 13.058594 12.472656 12.992188 12.546875 C 12.925781 12.621094 12.894531 12.71875 12.898438 12.820312 L 13.171875 17.351562 L 16.023438 17.179688 C 16.070312 17.175781 16.121094 17.164062 16.164062 17.144531 C 16.210938 17.121094 16.25 17.089844 16.28125 17.054688 C 16.3125 17.019531 16.339844 16.972656 16.355469 16.929688 C 16.371094 16.882812 16.378906 16.832031 16.375 16.78125 C 16.371094 16.734375 16.359375 16.683594 16.335938 16.640625 C 16.316406 16.597656 16.285156 16.558594 16.25 16.523438 C 16.210938 16.492188 16.167969 16.464844 16.121094 16.449219 C 16.074219 16.433594 16.027344 16.425781 15.976562 16.429688 Z M 20.949219 14.21875 C 20.933594 13.929688 20.859375 13.644531 20.730469 13.382812 C 20.605469 13.121094 20.425781 12.890625 20.210938 12.695312 C 19.992188 12.503906 19.738281 12.355469 19.464844 12.261719 C 19.191406 12.167969 18.898438 12.128906 18.609375 12.144531 L 17.003906 12.242188 L 17.296875 17.058594 L 18.902344 16.960938 C 19.191406 16.941406 19.472656 16.867188 19.734375 16.742188 C 19.996094 16.613281 20.230469 16.4375 20.421875 16.21875 C 20.613281 16.003906 20.761719 15.75 20.855469 15.476562 C 20.953125 15.199219 20.992188 14.910156 20.972656 14.621094 Z M 19.863281 15.722656 C 19.734375 15.867188 19.582031 15.984375 19.40625 16.066406 C 19.234375 16.148438 19.046875 16.199219 18.855469 16.210938 L 18 16.261719 L 17.800781 12.945312 L 18.65625 12.894531 C 18.847656 12.882812 19.039062 12.90625 19.21875 12.96875 C 19.402344 13.03125 19.570312 13.128906 19.710938 13.257812 C 19.855469 13.386719 19.972656 13.539062 20.058594 13.710938 C 20.140625 13.882812 20.191406 14.070312 20.203125 14.261719 L 20.226562 14.664062 C 20.238281 14.855469 20.210938 15.050781 20.148438 15.230469 C 20.085938 15.410156 19.988281 15.578125 19.859375 15.722656 Z M 19.863281 15.722656 " />
				<path d="M 22.585938 9.144531 L 17.832031 9.433594 L 11.882812 3.828125 C 12.105469 3.652344 12.261719 3.402344 12.328125 3.128906 C 12.398438 2.851562 12.375 2.558594 12.261719 2.296875 C 12.152344 2.035156 11.957031 1.816406 11.707031 1.675781 C 11.460938 1.535156 11.175781 1.476562 10.890625 1.511719 C 10.609375 1.550781 10.347656 1.675781 10.140625 1.875 C 9.9375 2.078125 9.804688 2.335938 9.765625 2.621094 C 9.722656 2.902344 9.773438 3.1875 9.910156 3.4375 C 10.046875 3.6875 10.261719 3.886719 10.523438 4.003906 L 5.007812 10.207031 L 0.792969 10.460938 L 1.414062 20.777344 L 23.207031 19.460938 Z M 11.0625 2.25 C 11.171875 2.25 11.28125 2.28125 11.375 2.34375 C 11.46875 2.40625 11.539062 2.496094 11.582031 2.597656 C 11.625 2.699219 11.636719 2.8125 11.613281 2.921875 C 11.59375 3.03125 11.539062 3.132812 11.460938 3.210938 C 11.382812 3.289062 11.28125 3.34375 11.171875 3.363281 C 11.0625 3.386719 10.949219 3.375 10.847656 3.332031 C 10.746094 3.289062 10.65625 3.21875 10.59375 3.125 C 10.53125 3.03125 10.5 2.925781 10.5 2.8125 C 10.5 2.664062 10.558594 2.519531 10.664062 2.414062 C 10.769531 2.308594 10.914062 2.25 11.0625 2.25 Z M 11.273438 4.289062 L 16.804688 9.492188 L 6.070312 10.144531 Z M 2.117188 19.984375 L 1.585938 11.164062 L 21.882812 9.9375 L 22.414062 18.753906 Z M 2.117188 19.984375 " />
			</g>
		</SvgIcon>
	)
}

export default SoldIcon
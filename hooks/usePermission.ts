import React, { useContext, useMemo } from 'react'
import { PrivateRouteProviderContext } from '../providers/PrivateRouteProvider'

function usePermission() {
	const { userInfo } = useContext(PrivateRouteProviderContext)
	const isAdmin = userInfo?.user_role == 'ADM-MP'
	const permission = useMemo(
		() => ({
			canPublish: isAdmin,
			canEdit: isAdmin,
			canRefundUtj: isAdmin,
		}),
		[isAdmin]
	)
	return { permission, isAdmin }
}

export default usePermission

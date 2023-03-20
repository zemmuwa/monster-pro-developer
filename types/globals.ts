import { OverridableComponent } from "@mui/material/OverridableComponent"
import { SvgIconTypeMap } from "@mui/material/SvgIcon"

// 3 - Add the object's key
export type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
		? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
		: `${Key}`
}[keyof ObjectType & (string | number)]

export type TypeMuiIcon = OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }

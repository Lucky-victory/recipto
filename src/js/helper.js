import { getDevice } from "framework7";

const device=getDevice()
export const isMobile=device.ios||device.android
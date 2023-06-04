import { inject } from "@angular/core"
import { FeaturesServiceToken } from "../interfaces/features.interface"

export const isFeatureOn = (flag: string) => {
  return () => inject(FeaturesServiceToken).isOn$(flag);
}

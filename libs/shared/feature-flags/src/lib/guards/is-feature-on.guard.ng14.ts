import { Inject, Injectable } from "@angular/core"
import { FeaturesServiceToken, IFeaturesService } from "../interfaces/features.interface"
import { CanMatch, Route } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class isFeatureOnNg14 implements CanMatch {
  constructor(@Inject(FeaturesServiceToken) private featuresServiceToken: IFeaturesService) {}

  canMatch(route: Route): Observable<boolean> {
    return this.featuresServiceToken.isOn$(route?.data?.['feature']);
  }
}

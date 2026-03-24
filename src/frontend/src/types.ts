import { Variant_low_high_medium } from "./backend.d";

export type Severity = Variant_low_high_medium;
export { Variant_low_high_medium };

export type AppPage =
  | "splash"
  | "auth"
  | "home"
  | "scan"
  | "result"
  | "history"
  | "profile";

export interface MockAnalysisResult {
  diseaseName: string;
  severity: Severity;
  treatment: string;
  prevention: string;
  plantName: string;
}

export interface SampleHistory {
  plant: string;
  disease: string;
  severity: "high" | "medium" | "low";
  date: string;
}

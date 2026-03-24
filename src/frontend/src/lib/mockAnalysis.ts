import { Variant_low_high_medium } from "../backend.d";
import type { MockAnalysisResult } from "../types";

const diseases: MockAnalysisResult[] = [
  {
    diseaseName: "Tomato Late Blight",
    severity: Variant_low_high_medium.high,
    treatment:
      "Apply copper-based fungicide immediately. Remove and destroy infected plant parts. Avoid wetting leaves when watering.",
    prevention:
      "Avoid overhead watering. Use resistant varieties. Ensure proper plant spacing for air circulation.",
    plantName: "Tomato",
  },
  {
    diseaseName: "Powdery Mildew",
    severity: Variant_low_high_medium.medium,
    treatment:
      "Apply neem oil spray or potassium bicarbonate solution. Prune affected leaves to reduce spread.",
    prevention:
      "Ensure good air circulation around plants. Avoid overhead irrigation. Plant in sunny locations.",
    plantName: "Cucumber",
  },
  {
    diseaseName: "Leaf Rust",
    severity: Variant_low_high_medium.medium,
    treatment:
      "Apply sulfur-based fungicide. Remove infected leaves and dispose away from garden.",
    prevention:
      "Remove infected leaves promptly. Rotate crops annually. Choose rust-resistant varieties.",
    plantName: "Wheat",
  },
  {
    diseaseName: "Bacterial Spot",
    severity: Variant_low_high_medium.low,
    treatment:
      "Apply copper hydroxide spray. Avoid working with plants when wet. Remove heavily infected leaves.",
    prevention:
      "Use disease-resistant varieties. Avoid overhead irrigation. Sanitize garden tools regularly.",
    plantName: "Pepper",
  },
  {
    diseaseName: "Healthy Plant",
    severity: Variant_low_high_medium.low,
    treatment: "No treatment needed. Continue your current care routine.",
    prevention:
      "Maintain regular watering schedule. Monitor for early signs of disease. Feed with balanced fertilizer.",
    plantName: "Healthy",
  },
];

export function runMockAnalysis(): MockAnalysisResult {
  return diseases[Math.floor(Math.random() * diseases.length)];
}

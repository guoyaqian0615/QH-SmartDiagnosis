import { getPublicApiOrigin, hasPublicApiOrigin } from "@/lib/api/public-origin";
import type {
  ClinicalInferenceRequest,
  ClinicalInferenceResponse,
} from "@/types/clinical-inference";

const PATH = "/v1/clinical/inference";
const LOCAL_PATH = "/api/clinical/inference";

export async function requestClinicalInference(
  body: ClinicalInferenceRequest,
  init?: RequestInit,
): Promise<ClinicalInferenceResponse> {
  const endpoint = hasPublicApiOrigin()
    ? `${getPublicApiOrigin()}${PATH}`
    : LOCAL_PATH;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Inference failed (${res.status})`);
  }

  return (await res.json()) as ClinicalInferenceResponse;
}

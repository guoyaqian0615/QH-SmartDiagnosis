import { getPublicApiOrigin, hasPublicApiOrigin } from "@/lib/api/public-origin";
import type {
  ConstitutionQuestionnaire,
  ConstitutionScreeningResponse,
} from "@/types/constitution-screening";

const PATH = "/v1/constitution/screening";
const LOCAL_PATH = "/api/constitution/screening";

export async function requestConstitutionScreening(
  questionnaire: ConstitutionQuestionnaire,
  init?: RequestInit,
): Promise<ConstitutionScreeningResponse> {
  const payload = {
    questionnaire: questionnaire
  };

  const endpoint = hasPublicApiOrigin()
    ? `${getPublicApiOrigin()}${PATH}`
    : LOCAL_PATH;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Screening failed (${res.status})`);
  }
  return (await res.json()) as ConstitutionScreeningResponse;
}

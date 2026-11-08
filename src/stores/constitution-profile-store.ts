import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { buildConstitutionContextFromScreening } from "@/lib/clinical/constitution-context";
import type { ConstitutionScreeningResponse } from "@/types/constitution-screening";
import type { ClinicalConstitutionContext } from "@/types/clinical-inference";

export type ConstitutionProfileSnapshot = {
  context: ClinicalConstitutionContext;
  narrative?: string;
  savedAt: number;
};

type ConstitutionProfileState = {
  latest: ConstitutionProfileSnapshot | null;
  saveFromScreening: (result: ConstitutionScreeningResponse) => void;
  clear: () => void;
};

/** 体质记录有效期：超过后问诊回退到默认先验，并提示重新测评。 */
export const CONSTITUTION_PROFILE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

export function isConstitutionProfileFresh(
  snapshot: ConstitutionProfileSnapshot | null | undefined,
  now = Date.now(),
): snapshot is ConstitutionProfileSnapshot {
  if (!snapshot) return false;
  return now - snapshot.savedAt <= CONSTITUTION_PROFILE_MAX_AGE_MS;
}

export const useConstitutionProfileStore = create<ConstitutionProfileState>()(
  persist(
    (set) => ({
      latest: null,
      saveFromScreening: (result) =>
        set({
          latest: {
            context: buildConstitutionContextFromScreening(result),
            narrative: result.narrative,
            savedAt: Date.now(),
          },
        }),
      clear: () => set({ latest: null }),
    }),
    {
      name: "dbcnet-constitution-profile",
      // v2：问卷与评分引擎重做，旧版本保存的体质结果不可信，升级时直接丢弃
      version: 2,
      migrate: () => ({ latest: null }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ latest: state.latest }),
    },
  ),
);

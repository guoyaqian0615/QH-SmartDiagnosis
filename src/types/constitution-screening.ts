/** POST /v1/constitution/screening (only questionnaire JSON) */
export type ConstitutionQuestionnaire = {
  answers: Record<string, number | string>;
};

export type ConstitutionScreeningResponse = {
  /** Nine‑type TCM constitution or backend‑specific taxonomy */
  constitutionTypes: { code: string; label: string; score: number }[];
  narrative: string;
  cautions?: string[];
  questionnaireScores?: Record<string, number>;
};

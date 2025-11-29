export const GOALS = [
  { id: 0, label: "General English" },
  { id: 1, label: "IELTS/TOEFL" },
  { id: 2, label: "Professional Skills" },
];

export const AGES = [
  { id: 0, label: "Under 18" },
  { id: 1, label: "18 to 30" },
  { id: 2, label: "30 to 50" },
  { id: 3, label: "50+" },
];

export const LEVELS = [
  { id: 0, code: "A1", label: "Beginner" },
  { id: 1, code: "A2", label: "Elementary" },
  { id: 2, code: "B1", label: "Intermediate" },
  { id: 3, code: "B2", label: "Upper Intermediate" },
  { id: 4, code: "C1", label: "Advanced" },
  { id: 5, code: "C2", label: "Proficiency" },
];

const CODE_LEVELS = [
  { id: 0, label: "A1 - Beginner" },
  { id: 1, label: "A2 - Elementary" },
  { id: 2, label: "B1 - Intermediate" },
  { id: 3, label: "B2 - Upper Intermediate" },
  { id: 4, label: "C1 - Advanced" },
  { id: 5, label: "C2 - Proficiency" },
];

export const FIELD_CONFIG = {
  user_level: { label: "English Level", options: CODE_LEVELS },
  goal_type: { label: "Goal", options: GOALS },
  age_group: { label: "Age Group", options: AGES },
};
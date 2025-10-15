export const SAFETY_CLASSES = [
  "OxygenTank",
  "NitrogenTank",
  "FirstAidBox",
  "FireAlarm",
  "SafetySwitchPanel",
  "EmergencyPhone",
  "FireExtinguisher",
] as const

export type SafetyClass = (typeof SAFETY_CLASSES)[number]

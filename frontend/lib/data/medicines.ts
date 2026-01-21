/**
 * Medicine Salt Database
 * Contains medicine salt names with their short forms for quick searching
 */

import medicinesData from "./medicines.json"

export interface MedicineSalt {
  id: string
  saltName: string
  shortForm: string
  commonName?: string
  companyName?: string
}

export const MEDICINE_SALTS: MedicineSalt[] = medicinesData as MedicineSalt[]

/**
 * Search medicines by salt name, short form, common name, or company name
 */
export function searchMedicines(query: string): MedicineSalt[] {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase().trim()

  return MEDICINE_SALTS.filter(
    (medicine) =>
      medicine.saltName.toLowerCase().includes(lowerQuery) ||
      medicine.shortForm.toLowerCase().includes(lowerQuery) ||
      (medicine.commonName && medicine.commonName.toLowerCase().includes(lowerQuery)) ||
      (medicine.companyName && medicine.companyName.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get medicine by ID
 */
export function getMedicineById(id: string): MedicineSalt | undefined {
  return MEDICINE_SALTS.find((medicine) => medicine.id === id)
}


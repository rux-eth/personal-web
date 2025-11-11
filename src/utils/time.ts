// Minimal replacement utilities for chance.js functionality needed by rain.tsx

// Generate a random float in [min, max] with specific precision
export function floating({
  min = 0,
  max = 1,
  fixed = 2
}: {
  min?: number
  max?: number
  fixed?: number
}) {
  const rand = Math.random() * (max - min) + min
  return +rand.toFixed(fixed)
}

// Generate a random integer in [min, max]
export function integer({ min = 0, max = 1 }: { min?: number; max?: number }) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Pick `amount` unique elements from the array, similar to chance.pickset
export function pickset<T>(arr: T[], amount: number): T[] {
  if (amount >= arr.length) return [...arr]
  const arrCopy = [...arr]
  const picked: T[] = []
  for (let i = 0; i < amount; i++) {
    const idx = integer({ min: 0, max: arrCopy.length - 1 })
    picked.push(arrCopy.splice(idx, 1)[0])
  }
  return picked
}

// getAge calculates age in years given a birth date. default is october 26, 2000
export function getAge(birthDate: Date = new Date('2000-10-26')): number {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--
    }
    return age
}
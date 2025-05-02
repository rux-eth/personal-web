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

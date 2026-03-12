export function getTodayId() {
  return new Date().toISOString().slice(0, 10)
}

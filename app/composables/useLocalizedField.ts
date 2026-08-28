export function useLocalizedField() {
  const { locale } = useI18n()

  return (value: unknown): string => {
    if (value == null) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
      const obj = value as Record<string, string>
      return obj[locale.value] || obj.en || ''
    }
    return String(value)
  }
}

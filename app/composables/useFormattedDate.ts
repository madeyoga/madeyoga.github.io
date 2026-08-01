export function useFormattedDate(date: string | Date | null | undefined) {
  const dateObj = computed(() => {
    if (!date) {
      return null
    }

    const parsed = typeof date === 'string' ? new Date(date) : date
    return Number.isNaN(parsed.getTime()) ? null : parsed
  })

  const isoDate = computed(() => dateObj.value?.toISOString() ?? '')

  const formattedDate = computed(() => {
    if (!dateObj.value) {
      return ''
    }

    return dateObj.value.toLocaleDateString('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC' // ensures SSR & client match
    })
  })

  return { dateObj, isoDate, formattedDate }
}

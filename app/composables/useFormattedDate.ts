export function useFormattedDate(date: string | Date) {
  const dateObj = computed(() =>
    typeof date === 'string' ? new Date(date) : date
  )

  const isoDate = computed(() => dateObj.value.toISOString())

  const formattedDate = computed(() =>
    dateObj.value.toLocaleDateString('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC' // ensures SSR & client match
    })
  )

  return { dateObj, isoDate, formattedDate }
}

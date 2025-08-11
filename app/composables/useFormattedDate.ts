export function useFormattedDate(date: string | Date) {
  const dateObj = computed(() =>{
    const parsed = typeof date === 'string' ? new Date(date) : date

    if (import.meta.server) {
      console.log('[SSR] raw input:', date)
      console.log('[SSR] parsed date:', parsed.toISOString())
    }
    if (import.meta.client) {
      console.log('[Client] raw input:', date)
      console.log('[Client] parsed date:', parsed.toISOString())
    }
    
    return parsed
  })

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

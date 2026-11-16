const dateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

export const formatDateTime = (value, emptyLabel = '') => {
  if (!value) return emptyLabel || String(value ?? '')

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return dateTimeFormatter.format(date)
}

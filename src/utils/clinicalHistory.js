export const normalizeClinicalHistoryRecord = (record, index) => {
  const veterinarian = record.veterinario ?? record.veterinarian ?? record.doctor
  const veterinarianName = typeof veterinarian === 'string'
    ? veterinarian
    : veterinarian?.nombre || veterinarian?.name

  return {
    id: record.id ?? record._id ?? index,
    date: record.fecha_registro ?? record.fecha ?? record.date ?? record.fechaRegistro ?? record.createdAt ?? '',
    description: record.descripcion ?? record.description ?? record.detalle ?? 'Sin descripción',
    veterinarian: veterinarianName || record.veterinarioNombre || 'No informado'
  }
}

export const formatClinicalHistoryDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}
import { formatDateTime } from './date.js'

export const normalizeClinicalHistoryRecord = (record, index) => {
  const veterinarian = record.veterinario ?? record.veterinarian ?? record.doctor
  const veterinarianName = typeof veterinarian === 'string'
    ? veterinarian
    : veterinarian?.nombre || veterinarian?.name

  return {
    id: record.id ?? record._id ?? index,
    date: record.fecha_registro ?? record.fecha ?? record.date ?? record.fechaRegistro ?? record.createdAt ?? '',
    description: record.descripcion ?? record.description ?? record.detalle ?? 'Sin descripción',
    veterinarianValue: veterinarianName || null,
    veterinarian: veterinarianName || record.veterinarioNombre || 'No informado'
  }
}

export const formatClinicalHistoryDate = (value) => formatDateTime(value)

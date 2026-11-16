export const SOLICITUD_STATES = ['PENDIENTE', 'APROBADA', 'RECHAZADA']

const firstValue = (...values) => values.find(Boolean)

export const normalizeSolicitud = (solicitud, index) => {
  const mascota = solicitud.mascota || solicitud.pet || solicitud.data?.mascota || {}
  const adoptante = solicitud.adoptante || solicitud.usuario || solicitud.user || {}
  const estado = solicitud.estado || solicitud.status || solicitud.estadoSolicitud || 'PENDIENTE'

  return {
    id: solicitud.id ?? solicitud._id ?? index + 1,
    mascotaName: mascota.name || mascota.nombre || 'Mascota no especificada',
    adoptanteName:
      firstValue(adoptante.name, adoptante.nombre, adoptante.email, adoptante.correo) ||
      'Adoptante no especificado',
    estado,
    estadoSeleccionado: estado,
    fechaCreacion: firstValue(
      solicitud.fechaCreacion,
      solicitud.fecha_creacion,
      solicitud.createdAt,
      solicitud.fecha
    ),
    mensaje: solicitud.mensaje || solicitud.descripcion || solicitud.notes || ''
  }
}

export const isAdminUser = (user) => String(user?.role || '').trim().toUpperCase() === 'ADMIN'

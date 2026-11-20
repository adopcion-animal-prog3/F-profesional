export const SOLICITUD_STATES = ['PENDIENTE', 'APROBADA', 'RECHAZADA']

const firstValue = (...values) => values.find(Boolean)

export const normalizeSolicitud = (solicitud, index) => {
  const mascota = solicitud.mascota || solicitud.pet || solicitud.data?.mascota || {}
  const adoptante = solicitud.adoptante || solicitud.usuario || solicitud.user || {}
  const estado = solicitud.estado || solicitud.status || solicitud.estadoSolicitud || 'PENDIENTE'

  return {
    id: solicitud.id ?? solicitud._id ?? index + 1,
    mascotaId: solicitud.mascota_id ?? mascota.id ?? null,
    usuarioId: solicitud.usuario_id ?? adoptante.id ?? null,
    mascotaName: solicitud.mascota_nombre || mascota.name || mascota.nombre || 'Mascota no especificada',
    adoptanteName:
      firstValue(solicitud.usuario_nombre, adoptante.name, adoptante.nombre, adoptante.email, adoptante.correo) ||
      'Adoptante no especificado',
    estado,
    estadoSeleccionado: estado,
    fechaCreacion: firstValue(
      solicitud.fechaCreacion,
      solicitud.fecha_creacion,
      solicitud.createdAt,
      solicitud.created_at,
      solicitud.fecha
    ),
    mensaje: solicitud.mensaje || solicitud.descripcion || solicitud.notes || ''
  }
}

export const isAdminUser = (user) => String(user?.rol || user?.role || '').trim().toUpperCase() === 'ADMIN'

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatClinicalHistoryDate, normalizeClinicalHistoryRecord } from '../src/utils/clinicalHistory.js'
import { formatDateTime } from '../src/utils/date.js'
import { isAdminUser, normalizeSolicitud } from '../src/utils/solicitudes.js'

test('normalizeSolicitud toma mascota, adoptante y estado de la respuesta', () => {
  const solicitud = normalizeSolicitud({
    id: 5,
    mascota: { nombre: 'Luna' },
    usuario: { email: 'ana@test.com' },
    estado: 'APROBADA',
    created_at: '2026-01-01',
    createdAt: '2026-01-02',
    mensaje: 'Quiero adoptarla'
  }, 0)

  assert.equal(solicitud.id, 5)
  assert.equal(solicitud.mascotaName, 'Luna')
  assert.equal(solicitud.adoptanteName, 'ana@test.com')
  assert.equal(solicitud.estado, 'APROBADA')
  assert.equal(solicitud.estadoSeleccionado, 'APROBADA')
  assert.equal(solicitud.fechaCreacion, '2026-01-02')
})

test('normalizeSolicitud usa valores por defecto', () => {
  const solicitud = normalizeSolicitud({}, 2)

  assert.equal(solicitud.id, 3)
  assert.equal(solicitud.estado, 'PENDIENTE')
  assert.equal(solicitud.mascotaName, 'Mascota no especificada')
  assert.equal(solicitud.adoptanteName, 'Adoptante no especificado')
  assert.equal(solicitud.mensaje, '')
})

test('isAdminUser reconoce el rol ADMIN sin importar mayúsculas', () => {
  assert.equal(isAdminUser({ role: ' admin ' }), true)
  assert.equal(isAdminUser({ role: 'ADOPTANTE' }), false)
  assert.equal(isAdminUser(null), false)
})

test('normalizeClinicalHistoryRecord acepta veterinario como texto u objeto', () => {
  const fromText = normalizeClinicalHistoryRecord({ id: 1, descripcion: 'Vacuna', veterinario: 'Dra. Paz' }, 0)
  const fromObject = normalizeClinicalHistoryRecord({ veterinario: { nombre: 'Dr. Gil' } }, 4)

  assert.equal(fromText.veterinarian, 'Dra. Paz')
  assert.equal(fromText.description, 'Vacuna')
  assert.equal(fromObject.id, 4)
  assert.equal(fromObject.veterinarian, 'Dr. Gil')
  assert.equal(normalizeClinicalHistoryRecord({}, 0).veterinarian, 'No informado')
})

test('formatDateTime formatea fechas válidas y respeta los valores inválidos', () => {
  assert.notEqual(formatDateTime('2026-03-10T12:00:00Z'), '2026-03-10T12:00:00Z')
  assert.equal(formatDateTime('no es fecha'), 'no es fecha')
  assert.equal(formatDateTime('', 'No disponible'), 'No disponible')
  assert.equal(formatClinicalHistoryDate('texto'), 'texto')
})

test('normalizeSolicitud usa los nombres enriquecidos por la API profesional', () => {
  const solicitud = normalizeSolicitud({
    id: 9, usuario_id: 7, mascota_id: 3, estado: 'PENDIENTE',
    mascota_nombre: 'Luna', usuario_nombre: 'Ana', created_at: '2026-01-01T00:00:00Z'
  }, 0)

  assert.equal(solicitud.mascotaName, 'Luna')
  assert.equal(solicitud.adoptanteName, 'Ana')
  assert.equal(solicitud.usuarioId, 7)
  assert.equal(solicitud.mascotaId, 3)
  assert.equal(solicitud.fechaCreacion, '2026-01-01T00:00:00Z')
})

test('isAdminUser también reconoce el campo rol de la API', () => {
  assert.equal(isAdminUser({ rol: 'ADMIN' }), true)
})

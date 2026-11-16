import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  deleteDemoPet,
  findDemoPet,
  listDemoPets,
  resetDemoPets,
  updateDemoPet
} from '../src/api/demoPets.js'
import { getErrorKind, isNetworkFailure, normalizePetPayload, pickArray } from '../src/api/normalizers.js'

afterEach(resetDemoPets)

test('pickArray encuentra el listado en distintas formas de respuesta', () => {
  assert.deepEqual(pickArray([1, 2]), [1, 2])
  assert.deepEqual(pickArray({ mascotas: [1] }, ['mascotas', 'data']), [1])
  assert.deepEqual(pickArray({ data: [2] }, ['mascotas', 'data']), [2])
  assert.deepEqual(pickArray({ otra: 'cosa' }, ['data']), [])
  assert.deepEqual(pickArray(null), [])
})

test('normalizePetPayload extrae la mascota del sobre de la respuesta', () => {
  assert.deepEqual(normalizePetPayload({ mascota: { id: 1 } }), { id: 1 })
  assert.deepEqual(normalizePetPayload({ data: { id: 2 } }), { id: 2 })
  assert.deepEqual(normalizePetPayload({ id: 3 }), { id: 3 })
  assert.equal(normalizePetPayload(null), null)
})

test('getErrorKind clasifica los errores HTTP', () => {
  assert.equal(getErrorKind({ response: { status: 422 } }), 'validation')
  assert.equal(getErrorKind({ response: { status: 401 } }), 'unauthorized')
  assert.equal(getErrorKind({ response: { status: 403 } }), 'forbidden')
  assert.equal(getErrorKind({ response: { status: 404 } }), 'notFound')
  assert.equal(getErrorKind({ response: { status: 503 } }), 'server')
  assert.equal(getErrorKind({ code: 'ERR_NETWORK' }), 'network')
  assert.equal(getErrorKind({ response: { status: 418 } }), 'unexpected')
})

test('isNetworkFailure detecta fallas de conexión', () => {
  assert.equal(isNetworkFailure({ kind: 'network' }), true)
  assert.equal(isNetworkFailure({ code: 'ERR_NETWORK' }), true)
  assert.equal(isNetworkFailure({ status: 500, kind: 'server' }), false)
})

test('los datos de demostración se pueden buscar, actualizar y eliminar', () => {
  assert.equal(findDemoPet('2').name, 'Milo')
  assert.equal(findDemoPet(99), null)

  const updated = updateDemoPet('1', { name: 'Luna II' })
  assert.equal(updated.name, 'Luna II')
  assert.equal(updated.id, 1)

  assert.deepEqual(deleteDemoPet(3), { deleted: true })
  assert.equal(listDemoPets().length, 2)
})

test('los datos de demostración rechazan IDs inexistentes', () => {
  assert.throws(() => updateDemoPet(99, {}), /actualizarla/)
  assert.throws(() => deleteDemoPet(99), /eliminarla/)
})

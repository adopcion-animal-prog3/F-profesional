import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getErrorKind, isNetworkFailure, normalizePetPayload, pickArray } from '../src/api/normalizers.js'


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


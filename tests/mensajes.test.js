import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  buildMessagePayload,
  formatMessageDate,
  isOwnMessage,
  validateMessage
} from '../src/utils/mensajes.js'

test('validateMessage exige texto y respeta el máximo', () => {
  assert.match(validateMessage('  '), /Escribí un mensaje/)
  assert.match(validateMessage('a'.repeat(2001)), /2000/)
  assert.equal(validateMessage('Hola'), '')
})

test('buildMessagePayload arma el cuerpo esperado por la API', () => {
  assert.deepEqual(buildMessagePayload({ recipientId: '7', petId: '3', content: ' Hola ' }), {
    destinatario_id: 7,
    mascota_id: 3,
    contenido: 'Hola'
  })
  assert.equal(buildMessagePayload({ recipientId: 7, petId: undefined, content: 'x' }).mascota_id, null)
  assert.throws(() => buildMessagePayload({ recipientId: 'abc', content: 'x' }), /destinatario/)
})

test('isOwnMessage compara el remitente con el usuario de la sesión', () => {
  assert.equal(isOwnMessage({ remitente_id: 1 }, '1'), true)
  assert.equal(isOwnMessage({ remitente_id: 2 }, 1), false)
})

test('formatMessageDate ignora fechas inválidas', () => {
  assert.notEqual(formatMessageDate('2026-11-18T10:00:00Z'), '')
  assert.equal(formatMessageDate('x'), '')
})

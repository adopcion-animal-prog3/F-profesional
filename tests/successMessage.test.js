import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  clearSuccessMessage,
  runWithSuccessMessage,
  SUCCESS_MESSAGE_DURATION,
  successMessage
} from '../src/utils/successMessage.js'

const originalSetTimeout = globalThis.setTimeout
const originalClearTimeout = globalThis.clearTimeout

afterEach(() => {
  clearSuccessMessage()
  globalThis.setTimeout = originalSetTimeout
  globalThis.clearTimeout = originalClearTimeout
})

test('shows one success message after a successful operation', async () => {
  const result = await runWithSuccessMessage(
    async () => 'saved',
    'Mascota creada correctamente.'
  )

  assert.equal(result, 'saved')
  assert.equal(successMessage.value, 'Mascota creada correctamente.')
})

test('does not show success when the operation fails', async () => {
  await assert.rejects(
    runWithSuccessMessage(async () => {
      throw new Error('API error')
    }, 'Mascota creada correctamente.'),
    /API error/
  )

  assert.equal(successMessage.value, '')
})

test('replaces an existing message and dismisses it after the timeout', async () => {
  let nextTimerId = 0
  const timers = new Map()

  globalThis.setTimeout = (callback, duration) => {
    assert.equal(duration, SUCCESS_MESSAGE_DURATION)
    const timerId = ++nextTimerId
    timers.set(timerId, callback)
    return timerId
  }
  globalThis.clearTimeout = (timerId) => timers.delete(timerId)

  await runWithSuccessMessage(async () => undefined, 'Primer mensaje.')
  await runWithSuccessMessage(async () => undefined, 'Segundo mensaje.')

  assert.equal(successMessage.value, 'Segundo mensaje.')
  assert.equal(timers.size, 1)

  timers.values().next().value()
  assert.equal(successMessage.value, '')
  assert.equal(timers.size, 0)
})

test('allows the user to close a success message immediately', async () => {
  await runWithSuccessMessage(async () => undefined, 'Registro guardado.')

  clearSuccessMessage()

  assert.equal(successMessage.value, '')
})

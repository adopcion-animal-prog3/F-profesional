import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fitWithin, MAX_IMAGE_BYTES, prepareImage, validateImageFile } from '../src/utils/imageFile.js'

const file = (type, size = 1000) => ({ type, size })

test('acepta solo imágenes JPG, PNG, WEBP o GIF dentro del tamaño máximo', () => {
  assert.equal(validateImageFile(file('image/jpeg')), '')
  assert.equal(validateImageFile(file('image/webp')), '')
  assert.match(validateImageFile(file('application/pdf')), /JPG, PNG, WEBP o GIF/)
  assert.match(validateImageFile(file('image/png', MAX_IMAGE_BYTES + 1)), /10 MB/)
  assert.match(validateImageFile(null), /Seleccioná/)
})

test('fitWithin reduce manteniendo la proporción y nunca agranda', () => {
  assert.deepEqual(fitWithin(4000, 3000), { width: 1024, height: 768 })
  assert.deepEqual(fitWithin(600, 1200), { width: 512, height: 1024 })
  assert.deepEqual(fitWithin(300, 200), { width: 300, height: 200 })
})

test('prepareImage rechaza archivos inválidos antes de leerlos', async () => {
  await assert.rejects(prepareImage(file('text/html')), /JPG, PNG, WEBP o GIF/)
})

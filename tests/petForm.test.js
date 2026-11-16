import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  buildPetPayload,
  createEmptyPetForm,
  mapPetToForm,
  parseAge,
  validatePetForm
} from '../src/utils/petForm.js'

const validForm = {
  name: 'Luna',
  species: 'Perro',
  breed: 'Mestizo',
  age: '2',
  gender: 'Hembra',
  status: 'Disponible',
  location: 'Córdoba',
  description: 'Muy sociable con otros perros.'
}

test('un formulario completo no tiene errores', () => {
  assert.deepEqual(validatePetForm(validForm), {})
})

test('el formulario vacío marca todos los campos obligatorios', () => {
  const errors = validatePetForm({ ...createEmptyPetForm(), status: '' })

  assert.deepEqual(Object.keys(errors).sort(), [
    'age', 'breed', 'description', 'gender', 'location', 'name', 'species', 'status'
  ])
  assert.equal(errors.name, 'El nombre es obligatorio.')
})

test('valida longitudes mínimas y edad positiva', () => {
  const errors = validatePetForm({ ...validForm, name: 'L', age: '0', description: 'corta' })

  assert.equal(errors.name, 'El nombre debe tener al menos 2 caracteres.')
  assert.equal(errors.age, 'La edad debe ser mayor que 0.')
  assert.equal(errors.description, 'La descripción debe tener al menos 10 caracteres.')
})

test('parseAge extrae el número de textos como "2 años"', () => {
  assert.equal(parseAge('2 años'), '2')
  assert.equal(parseAge(3), '3')
  assert.equal(parseAge(null), '')
})

test('mapPetToForm completa valores faltantes', () => {
  const form = mapPetToForm({ name: 'Milo', age: '1 año' })

  assert.equal(form.name, 'Milo')
  assert.equal(form.age, '1')
  assert.equal(form.status, 'Disponible')
  assert.equal(form.location, '')
})

test('buildPetPayload limpia espacios y convierte la edad', () => {
  const payload = buildPetPayload({ ...validForm, name: '  Luna ', age: '2', status: ' ' })

  assert.equal(payload.name, 'Luna')
  assert.equal(payload.age, 2)
  assert.equal(payload.status, 'Disponible')
})

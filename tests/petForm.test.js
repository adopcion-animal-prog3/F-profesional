import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  buildPetPayload,
  createEmptyPetForm,
  mapPetToForm,
  parseAge,
  validatePetForm
} from '../src/utils/petForm.js'

const IMAGEN = 'data:image/jpeg;base64,/9j/4AAQ'

const validForm = {
  nombre: 'Luna',
  especie: 'Perro',
  raza: 'Mestizo',
  edad: '2',
  sexo: 'F',
  descripcion: 'Muy sociable con otros perros.',
  adoptada: false,
  imagen: IMAGEN
}

test('un formulario completo no tiene errores', () => {
  assert.deepEqual(validatePetForm(validForm), {})
})

test('solo nombre y especie son obligatorios, como en el contrato de la API', () => {
  const errors = validatePetForm(createEmptyPetForm())

  assert.deepEqual(Object.keys(errors).sort(), ['especie', 'nombre'])
  assert.equal(errors.nombre, 'El nombre es obligatorio.')
  assert.deepEqual(validatePetForm({ ...createEmptyPetForm(), nombre: 'Toby', especie: 'Gato' }), {})
})

test('valida longitudes máximas y edad entera no negativa', () => {
  const errors = validatePetForm({ ...validForm, nombre: 'L'.repeat(151), raza: 'r'.repeat(121), edad: '-1' })

  assert.match(errors.nombre, /150/)
  assert.match(errors.raza, /120/)
  assert.match(errors.edad, /mayor o igual a 0/)
  assert.equal(validatePetForm({ ...validForm, edad: '0' }).edad, undefined)
  assert.match(validatePetForm({ ...validForm, edad: '1.5' }).edad, /entero/)
})

test('parseAge extrae el número de textos como "2 años"', () => {
  assert.equal(parseAge('2 años'), '2')
  assert.equal(parseAge(3), '3')
  assert.equal(parseAge(null), '')
})

test('mapPetToForm convierte la respuesta de la API en el formulario', () => {
  const form = mapPetToForm({ nombre: 'Milo', especie: 'Gato', edad: 1, sexo: 'M', adoptada: true, imagen: IMAGEN })

  assert.equal(form.nombre, 'Milo')
  assert.equal(form.edad, '1')
  assert.equal(form.sexo, 'M')
  assert.equal(form.adoptada, true)
  assert.equal(form.imagen, IMAGEN)
  assert.equal(mapPetToForm({ name: 'Demo', sexo: 'Macho' }).sexo, '')
})

test('buildPetPayload envía los campos del contrato con nulos para lo opcional', () => {
  const payload = buildPetPayload({ ...createEmptyPetForm(), nombre: '  Luna ', especie: ' Perro ' })

  assert.deepEqual(payload, {
    nombre: 'Luna',
    especie: 'Perro',
    raza: null,
    edad: null,
    sexo: null,
    descripcion: null,
    adoptada: false,
    imagen: null
  })
  assert.equal(buildPetPayload(validForm).edad, 2)
  assert.equal(buildPetPayload(validForm).imagen, IMAGEN)
  assert.equal('status' in payload || 'location' in payload, false)
})

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getPetInitials, getPetTone, getStatusClass, normalizePet } from '../src/utils/petDisplay.js'

test('normalizePet acepta campos en español y en inglés', () => {
  const pet = normalizePet({ id: 4, nombre: 'Tom', especie: 'Gato', edad: 3 }, 99)

  assert.equal(pet.id, 4)
  assert.equal(pet.name, 'Tom')
  assert.equal(pet.species, 'Gato')
  assert.equal(pet.age, 3)
  assert.equal(pet.breed, 'Sin raza')
})

test('normalizePet usa el ID de respaldo cuando no viene en los datos', () => {
  assert.equal(normalizePet({ name: 'Sin id' }, 12).id, 12)
})

test('getPetInitials toma hasta dos iniciales en mayúscula', () => {
  assert.equal(getPetInitials('luna blanca grande'), 'LB')
  assert.equal(getPetInitials(), '')
})

test('getPetTone elige el color según la especie', () => {
  assert.equal(getPetTone({ species: 'Perro' }), 'tone-dog')
  assert.equal(getPetTone({ species: 'gato siamés' }), 'tone-cat')
  assert.equal(getPetTone({ species: 'Tortuga' }), 'tone-default')
  assert.equal(getPetTone(null), 'tone-default')
})

test('getStatusClass convierte el estado en una clase CSS', () => {
  assert.equal(getStatusClass(' En tratamiento '), 'en-tratamiento')
  assert.equal(getStatusClass(), '')
})

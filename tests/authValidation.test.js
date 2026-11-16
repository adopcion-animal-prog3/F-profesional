import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isValidEmail, validateLoginForm, validateRegisterForm } from '../src/utils/authValidation.js'

const validRegister = {
  name: 'Ana',
  email: 'ana@test.com',
  password: 'secreto1',
  confirmPassword: 'secreto1'
}

test('isValidEmail reconoce correos válidos', () => {
  assert.equal(isValidEmail(' ana@test.com '), true)
  assert.equal(isValidEmail('ana@test'), false)
  assert.equal(isValidEmail(undefined), false)
})

test('login exige ambos campos y un correo válido', () => {
  assert.equal(validateLoginForm({ email: '', password: 'x' }), 'Debes completar todos los campos.')
  assert.equal(validateLoginForm({ email: 'ana', password: 'x' }), 'Introduce un correo electrónico válido.')
  assert.equal(validateLoginForm({ email: 'ana@test.com', password: 'x' }), '')
})

test('registro valida los campos en orden', () => {
  assert.equal(validateRegisterForm({ ...validRegister, name: ' ' }), 'El nombre es obligatorio.')
  assert.equal(validateRegisterForm({ ...validRegister, email: '' }), 'El email es obligatorio.')
  assert.equal(validateRegisterForm({ ...validRegister, email: 'ana' }), 'Introduce un email válido.')
  assert.equal(validateRegisterForm({ ...validRegister, password: '' }), 'La contraseña es obligatoria.')
  assert.equal(
    validateRegisterForm({ ...validRegister, confirmPassword: '' }),
    'Debes confirmar la contraseña.'
  )
  assert.equal(
    validateRegisterForm({ ...validRegister, confirmPassword: 'otra' }),
    'Las contraseñas no coinciden.'
  )
})

test('registro completo no devuelve errores', () => {
  assert.equal(validateRegisterForm(validRegister), '')
})

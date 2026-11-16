export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (value) => EMAIL_PATTERN.test(String(value ?? '').trim())

const firstError = (checks) => checks.find(([failed]) => failed)?.[1] || ''

export const validateLoginForm = ({ email = '', password = '' }) =>
  firstError([
    [!email.trim() || !password.trim(), 'Debes completar todos los campos.'],
    [!isValidEmail(email), 'Introduce un correo electrónico válido.']
  ])

export const validateRegisterForm = ({ name = '', email = '', password = '', confirmPassword = '' }) =>
  firstError([
    [!name.trim(), 'El nombre es obligatorio.'],
    [!email.trim(), 'El email es obligatorio.'],
    [!isValidEmail(email), 'Introduce un email válido.'],
    [!password, 'La contraseña es obligatoria.'],
    [!confirmPassword, 'Debes confirmar la contraseña.'],
    [password !== confirmPassword, 'Las contraseñas no coinciden.']
  ])

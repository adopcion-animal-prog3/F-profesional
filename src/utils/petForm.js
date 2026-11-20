// Formulario de mascota alineado con el contrato de la API (campos en español).
export const createEmptyPetForm = () => ({
  nombre: '',
  especie: '',
  raza: '',
  edad: '',
  sexo: '',
  descripcion: '',
  adoptada: false,
  imagen: null
})

export const PET_SEXO_OPTIONS = [
  { value: '', label: 'No informado' },
  { value: 'M', label: 'Macho' },
  { value: 'F', label: 'Hembra' },
  { value: 'OTRO', label: 'Otro' }
]

const MAX_LENGTHS = { nombre: 150, especie: 100, raza: 120 }

const textError = (value, field, label, required) => {
  const text = String(value ?? '').trim()
  if (!text) return required ? `${label} es obligatorio.` : ''
  return text.length > MAX_LENGTHS[field] ? `${label} no puede superar ${MAX_LENGTHS[field]} caracteres.` : ''
}

const validateEdad = (edad) => {
  if (edad === '' || edad === null || edad === undefined) return ''
  const value = Number(edad)
  return Number.isInteger(value) && value >= 0 ? '' : 'La edad debe ser un número entero mayor o igual a 0.'
}

export const validatePetForm = (form) => {
  const errors = {
    nombre: textError(form.nombre, 'nombre', 'El nombre', true),
    especie: textError(form.especie, 'especie', 'La especie', true),
    raza: textError(form.raza, 'raza', 'La raza', false),
    edad: validateEdad(form.edad)
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}

export const parseAge = (value) => {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'number') return String(value)
  return String(value).replace(/[^\d]/g, '')
}

const SEXO_VALUES = ['M', 'F', 'OTRO']

export const mapPetToForm = (pet) => ({
  nombre: pet.nombre ?? pet.name ?? '',
  especie: pet.especie ?? pet.species ?? '',
  raza: pet.raza ?? pet.breed ?? '',
  edad: parseAge(pet.edad ?? pet.age),
  sexo: SEXO_VALUES.includes(pet.sexo) ? pet.sexo : '',
  descripcion: pet.descripcion ?? pet.description ?? '',
  adoptada: Boolean(pet.adoptada),
  imagen: pet.imagen ?? null
})

const optionalText = (value) => String(value ?? '').trim() || null

export const buildPetPayload = (petData) => ({
  nombre: String(petData.nombre ?? '').trim(),
  especie: String(petData.especie ?? '').trim(),
  raza: optionalText(petData.raza),
  edad: petData.edad === '' || petData.edad == null ? null : Number(petData.edad),
  sexo: SEXO_VALUES.includes(petData.sexo) ? petData.sexo : null,
  descripcion: optionalText(petData.descripcion),
  adoptada: Boolean(petData.adoptada),
  imagen: petData.imagen || null
})

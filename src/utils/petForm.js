export const createEmptyPetForm = () => ({
  name: '',
  species: '',
  breed: '',
  age: '',
  gender: '',
  status: 'Disponible',
  location: '',
  description: ''
})

export const PET_GENDER_OPTIONS = [
  { value: '', label: 'Seleccionar' },
  { value: 'Macho', label: 'Macho' },
  { value: 'Hembra', label: 'Hembra' },
  { value: 'No informado', label: 'No informado' }
]

export const PET_STATUS_OPTIONS = ['Disponible', 'En tratamiento', 'Adoptado']
  .map((value) => ({ value, label: value }))

const requiredText = (value, message) => (String(value ?? '').trim() ? '' : message)

const minLengthText = (value, min, emptyMessage, shortMessage) => {
  const text = String(value ?? '').trim()
  if (!text) return emptyMessage
  return text.length < min ? shortMessage : ''
}

const validateAge = (age) => {
  if (!age && age !== 0) return 'La edad es obligatoria.'
  return Number(age) <= 0 ? 'La edad debe ser mayor que 0.' : ''
}

export const validatePetForm = (form) => {
  const errors = {
    name: minLengthText(form.name, 2, 'El nombre es obligatorio.', 'El nombre debe tener al menos 2 caracteres.'),
    species: requiredText(form.species, 'La especie es obligatoria.'),
    breed: requiredText(form.breed, 'La raza es obligatoria.'),
    age: validateAge(form.age),
    gender: form.gender ? '' : 'Debe seleccionar el sexo.',
    status: form.status ? '' : 'Debe seleccionar el estado.',
    location: requiredText(form.location, 'La ubicación es obligatoria.'),
    description: minLengthText(
      form.description,
      10,
      'La descripción es obligatoria.',
      'La descripción debe tener al menos 10 caracteres.'
    )
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}

export const parseAge = (value) => {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'number') return String(value)
  return String(value).replace(/[^\d.]/g, '')
}

export const mapPetToForm = (pet) => ({
  name: pet.name ?? '',
  species: pet.species ?? '',
  breed: pet.breed ?? '',
  age: parseAge(pet.age),
  gender: pet.gender ?? '',
  status: pet.status ?? 'Disponible',
  location: pet.location ?? '',
  description: pet.description ?? ''
})

export const buildPetPayload = (petData) => ({
  name: petData.name?.trim(),
  species: petData.species?.trim(),
  breed: petData.breed?.trim(),
  age: Number(petData.age),
  gender: petData.gender?.trim(),
  status: petData.status?.trim() || 'Disponible',
  location: petData.location?.trim(),
  description: petData.description?.trim()
})

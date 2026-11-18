const DEFAULT_DESCRIPTION = 'Mascota en adopción con seguimiento veterinario.'
const SEXO_LABELS = { M: 'Macho', F: 'Hembra', OTRO: 'Otro' }

const adoptionStatus = (item) => {
  if (item.status ?? item.estado) return item.status ?? item.estado
  return item.adoptada ? 'Adoptado' : 'Disponible'
}

const genderLabel = (item) => {
  const value = item.gender ?? item.sexo
  return SEXO_LABELS[value] ?? value ?? 'No informado'
}

export const normalizePet = (item, fallbackId) => ({
  id: item.id ?? item._id ?? fallbackId,
  name: item.name ?? item.nombre ?? 'Mascota sin nombre',
  species: item.species ?? item.especie ?? item.type ?? 'No especificada',
  breed: item.breed ?? item.raza ?? 'Sin raza',
  age: item.age ?? item.edad ?? 'Edad no informada',
  gender: genderLabel(item),
  status: adoptionStatus(item),
  adoptada: Boolean(item.adoptada) || adoptionStatus(item) === 'Adoptado',
  description: item.description ?? item.descripcion ?? DEFAULT_DESCRIPTION,
  imagen: item.imagen ?? null,
  creadoPor: item.creado_por ?? null
})

// Una cuenta profesional gestiona sus publicaciones (o las que no tienen publicador).
export const canManagePet = (pet, user) =>
  Boolean(user) && (pet?.creadoPor == null || String(pet.creadoPor) === String(user.id))

export const getPetInitials = (name = '') =>
  String(name)
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

const SPECIES_TONES = [
  ['perro', 'tone-dog'],
  ['gato', 'tone-cat'],
  ['conejo', 'tone-rabbit']
]

export const getPetTone = (pet) => {
  const species = String(pet?.species || '').toLowerCase()
  const match = SPECIES_TONES.find(([keyword]) => species.includes(keyword))
  return match ? match[1] : 'tone-default'
}

export const getStatusClass = (status = '') =>
  String(status)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

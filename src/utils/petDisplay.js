const DEFAULT_DESCRIPTION = 'Mascota en adopción con seguimiento veterinario.'

export const normalizePet = (item, fallbackId) => ({
  id: item.id ?? item._id ?? fallbackId,
  name: item.name ?? item.nombre ?? 'Mascota sin nombre',
  species: item.species ?? item.especie ?? item.type ?? 'No especificada',
  breed: item.breed ?? item.raza ?? 'Sin raza',
  age: item.age ?? item.edad ?? 'Edad no informada',
  gender: item.gender ?? item.sexo ?? 'No informado',
  status: item.status ?? item.estado ?? 'Disponible',
  location: item.location ?? item.ubicacion ?? item.city ?? item.ciudad ?? 'Sin ubicación',
  description: item.description ?? item.descripcion ?? DEFAULT_DESCRIPTION
})

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

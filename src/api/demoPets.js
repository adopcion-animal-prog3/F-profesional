// Datos de demostración que se muestran solo cuando la API no responde por un problema de red.
const initialDemoPets = [
  {
    id: 1,
    name: 'Luna',
    species: 'Perro',
    breed: 'Mestizo',
    age: '2 años',
    gender: 'Hembra',
    status: 'Disponible',
    location: 'Córdoba',
    description: 'Muy sociable, ideal para vivir con familias activas.'
  },
  {
    id: 2,
    name: 'Milo',
    species: 'Gato',
    breed: 'Siamés',
    age: '1 año',
    gender: 'Macho',
    status: 'En tratamiento',
    location: 'Mendoza',
    description: 'Cariñoso y tranquilo, aprende rápido a convivir con otros animales.'
  },
  {
    id: 3,
    name: 'Nube',
    species: 'Conejo',
    breed: 'Mini Lop',
    age: '10 meses',
    gender: 'Hembra',
    status: 'Disponible',
    location: 'Buenos Aires',
    description: 'Dócil y fácil de manejar, perfecto para hogares tranquilos.'
  }
]

const demoPets = initialDemoPets.map((pet) => ({ ...pet }))

const findDemoIndex = (petId) => demoPets.findIndex((item) => String(item.id) === String(petId))

export const listDemoPets = () => demoPets

export const findDemoPet = (petId) => demoPets[findDemoIndex(petId)] || null

export const updateDemoPet = (petId, changes) => {
  const index = findDemoIndex(petId)
  if (index === -1) throw new Error('La mascota no existe para actualizarla.')

  demoPets[index] = { ...demoPets[index], ...changes, id: Number(petId) }
  return demoPets[index]
}

export const deleteDemoPet = (petId) => {
  const index = findDemoIndex(petId)
  if (index === -1) throw new Error('La mascota no existe para eliminarla.')

  demoPets.splice(index, 1)
  return { deleted: true }
}

export const resetDemoPets = () => {
  demoPets.splice(0, demoPets.length, ...initialDemoPets.map((pet) => ({ ...pet })))
}

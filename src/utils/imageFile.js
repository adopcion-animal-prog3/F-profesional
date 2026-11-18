// Preparación de la imagen de una mascota antes de enviarla a la API.
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
// El backend acepta data URLs de hasta 3 MB de texto.
export const MAX_DATA_URL_LENGTH = 3 * 1024 * 1024
const MAX_SIDE = 1024
const JPEG_QUALITY = 0.85

export const validateImageFile = (file) => {
  if (!file) return 'Seleccioná una imagen.'
  if (!IMAGE_TYPES.includes(file.type)) return 'La imagen debe ser JPG, PNG, WEBP o GIF.'
  if (file.size > MAX_IMAGE_BYTES) return 'La imagen no puede superar los 10 MB.'
  return ''
}

// Calcula el tamaño final manteniendo la proporción y sin agrandar la imagen.
export const fitWithin = (width, height, maxSide = MAX_SIDE) => {
  const scale = Math.min(1, maxSide / Math.max(width, height))
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

const readAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'))
  reader.readAsDataURL(file)
})

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = () => reject(new Error('El archivo seleccionado no es una imagen válida.'))
  image.src = src
})

// Reduce la imagen a 1024 px como máximo y la convierte a JPEG para que pese poco.
const compress = async (dataUrl) => {
  const image = await loadImage(dataUrl)
  const { width, height } = fitWithin(image.naturalWidth, image.naturalHeight)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return dataUrl
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}

export const prepareImage = async (file) => {
  const error = validateImageFile(file)
  if (error) throw new Error(error)

  const original = await readAsDataUrl(file)
  const result = file.type === 'image/gif' ? original : await compress(original)
  if (result.length > MAX_DATA_URL_LENGTH) {
    throw new Error('La imagen sigue siendo demasiado grande. Probá con una de menor tamaño.')
  }
  return result
}

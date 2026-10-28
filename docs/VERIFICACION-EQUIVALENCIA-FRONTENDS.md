# Verificación de equivalencia funcional: React y Vue

## Alcance y fuentes disponibles

Esta verificación corresponde al Issue #32 del proyecto; en GitHub, el issue que describe este trabajo es el #34, «Issue #32 — Verificar equivalencia funcional con React». No se modificó el repositorio React ni el contrato de la API.

No fue posible realizar una comparación directa: el repositorio público [F-personal](https://github.com/adopcion-animal-prog3/F-personal), en `main`, no contiene el código fuente de la aplicación React. Su README indica que no hay código en esa rama y la inspección de la rama y el PR disponibles tampoco encontró una aplicación React. Tampoco se encontró en este entorno un documento de contrato común de API ni el backend correspondiente. Por eso, las observaciones de API de esta verificación describen únicamente lo que consume Vue; no prueban que sea el contrato acordado.

No se encontraron en el repositorio local `.github/copilot-instructions.md` ni `PROYECTO.md`. Se revisaron las rutas, vistas, formularios, cliente HTTP y componentes funcionales disponibles en Vue.

## Matriz de verificación

Los estados de la columna «Resultado» describen la posibilidad de comprobar equivalencia entre ambos frontends, no la existencia de la función en Vue.

| Funcionalidad | Implementación en React | Implementación en Vue | Contrato de API | Resultado | Diferencias encontradas |
|---|---|---|---|---|---|
| Registro | PENDIENTE: no hay fuente React disponible en `F-personal/main`. | Formulario en `RegisterView.vue`; envía nombre, email y contraseña. | Vue: `POST /api/auth/register`. Esquema común no disponible. | PENDIENTE | No se puede comparar la interfaz, validación, payload ni respuesta entre frameworks. |
| Inicio de sesión | PENDIENTE: no hay fuente React disponible. | `LoginView.vue` envía email y contraseña; guarda la sesión recibida. | Vue: `POST /api/auth/login`. Esquema común no disponible. | PENDIENTE | No se puede comparar el flujo ni la respuesta del backend. |
| Persistencia de sesión y cierre de sesión | PENDIENTE: no hay fuente React disponible. | `session.js` persiste `auth_token` y `auth_user` en `localStorage`; no se encontró una acción de cierre de sesión conectada a la interfaz. | No hay contrato común disponible; el token se adjunta en solicitudes HTTP de Vue. | PENDIENTE | El cierre de sesión no se puede comparar; en Vue existe una utilidad para limpiar la sesión, pero no se encontró un flujo visible que la use. |
| Protección de rutas y roles | PENDIENTE: no hay fuente React disponible. | `router/index.js` redirige rutas protegidas si no hay token. Las vistas consultan el rol `ADMIN` para acciones administrativas. | El guard de Vue comprueba sesión local; no se pudo verificar autorización en el servidor. | PENDIENTE | No se puede comparar la matriz de permisos ni el comportamiento React. |
| Listado y detalle de mascotas | PENDIENTE: no hay fuente React disponible. | `PetsView.vue` y `PetDetailView.vue` muestran listado, detalle e historial asociado. | Vue: `GET /api/mascotas` y `GET /api/mascotas/:id`. | PENDIENTE | No se pueden comparar filtros, campos, navegación ni respuestas con React o una especificación canónica. |
| Creación de mascota | PENDIENTE: no hay fuente React disponible. | `PetCreateView.vue` envía el formulario de mascota. | Vue: `POST /api/mascotas`; los campos observados incluyen nombre, especie, raza, edad, sexo, estado, ubicación y descripción. | PENDIENTE | No se puede confirmar que React envíe los mismos campos ni que el backend espere este esquema. |
| Edición de mascota | PENDIENTE: no hay fuente React disponible. | `PetEditView.vue` carga y actualiza una mascota. | Vue: `PUT /api/mascotas/:id`. | PENDIENTE | Sin fuente React ni contrato canónico no se puede confirmar equivalencia de campos o validaciones. |
| Eliminación de mascota | PENDIENTE: no hay fuente React disponible. | La ficha de mascota ofrece eliminación con confirmación previa. | Vue: `DELETE /api/mascotas/:id`. | PENDIENTE | No se puede comparar la confirmación ni el resultado de la operación. |
| Listado de solicitudes | PENDIENTE: no hay fuente React disponible. | `SolicitudesView.vue` lista las solicitudes y contempla acciones administrativas. | Vue: `GET /api/solicitudes`. | PENDIENTE | No se pueden comparar los datos presentados ni los permisos. |
| Creación de solicitud de adopción | PENDIENTE: no hay fuente React disponible. | `AdoptionRequestView.vue` permite enviar la solicitud desde la mascota. | Vue: `POST /api/solicitudes`; el esquema común no está documentado. | PENDIENTE | No se puede comparar formulario, payload, respuesta ni validaciones. |
| Visualización y cambio de estado de solicitud | PENDIENTE: no hay fuente React disponible. | Vue presenta el estado y permite a `ADMIN` solicitar su actualización. | Vue: `PUT /api/solicitudes/:id` con `{ estado }`. | PENDIENTE | No se puede verificar la equivalencia del flujo ni confirmar el contrato del backend. |
| Consulta del historial clínico | PENDIENTE: no hay fuente React disponible. | `PetClinicalHistory.vue` consulta y muestra registros en la ficha. | Vue: `GET /api/mascotas/:id/historial`. | PENDIENTE | No se pueden comparar presentación, campos o permisos. |
| Creación de registro clínico | PENDIENTE: no hay fuente React disponible. | `ClinicalRecordForm.vue` permite enviar un registro clínico. | Vue: `POST /api/mascotas/:id/historial`; se observaron descripción y veterinario. | PENDIENTE | No se puede confirmar equivalencia de payload ni comportamiento. |
| Edición de registro clínico | PENDIENTE: no hay fuente React disponible. | `ClinicalRecordItem.vue` permite editar el registro. | Vue: `PUT /api/historial/:id`; se observaron fecha, descripción y veterinario. | PENDIENTE | No se puede confirmar equivalencia de campos ni contrato común. |
| Eliminación de registro clínico | PENDIENTE: no hay fuente React disponible. | `ClinicalRecordItem.vue` permite eliminar con confirmación previa. | Vue: `DELETE /api/historial/:id`. | PENDIENTE | No se puede comparar la confirmación ni el comportamiento React. |
| Carga, errores, éxito, formularios, navegación y responsive | PENDIENTE: no hay fuente React disponible. | Vue tiene estados de carga y error en vistas, validaciones de formulario y confirmaciones globales reutilizables; el dashboard se identifica como placeholder. | El cliente Axios centraliza solicitudes, autorización y normalización de errores. | PENDIENTE | No se puede comparar la experiencia React. El cliente Vue también incluye respuestas demo de contingencia, que deben contrastarse con el comportamiento esperado del backend. |
| Integración, métodos, rutas, autenticación y errores | PENDIENTE: no hay fuente React ni contrato canónico disponible. | Las solicitudes pasan por `src/api/http.js`; se adjunta autorización cuando hay token y se normalizan errores. | Solo se pudieron enumerar las rutas y payloads observados en el código Vue; no se pudo validar contra la especificación ni el backend. | PENDIENTE | No se puede demostrar que React consuma los mismos endpoints, métodos, campos, errores o mecanismo de autenticación. |

## Pruebas ejecutadas

- `npm test`: 4 pruebas aprobadas.
- `npm run build`: compilación de Vue exitosa.
- Pruebas de navegador con respuestas de API **simuladas**: redirección de ruta protegida sin sesión, login y navegación posterior, renderizado de listado/detalle de mascotas, solicitudes e historial; registro; operaciones de creación, edición y eliminación de mascotas; creación y cambio de estado de solicitudes; creación, edición y eliminación de registros clínicos.
- En las solicitudes simuladas de consulta y eliminación clínica se observó el encabezado de autorización.

Estas pruebas verifican la aplicación Vue y sus solicitudes visibles bajo mocks; no prueban un backend real, no verifican que la API simulada sea el contrato acordado y no comparan la aplicación React. No se ejecutaron pruebas de equivalencia visual ni pruebas responsive comparativas.

## Diferencias y verificaciones pendientes

La diferencia decisiva es de disponibilidad de evidencia: falta el código React de `F-personal/main`, el contrato común de API y un backend de referencia accesible. En consecuencia, todas las filas quedan `PENDIENTE`; no hay base para declarar una diferencia React–Vue como confirmada ni para afirmar equivalencia.

Las observaciones de Vue que requieren contraste con React y/o el backend son: el dashboard placeholder, la ausencia de un flujo visible de cierre de sesión, la verificación de roles en la interfaz además de la autorización del servidor, y las respuestas demo de contingencia del cliente HTTP. No se cambiaron porque no hay evidencia suficiente para tratarlas como diferencias dentro de este repositorio.

Para completar la verificación se necesita disponer del código React correspondiente, la especificación canónica de la API y acceso a un entorno backend de prueba. Entonces se podrán repetir los flujos con ambos clientes y comparar rutas, requests, respuestas, errores y permisos.

## Resultado

**EQUIVALENCIA PENDIENTE.** La aplicación Vue fue inspeccionada y probada parcialmente con API simulada, pero no fue posible contrastarla con React ni con un contrato común accesible.

export const getValidationError = (errorCode) => {
    const codeMatcher = {
        500 : "Error de conexión interna",
        400 : "No se pudo realizar la solicitud",
        404 : "No se pudo encontrar la página que estas buscando",
        429 : "Ups, creo que has mandado muchas veces la misma solicitud",
        401 : "No tienes permisos para acceder a esta página",
        422 : "Los datos enviados no son válidos",
        503 : "Lo sentimos, pero el sitio está en mantenimiento",
        504 : "El sitio que estás buscando no está disponible",
        403 : "No tienes permisos para acceder a esta página"
    }
    return codeMatcher[errorCode]
}
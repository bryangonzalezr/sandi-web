export default function formatDate(dateString) {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0'); // Obtener día
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtener mes (los meses son base 0, por lo que sumamos 1)
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
}
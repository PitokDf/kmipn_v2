export function formatTanggal(date: string | Date) {
    const newDate = new Date(date)
    return newDate.toLocaleDateString('id-ID', {
        month: "long",
        day: "2-digit",
        year: "numeric"
    })
}
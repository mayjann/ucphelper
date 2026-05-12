export function parseFullRegDate(str) {
    if (!str) return null;
    const partsFull = str.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (partsFull) {
        return new Date(partsFull[3], partsFull[2]-1, partsFull[1], partsFull[4], partsFull[5], partsFull[6]);
    }
    const parts = str.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    return parts ? new Date(parts[3], parts[2]-1, parts[1]) : null;
}
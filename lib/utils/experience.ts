export function calculateExperienceYears(startDate: string, manualOverride?: number | null) {
    if (manualOverride !== undefined && manualOverride !== null) return manualOverride
    
    const start = new Date(startDate)
    const now = new Date()
    let years = now.getFullYear() - start.getFullYear()
    
    // Adjust for month/day
    const monthDiff = now.getMonth() - start.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < start.getDate())) {
        years--
    }
    
    return Math.max(0, years)
}


// getAge calculates age in years given a birth date. default is october 26, 2000
export function getAge(birthDate: Date = new Date('2000-10-26')): number {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--
    }
    return age
}
// getWorkingYears calculates the number of years worked since a start date. default is August 1, 2021
export function getWorkingYears(
    startDate: Date = new Date('2021-08-01')
): number {
    const today = new Date()
    let years = today.getFullYear() - startDate.getFullYear()
    const monthDiff = today.getMonth() - startDate.getMonth()
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < startDate.getDate())
    ) {
        years--
    }
    return years
}

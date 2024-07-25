const calculateAge = (dateOfBirth: Date | null): number | null => {
  if (dateOfBirth !== null) {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  } else {
    return null
  }
}

export default calculateAge

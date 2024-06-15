export function calculateCustomerAge(birthDate: Date): number {
  const currentDate = new Date();
  let yearsOld = currentDate.getFullYear() - birthDate.getFullYear();

  // Verifica se a pessoa já fez aniversário este ano
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    yearsOld--;
  }

  return yearsOld;
}

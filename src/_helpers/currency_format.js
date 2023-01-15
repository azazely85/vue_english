export const formatToHryvna = value => {
  const balance = Intl.NumberFormat('en-NZ', { minimumFractionDigits: 2 })
    .format(Number(value).toFixed(2))
  return `₴ ${balance}`
}

export const formatToDollar = value => {
  const balance = Intl.NumberFormat('en-NZ', { minimumFractionDigits: 2 })
    .format(Number(value).toFixed(2))
  return `$ ${balance}`
}

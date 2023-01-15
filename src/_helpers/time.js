export function secToTime(sec) {
  const hours = Math.floor(sec / 3600) // get hours
  let minutes = Math.floor((sec - (hours * 3600)) / 60) // get minutes
  // add 0 if value < 10; Example: 2 => 02
  if (minutes < 10) { minutes = `0${minutes}` }
  return `${hours} h ${minutes} m`
}

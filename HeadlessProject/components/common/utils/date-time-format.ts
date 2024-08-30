export const formatDate = (date: string) => {
  const dateVal = new Date(date.replace(/-/g, '/'))
  const getMonth = dateVal.toLocaleString('default', { month: 'long' })
  const getDate = dateVal.getDate()
  const getYear = dateVal.getFullYear()
  return `${getMonth} ${getDate}, ${getYear}`
}
export const dateFormatSlash = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear().toString().substr(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const formattedString = `${month}/${day}/${year}`
  return formattedString
}

export const formatDatetime = (date: string) => {
  const getTime = new Date(date.replace(/-/g, '/')).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const dateVal = new Date(date.replace(/-/g, '/'))
  const getMonth = dateVal.toLocaleString('default', { month: 'short' })
  const getDate = dateVal.getDate()
  const getYear = dateVal.getFullYear()
  return `${getTime}, ${getDate} ${getMonth} ${getYear}`
}

import moment from 'moment'

export const capitalize = (str: string): string => {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export const isDate = (date: string): boolean => {
  return !isNaN(Date.parse(date))
}

export const formatDate = (date: string): string => {
  return moment(date).format('DD/MM/YYYY, h:mm A')
}

export const formatServiceError = (message: any): string => {
  let errors: string = ''
  if (typeof message === 'string') return message

  Object.values(message).forEach((value: any) => {
    const val: string = value.split('.')

    const error = val.length > 1 ? val[1] : val[0]

    errors = errors.concat(`${error}. `)
  })

  return errors
}

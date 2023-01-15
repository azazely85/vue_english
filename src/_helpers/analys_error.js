import useJwt from '@/auth/jwt/useJwt'

export const analysError = error => {
  const errors = []
  if (typeof error == "undefined") {
    return errors
  }
  switch (error.status) {
    case 403: {
      errors.push(error.data.message)
      return errors
    }
    case 400: {
      errors.push(error.data.message)
      return errors
    }
    case 422: {
      Object.keys(error.data.errors).map((key, index) => {
        errors.push(error.data.errors[key][0])
      })
      return errors
    }
    case 401: {
      useJwt.logoutWithNoSend()
      break
    }
    default: {
      errors.push('Something went wrong')
      return errors
    }
  }
}

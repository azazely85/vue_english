import useJwt from '@core/auth/jwt/useJwt'
import axios from '@axios'

const { jwt } = useJwt(axios, {})

// Export the jwt service instance
export default jwt

// Also export the useJwt function for components that need it
export { useJwt }

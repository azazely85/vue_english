import ToastificationContent from '@core/components/toastification/ToastificationContent'
import jwtDefaultConfig from './jwtDefaultConfig'
import useJwt from '@/auth/jwt/useJwt'

export default class JwtService {
  // Will be used by this service for making API calls
  axiosIns = null

  // jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // For Refreshing Token
  subscribers = []

  constructor(axiosIns, jwtOverrideConfig) {
    this.axiosIns = axiosIns
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      config => {
        // Get token from localStorage
        const accessToken = this.getToken()

        // If token is present add it to request's Authorization Header
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error),
    )

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      response => response,
      error => {
        // const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config

        // if (status === 500)
        if (response && response.status === 500) {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: response.data.data ? response.data.data : 'Something went wrong!',
              icon: 'XIcon',
              variant: 'danger',
            },
          })
        }

        // if (status === 401) {
        if (response && response.status === 401) {
          this.logoutWithNoSend()
        }
        return Promise.reject(error)
      },
    )
  }

  logoutWithNoSend() {
    this.removeUserData()
    this.removeToken()
    window.location.href = '/'
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  removeUserData() {
    localStorage.removeItem(this.jwtConfig.storageUserData)
  }

  removeToken() {
    localStorage.removeItem(this.jwtConfig.storageTokenKeyName)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  resetPassLink(...args) {
    return this.axiosIns.post(`${process.env.VUE_APP_API_URL}/auth/forget-password`, ...args)
  }

  resetPassword(...args) {
    return this.axiosIns.post(`${process.env.VUE_APP_API_URL}/auth/reset-password`, ...args)
  }

  login(...args) {
    return this.axiosIns.post(`${process.env.VUE_APP_API_URL}/auth/login`, ...args)
  }

  getUserData() {
    return localStorage.getItem(this.jwtConfig.storageUserData)
  }

  register(...args) {
    return this.axiosIns.post(this.jwtConfig.registerEndpoint, ...args)
  }

  logout() {
    return this.axiosIns.post(`${process.env.VUE_APP_API_URL}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${useJwt.getToken()}`,
      },
    })
  }

  changeFirstLoginStatus(status) {
    return this.axiosIns.post(`${process.env.VUE_APP_API_URL}/auth/change-flogin-status`, status)
  }

  refreshToken() {
    return this.axiosIns.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    })
  }
}

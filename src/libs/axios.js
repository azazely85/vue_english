import Vue from 'vue'
import useJwt from '@core/auth/jwt/useJwt'
import jwtDefaultConfig from '../@core/auth/jwt/jwtDefaultConfig'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: `${process.env.VUE_APP_API_URL}`,
  // timeout: 1000,
  headers: { Authorization: `${jwtDefaultConfig.tokenType} ${useJwt.getToken}`, Accept: 'application/json' },
})

Vue.prototype.$http = axiosIns

export default axiosIns

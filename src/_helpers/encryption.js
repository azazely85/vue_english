const CryptoJS = require('crypto-js')
import useJwt from "@/auth/jwt/useJwt";

const secretKey = 'English Vidshup_secret_key'

export const encryptUserData = userData => CryptoJS.AES.encrypt(JSON.stringify(userData), secretKey)

export const decryptUserData = encrypted => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
  } catch (e) {
    useJwt.logoutWithNoSend()
  }
}

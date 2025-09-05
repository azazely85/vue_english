import { defineRule, configure } from 'vee-validate'
import {
  required as rule_required,
  email as rule_email,
  min as rule_min,
  confirmed as rule_confirmed,
  regex as rule_regex,
  between as rule_between,
  alpha as rule_alpha,
  integer as rule_integer,
  digits as rule_digits,
  alpha_dash as rule_alpha_dash,
  alpha_num as rule_alpha_num,
  length as rule_length,
} from '@vee-validate/rules'
import ar from '@vee-validate/i18n/dist/locale/ar.json'
import en from '@vee-validate/i18n/dist/locale/en.json'

// eslint-disable-next-line object-curly-newline
import { validatorPositive, validatorUrlValidator, validatorPassword, validatorCreditCard } from './validators'

// ////////////////////////////////////////////////////////
// General
// ////////////////////////////////////////////////////////

defineRule('required', rule_required)
defineRule('email', rule_email)
defineRule('min', rule_min)
defineRule('confirmed', rule_confirmed)
defineRule('regex', rule_regex)
defineRule('between', rule_between)
defineRule('alpha', rule_alpha)
defineRule('integer', rule_integer)
defineRule('digits', rule_digits)
defineRule('alpha-dash', rule_alpha_dash)
defineRule('alpha-num', rule_alpha_num)
defineRule('length', rule_length)

defineRule('positive', validatorPositive)

defineRule('credit-card', validatorCreditCard)

defineRule('password', validatorPassword)

defineRule('url', validatorUrlValidator)

// Export the rule names for backward compatibility
export const required = 'required'
export const email = 'email'
export const min = 'min'
export const confirmed = 'confirmed'
export const regex = 'regex'
export const between = 'between'
export const alpha = 'alpha'
export const integer = 'integer'
export const digits = 'digits'
export const alphaDash = 'alpha-dash'
export const alphaNum = 'alpha-num'
export const length = 'length'
export const positive = 'positive'
export const credit = 'credit-card'
export const password = 'password'
export const url = 'url'

// Install English and Arabic localizations.
configure({
  generateMessage: (ctx) => {
    const messages = {
      en: en.messages,
      ar: ar.messages,
    }
    const locale = 'en' // You can make this dynamic based on your app's locale
    const message = messages[locale]?.[ctx.rule.name]
    return message || `${ctx.field} is not valid`
  },
  validateOnInput: true,
})
// ////////////////////////////////////////////////////////
// NOTE:
// Quasar validation for reference only
// Remove this note once development is finished and make sure to
// to convert all of them in veevalidate version
// ////////////////////////////////////////////////////////

// export const required = (val) => {
//   return (val && val.length > 0) || '*Field is required'
// }

// export const required_obj = (obj) => {
//   if (obj === null || obj === undefined) return '*Field is required'
//   return (Object.entries(obj).length > 0 && obj.constructor === Object) || '*Field is required'
// }

// export const no_blank_spaces_arr = (arr) => {
//   return arr.every(val => (val.trim() && val.trim().length > 0)) || 'Blank Spaces are not allowed'
// }

// export const url = val => {
//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   // Used
//   // https://stackoverflow.com/questions/4314741/url-regex-validation

//   // Other
//   // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
//   // https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php
//   // https://www.geeksforgeeks.org/how-to-validate-url-using-regular-expression-in-javascript/

//   /* eslint-disable no-useless-escape */
//   const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
//   /* eslint-enable no-useless-escape */
//   return re.test(val) || 'URL is invalid'
// }

// export const date = val => {

//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   // https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/patterns.js
//   return /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(val) || 'Date is invalid'
// }

// export const max = (val, max) => {

//   // If blank return
//   if (val === undefined || val === null) return true

//   return val.length <= max || `More than ${max} characters are not allowed`
// }

// export const max_arr = (val, max) => {
//   return val.length <= max || `More than ${max} values are not allowed`
// }

// export const min = (val, min) => {

//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   return val.length >= min || `Minimum ${min} characters are required`
// }

// export const num_range = (val, min, max) => {

//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   const msg = 'Value is invalid'
//   if (min === null) return val <= max || msg
//   else if (max === null) return val >= min || msg
//   else return (val >= min && val <= max) || msg
// }

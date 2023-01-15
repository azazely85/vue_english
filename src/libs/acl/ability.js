import { Ability } from '@casl/ability'
import { initialAbility } from './config'
import { decryptUserData } from '@/_helpers/encryption'
import useJwt from '@/auth/jwt/useJwt'

//  Read ability from localStorage
// * Handles auto fetching previous abilities if already logged in user
// ? You can update this if you store user abilities to more secure place
// ! Anyone can update localStorage so be careful and please update this
const userData = useJwt.getUserData() ? decryptUserData(useJwt.getUserData()) : null
const existingAbility = userData ? userData.ability : null

export default new Ability(existingAbility || initialAbility)

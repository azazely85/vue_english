import { Role } from '@/_helpers/role'

export default [
  {
    title: 'Learning',
    icon: 'UsersIcon',
    route: 'Learning',
    role: [Role.Admin],
  },
  {
    title: 'Words to learn',
    icon: 'UsersIcon',
    route: 'WordsToLearn',
    role: [Role.Admin],
  },
  {
    title: 'Users',
    icon: 'UserIcon',
    route: 'Users',
    role: [Role.Admin],
  },
]

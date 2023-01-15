import {Role} from "@/_helpers/role";

export default [
  {
    title: 'Finances',
    icon: 'BoxIcon',
    children: [
      {
        title: 'CashFlow',
        route: 'CashFlow',
      },
      {
        title: 'Salaries payout',
        route: 'Salaries',
      },
    ],
  },
  {
    title: 'Work Pool',
    icon: 'UsersIcon',
    route: 'Clients',
    children: [
      {
        icon: 'CodepenIcon',
        title: 'Projects',
        route: 'Work-Pool-Projects',
      },
      {
        icon: 'ClipboardIcon',
        title: 'Contracts',
        route: 'Work-Pool-Contracts',
      },
    ],
  },
  {
    title: 'Comrades',
    icon: 'UsersIcon',
    route: 'Comrades',
  },
  {
    title: 'Reporting',
    icon: 'ClipboardIcon',
    children: [
      {
        title: 'Projects',
        route: 'Reports-Projects',
        icon: 'CodepenIcon',
      },
      {
        title: 'Comrades',
        route: 'Reports-Comrades',
        icon: 'UsersIcon',
      },
      {
        title: 'Workloads',
        route: 'Reports-Workloads',
        icon: 'PieChartIcon',
      },
    ],
  },
  {
    title: 'Interviews',
    icon: 'PhoneIcon',
    children: [
      {
        title: 'Settings',
        route: 'InterviewsSettings',
        icon: 'SettingsIcon',
      },
    ],
  },
  {
    title: 'Settings',
    icon: 'SettingsIcon',
    route: 'Settings',
  },
  {
    title: 'Users',
    icon: 'UserIcon',
    route: 'Users',
    role: [Role.Admin],
  }
]

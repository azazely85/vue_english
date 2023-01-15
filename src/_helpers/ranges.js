export const ranges = [
  { key: 'thisWeek', label: 'This week', value: 'isoWeek' },
  { key: 'lastWeek', label: 'Last week', value: '-isoWeek' },
  { key: 'thisMonth', label: 'This month', value: 'month' },
  { key: 'lastMonth', label: 'Last month', value: '-month' },
  {
    key: 'ytd',
    label: 'YTD',
    value: () => ({
      start: this.$moment().startOf('year'),
      end: this.$moment(),
    }),
  },
  {
    key: 'mtd',
    label: 'MTD',
    value: () => ({
      start: this.$moment().startOf('month'),
      end: this.$moment(),
    }),
  },
]

export const groupByPeriod = (activities, type) => {
  const map = {}

  activities.forEach(a => {
    const d = new Date(a.date)
    let key

    if (type === 'week') {
      key = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`
    }
    if (type === 'month') {
      key = `${d.getFullYear()}-${d.getMonth() + 1}`
    }
    if (type === 'quarter') {
      key = `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`
    }

    map[key] = (map[key] || 0) + a.hours
  })

  return map
}

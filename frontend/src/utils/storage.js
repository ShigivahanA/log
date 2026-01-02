const KEY = 'activity_logs'

export const loadActivities = () => {
  return JSON.parse(localStorage.getItem(KEY)) || []
}

export const saveActivities = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data))
}

import { month } from './data'

const randomColors = ['#F25365', '#FFCE6A', '#FF6C58', '#43C1E4', '#AD94E5', '#569EE6']

const date = new Date()

const currentMonth = date.getMonth() + 1
const currentDate = date.getDate()
const currentYear = date.getFullYear()

export function randomColor() {
  return randomColors[Math.floor(Math.random() * randomColors.length)]
}

export function formatDate(year = currentYear, month = currentMonth, date = currentDate) {
  return `${year}-${month}-${date}`
}

export function firstMonthDay(year, month, date) {
  return `${formatDate(year, month, date)}`
}

export function lastMonthDay(year, month, date) {
  return `${formatDate(year, month, date)}`
}

export function lastMonthDate(year, month) {
  return new Date(year, month, 0).getDate()
}

export function getCurrentFullMonthName() {
  return month[date.getMonth()].fullMonth
}
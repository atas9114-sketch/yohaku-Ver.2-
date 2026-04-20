import { STORAGE_KEY, COMPLETED_KEY, DEFAULT_ITEMS } from './constants.js'

export function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_ITEMS
  } catch {
    return DEFAULT_ITEMS
  }
}

export function saveItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('[YOHAKU] saveItems failed:', e)
  }
}

export function loadCompleted() {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCompleted(items) {
  try {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('[YOHAKU] saveCompleted failed:', e)
  }
}

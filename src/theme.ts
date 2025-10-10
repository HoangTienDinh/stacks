export type Theme = 'light' | 'dark'
export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}
export function getTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || 'light'
}

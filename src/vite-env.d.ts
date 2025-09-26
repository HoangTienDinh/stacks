/// <reference types="vite/client" />

// Allow importing any file with ?raw to get a string at build time
declare module '*?raw' {
  const content: string
  export default content
}

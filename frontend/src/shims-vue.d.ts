// Source - https://stackoverflow.com/a
// Posted by Caleb Denio
// Retrieved 2026-01-07, License - CC BY-SA 4.0

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

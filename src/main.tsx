import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'

// webpack with awesome-typescript-loader can do this:
// import './index.css'

export function main(): void {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
}

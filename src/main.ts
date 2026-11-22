// Ethiopic font for Tigrinya and Amharic, served with the site (no third-party
// font service). Applied in style.css.
import '@fontsource-variable/noto-sans-ethiopic'
import './style.css'

import { createApp } from 'vue'

import App from './App.vue'
import { isPageId } from './pages'

// Every page's HTML file loads this script; data-page says which page it is.
const root = document.getElementById('app')!
const page = isPageId(root.dataset.page) ? root.dataset.page : 'home'

createApp(App, { page }).mount(root)

import DefaultTheme from 'vitepress/theme'
import DemoPhone from './components/DemoPhone.vue'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoPhone', DemoPhone)
  }
}

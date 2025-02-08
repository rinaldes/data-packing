import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'plantation': {
          '500': '#1d4949',
        },
        'crown-of-thorns': {
          '500': '#7a2929',
        },
        'janna': {
          '500': '#f0e6cb',
        },
      }
    }
  }
}

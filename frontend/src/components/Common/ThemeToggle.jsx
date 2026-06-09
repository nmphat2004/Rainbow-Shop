import { useTheme } from "../../context/ThemeContext"
import { DarkModeSwitch } from 'react-toggle-dark-mode'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <DarkModeSwitch checked={theme === 'dark'} onChange={toggleTheme} size={25} />
  )
}

export default ThemeToggle
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

type ThemeMode = 'light' | 'dark' | 'auto'

const items = [
  { label: 'Light', value: 'light', icon: SunIcon },
  { label: 'Dark', value: 'dark', icon: MoonIcon },
  { label: 'Auto', value: 'auto', icon: MonitorIcon },
]

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode() ?? 'auto')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    const nextMode: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  const label =
    mode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  const handleClick = (mode: ThemeMode) => {
    setMode(mode)
    applyThemeMode(mode)
    window.localStorage.setItem('theme', mode)
  }

  const ActiveIcon = items.find(({ value }) => value === mode)!.icon

  return (
    <div className="flex gap-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button>{<ActiveIcon />}</Button>
        </PopoverTrigger>
        <PopoverContent className="flex items-center gap-2">
          {items.map((item) => (
            <Button
              key={item.value}
              value={item.value}
              variant={item.value === mode ? 'secondary' : 'ghost'}
              onClick={() => handleClick(item.value as ThemeMode)}
            >
              <item.icon />
              {item.label}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}

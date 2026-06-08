import { useEffect } from 'react'

export default function MainPage() {
  useEffect(() => {
    window.location.replace('/Main_Page/entrance.html')
  }, [])
  return null
}

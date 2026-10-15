import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './Cursor.css'

export default function Cursor() {
  const dotRef   = useRef(null)
  const ringRef  = useRef(null)
  const labelRef = useRef(null)
  const [cursorText, setCursorText] = useState('')

  useEffect(() => {
    // Skip custom cursor in Admin portal to preserve standard pointer, text selection, and form inputs
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) return

    // Only on pointer devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const dot   = dotRef.current
    const ring  = ringRef.current
    const label = labelRef.current
    if (!dot || !ring) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY

      gsap.to(dot, {
        x: mx,
        y: my,
        duration: 0.08,
        ease: 'none',
        overwrite: 'auto',
      })
      gsap.to([ring, label], {
        x: mx,
        y: my,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const onEnter = (e) => {
      const target = e.currentTarget
      const text = target.getAttribute('data-cursor-text') || target.getAttribute('data-cursor') || ''

      if (text && text !== 'true') {
        setCursorText(text)
        gsap.to(ring, {
          scale: 3.4,
          opacity: 0.9,
          borderColor: 'var(--c-champagne)',
          backgroundColor: 'rgba(8, 8, 8, 0.75)',
          duration: 0.35,
          ease: 'power2.out',
        })
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3 })
        gsap.to(dot, { scale: 0, duration: 0.2 })
      } else {
        setCursorText('')
        gsap.to(ring, {
          scale: 2.2,
          opacity: 0.6,
          borderColor: 'var(--c-champagne)',
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.to(dot, { scale: 0, duration: 0.2 })
      }
    }

    const onLeave = () => {
      setCursorText('')
      gsap.to(ring, {
        scale: 1,
        opacity: 0.85,
        borderColor: 'rgba(200, 169, 106, 0.6)',
        backgroundColor: 'transparent',
        duration: 0.4,
        ease: 'power3.out',
      })
      gsap.to(label, { opacity: 0, scale: 0.7, duration: 0.25 })
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
    }

    const attachListeners = () => {
      const hoverables = document.querySelectorAll('a, button, [data-cursor], [data-cursor-text]')
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    attachListeners()
    const observer = new MutationObserver(attachListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
      const hoverables = document.querySelectorAll('a, button, [data-cursor], [data-cursor-text]')
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <div ref={dotRef} className="cursor__dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor__ring" aria-hidden="true" />
      <div ref={labelRef} className="cursor__label" aria-hidden="true">
        <span>{cursorText}</span>
      </div>
    </>
  )
}

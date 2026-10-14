import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './StatsBar.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 450,  suffix: '+', label: 'Vehicles Delivered' },
  { value: 2023, suffix: '',  label: 'Started In' },
  { value: 100,  suffix: '%', label: 'Quality & Service Assurance' },
  { value: 1,    suffix: 'st', label: 'Choice in Kanchipuram' },
]

function Counter({ target, suffix, triggerRef }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    const obj = { count: 0 }
    const tween = gsap.to(obj, {
      count: target,
      duration: 1.5,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        setVal(Math.round(obj.count))
      },
    })

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: 'top 88%',
      onEnter: () => tween.restart(),
      onEnterBack: () => tween.play(),
    })

    return () => {
      tween.kill()
      st.kill()
    }
  }, [target, triggerRef])

  return <span>{val}{suffix}</span>
}

export default function StatsBar() {
  const sectionRef = useRef(null)

  return (
    <section ref={sectionRef} className="stats-bar" aria-label="Key figures">
      <div className="stats-bar__inner container">
        {stats.map((stat, i) => (
          <div key={i} className="stats-bar__item">
            <span className="stats-bar__value">
              <Counter target={stat.value} suffix={stat.suffix} triggerRef={sectionRef} />
            </span>
            <span className="stats-bar__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

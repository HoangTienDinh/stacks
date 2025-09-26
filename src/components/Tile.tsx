
import { motion } from 'framer-motion'
import clsx from 'clsx'

export function Tile({ letter, muted=false, size='lg' }: { letter: string; muted?: boolean; size?: 'lg'|'md' }) {
  return (
    <motion.div layout className={clsx('tile', size === 'lg' ? 'tile-lg' : 'w-12 h-12 text-xl', muted && 'tile-muted')}
      whileTap={{ scale: 0.96 }}>
      {letter}
    </motion.div>
  )
}

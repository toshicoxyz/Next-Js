'use client'

import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const ErrorMessage = ({ children }: Props) => {
  return (
    <p
      className="text-gray-500"
      style={{
        fontSize: '0.75rem',
        textAlign: 'center',
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        lineHeight: '1.66',
        letterSpacing: '0.03333em',
        fontWeight: '400',
      }}
    >
      {children}
    </p>
  )
}

export default ErrorMessage

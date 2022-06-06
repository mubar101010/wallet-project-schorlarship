import React from 'react'

const HistoryIcon = ({ color = '#000', size = 24 }: { color?: string; size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill={color}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z'
        fill='white'
      />
    </svg>
  )
}

export default HistoryIcon

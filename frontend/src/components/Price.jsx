import React from 'react'

import {
  formatCurrency,
} from '../utils/currency'

export default function Price({
  value,
}) {
  return (
    <span>
      {formatCurrency(value)}
    </span>
  )
}
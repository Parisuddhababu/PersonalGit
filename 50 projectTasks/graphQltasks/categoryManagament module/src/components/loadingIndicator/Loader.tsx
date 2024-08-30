import Loader from '@components/icons/Loader'
import React, { FC } from 'react'

type LoaderProps = {
  showText?: boolean
}
/**
 * Global loader
 * @param showtext Display loader text or not
 * @returns 
 */
const LoadingIndicator: FC<LoaderProps> = () => {
  return (
    <div>
      <Loader />
    </div>
  )
}

export default LoadingIndicator;
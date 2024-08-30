/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, ReactNode, useEffect } from 'react'

const UIContext = React.createContext<[StateType, React.Dispatch<React.SetStateAction<StateType>>]>(
  [{}, () => {}],
)

interface StateType {
  [key: string]: any
}

interface UIContextProviderProps {
  children: ReactNode
}

const UIContextProvider: React.FC<UIContextProviderProps> = ({ children }) => {
  const [state, setState] = useState<StateType>({})
  useEffect(() => {
    let timeoutId
    if (state?.alerts?.length > 0) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      timeoutId = setTimeout(() => {
        setState((prev) => ({ ...prev, alerts: [] }))
      }, state?.alerts?.[0]?.timeout || 5000)
    }
    return () => clearTimeout(timeoutId)
  }, [state])

  const contextValue: [StateType, React.Dispatch<React.SetStateAction<StateType>>] = useMemo(
    () => [state, setState],
    [state],
  )

  return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>
}

export { UIContext, UIContextProvider }

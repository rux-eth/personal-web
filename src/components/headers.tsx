import { FC, PropsWithChildren } from 'react'

const MainHeader: FC<PropsWithChildren> = ({ children }) => {
  return <div className="text-4xl text-white font-bold">{children}</div>
}
const SubHeader: FC<PropsWithChildren> = ({ children }) => {
  return <div className="text-2xl text-white font-bold">{children}</div>
}

export { MainHeader, SubHeader }

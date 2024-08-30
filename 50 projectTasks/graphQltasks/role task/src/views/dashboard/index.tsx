import React from 'react'
import { ROUTES } from '@config/constant'
import { useNavigate } from 'react-router-dom'
import s from './index.module.scss'
import { destroyAuth } from '@utils/helpers'

const Dashboard = () => {
    const navigate = useNavigate()

    const logOut = () => {
        destroyAuth()
        navigate(`/${ROUTES.login}`)
    }

    return (
        <div className={s['dashboard-container']}>
            Dashboard
            <br />
            <button onClick={logOut} >Log out</button>
        </div>
    )
}
export default Dashboard

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
            <div className='flex justify-end m-3'>
            <button onClick={logOut} className='btn btn-primary' >Log out</button>
            </div>
        </div>
    )
}
export default Dashboard

import { useContext } from 'react'
import Link from 'next/link'
import style from './style.module.scss'

import { FiLogOut } from 'react-icons/fi'

import { AuthContext } from '@/contexts/AuthContext'

export function Header() {
    const { signOut, user } = useContext(AuthContext);

    return (
        <header>
            <div className={style.headerContainter}>
                <div className={style.headerContent}>
                    <Link href='/dashboard'>
                        <img src='logo.svg' width={190} height={90} />
                    </Link>

                    <nav className={style.menuNav}>
                        <Link href='/category' legacyBehavior>
                            <a>Categoria</a>
                        </Link>

                        <Link href='/product' legacyBehavior>
                            <a>Cardápio</a>
                        </Link>

                        <div className={style.userInfo}>
                            <label>Signed as:</label>
                            <h4>{user?.name}</h4>
                        </div>

                        <label>Sair</label>
                        <button onClick={signOut}>
                            <FiLogOut color='#FFF' size={20} />
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
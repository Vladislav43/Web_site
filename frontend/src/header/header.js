import React, {useState} from 'react'

import logo from "./img/logo.png"

export default function Header(){
    return (
        <header>
            <div className='header_left'>
                <div className = 'header_logo'>
                    <h2><img src = {logo} />VOJED</h2>
                </div>
                <div className = 'header_buttons'>
                    <ul>
                        <li><a href = '#'>Продукти</a></li>
                        <li><a href = '#'>Про нас</a></li>
                        <li><a href = '#'>Поради з безпеки</a></li>
                        <li><a href = '#'>Підтримка</a></li>
                        <li><a href = '#'>Встановити</a></li>
                    </ul>
                </div>
            </div>
            <div className = 'sign_len_buttons'>
                <a href = '#'>Увійти</a>
            </div>
        </header>
    )
}

import React, {useState} from 'react'

import logo from "./img/logo.png"

export default function Header(){
    let [prodOpen, setProdOpen] = useState(false);

    return (
        <header>
            <div className='header_left'>
                <div className = 'header_logo'>
                    <h2><img src = {logo} />VOJED</h2>
                </div>
                <div className = 'header_buttons'>
                    <ul>
                        <li className='hov'>
                            <a href = '#' onClick = {() => {setProdOpen((prevProdOpen) => !prevProdOpen)}}>Продукти</a>
                            {prodOpen && (
                                <span className="nav">
                                    <ul>
                                        <li><a href='#'>Преміум функції</a></li>
                                        <li>
                                            <a href='#'>Наші підписки</a>
                                            <ul>
                                                <li>VOJED Plus</li>
                                                <li>VOJED Gold</li>
                                                <li>VOJED Platinum</li>
                                            </ul>
                                        </li>
                                        <li><a href='#'>VOJED SELECT</a></li>
                                    </ul>
                                </span>
                            )}
                        </li>
                        <li className='hov'><a href = '#'>Про нас</a></li>
                        <li className='hov'><a href = '#'>Поради з безпеки</a></li>
                        <li className='hov'><a href = '#'>Підтримка</a></li>
                        <li><a className='hov' href = '#'>Встановити</a></li>
                    </ul>
                </div>
            </div>
            <div className = 'sign_len_buttons'>
                <a href = '#'>Увійти</a>
            </div>
        </header>
    )
}

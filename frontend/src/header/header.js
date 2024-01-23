import React, { useState } from 'react';
import logo from "./img/logo.png";

export default function Header() {
  let [prodOpen, setProdOpen] = useState(false);

  return (
    <header>
      <div className='header_left'>
        <div className='header_logo'>
          <h2><img src={logo} alt="VOJED Logo" />VOJED</h2>
        </div>
        <div className='header_buttons'>
          <ul>
            <li className='hov' onClick={() => setProdOpen((prevProdOpen) => !prevProdOpen)}>
              <a href='#'>Продукти</a>
              {prodOpen && (
                <span className="nav">
                  <ul>
                    <li><a href='#'>Преміум функції</a></li>
                    <li>
                      <a href='#'>Наші підписки</a>
                      <ul>
                        <li><a href='#'>VOJED Plus</a></li>
                        <li><a href='#'>VOJED Gold</a></li>
                        <li><a href='#'>VOJED Platinum</a></li>
                      </ul>
                    </li>
                    <li><a href='#'>VOJED SELECT</a></li>
                  </ul>
                </span>
              )}
            </li>
            <li className='hov'><a href='#'>Про нас</a></li>
            <li className='hov'><a href='#'>Поради з безпеки</a></li>
            <li className='hov'><a href='#'>Підтримка</a></li>
            <li><a className='hov' href='#'>Встановити</a></li>
          </ul>
        </div>
      </div>
      <div className='sign_len_buttons'>
        <a href='/registration'>Увійти</a>
      </div>
    </header>
  );
}

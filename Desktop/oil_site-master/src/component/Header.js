import React, {useState} from 'react'
import { SlArrowRight } from "react-icons/sl";

import logo from './../img/vELIKOM.svg'

export default function Header(){
    var element = document.getElementsByClassName('mission');

    return (
        <header>
            <div>
                <span className='logo'><h1><a href='#'><img src = {logo}/>ВЕЛИКОМ</a></h1></span>
            </div>
            <div className = 'buttons'>
                <ul>
                    <li>
                        <p onClick={() => {window.scrollTo({
                            top: 700,
                            left: 0,
                            behavior: 'smooth'
                        });}}>ФОТО</p>
                    </li>
                    <li>
                        <p onClick={() => {window.scrollTo({
                            top: 1675,
                            left: 0,
                            behavior: 'smooth'
                        });}}>СЕРТЕФІКАТИ</p>
                    </li>
                    <li>
                        <p href='#' onClick={() => {window.scrollTo({
                            top: 2375,
                            left: 0,
                            behavior: 'smooth'
                        });}}>ПРОДУКЦІЯ</p>
                    </li>
                    <li>
                        <p href='#' onClick={() => {window.scrollTo({
                            top: 2475,
                            left: 0,
                            behavior: 'smooth'
                        });}}>КОНТАКТИ</p>
                    </li>
                </ul>
            </div>
        </header>
    )
}

import React, {useState} from 'react';

export default function Header(){
    return (
        <div className='main_banner'>
            <div className='banner'>
                <div className='container'>
                    <div className='text_right'>
                        <h1>Сильний<br />від природи</h1>
                    </div>
                </div>
            </div>
            <div className='indicators'>
                <div className='indicator'>
                    <p className='indicator_title'><b>43 000 м<sup>3</sup></b></p>
                    <p className='indicator_text'>Місткість елеватора<br />для зберігання насіння<br />олійних культур</p>
                </div>
                <hr />
                <div className='indicator'>
                    <p className='indicator_title'><b>880 т/добу</b></p>
                    <p className='indicator_text'>Потужність цеху<br />екстракції по<br />переробці сої</p>
                </div>
                <hr />
                <div className='indicator'>
                    <p className='indicator_title'><b>1 000 т/добу</b></p>
                    <p className='indicator_text'>Потужність цеху<br />екстракції по<br />переробці ріпаку</p>
                </div>
                <hr />
                <div className='indicator'>
                    <p className='indicator_title'><b>1 200 т/добу</b></p>
                    <p className='indicator_text'>Потужність цеху<br />екстракції по<br />переробці соняшника</p>
                </div>
            </div>
        </div>
    )}
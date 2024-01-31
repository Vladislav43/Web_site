import React, {useState} from 'react';

import photo_mission from './../img/photo-mission.jpg';

export default function Header(){
    return (
        <div className='mission'>
            <div className='container'>
                <div className='flex'>
                    <div className='mission_text'>
                        <p className='top_text'>
                            <small>НАША МІСІЯ</small>
                            <br />
                            БУТИ СИЛЬНИМИ,<br />ЩОБ РОБИТИ<br />СИЛЬНИМИ ІНШИХ!
                        </p>
                        <p className='down_text'>Компанія «Оліяр» – одна з найбільших виробників<br />рослинної олії в Україні. Весь час прагнучи до<br />нарощення потужностей і вдосконалення<br />виробництва, побудувала новий <br />завод у селі "NM"</p>
                    </div>
                    <div className='mission_img'>
                        <img src={photo_mission} />
                    </div>
                </div>
            </div>
        </div>
    )}
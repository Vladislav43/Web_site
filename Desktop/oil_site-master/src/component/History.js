import React from 'react';
import photo1 from './../img/photo_1.png';
import photo2 from './../img/photo_2.png';
import photo3 from './../img/photo_3.png';
import photo4 from './../img/photo_4.png';
import photo5 from './../img/photo_5.png';


const History = () => {
  return (
    <div className="history">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-8">
            <p className="display-2">Наша історія</p>
            <p>
              Ми – сімейна компанія. Компанія, яка визнає і шанує своє
              українське коріння та сміливо виходить на світові ринки. Компанія,
              яка володіє потужним виробничим потенціалом та, передусім, цінує
              Людину.
            </p>
          </div>
          <div className="col-md-4">
          </div>
        </div>
        <div className="history-carousel">
          <div className="row">
            <HistoryItem
              image={photo1}
              title="Оліяр. Початок шляху"
              year="2003"
            />
            <HistoryItem
              image={photo2}
              title="Побудований цех фасування олії"
              year="2005"
            />
            <HistoryItem
              image={photo3}
              title="Відкриття школи у селі Ставчани"
              year="2007"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryItem = ({ image, alt, title, year }) => {
  return (
    <div className="col-6 col-md-4">
      <img decoding="async" src={image} className="img-fluid mb-4" alt={alt} />
      <p>{title}</p>
      <p className="lead">{year}</p>
    </div>
  );
};

export default History;

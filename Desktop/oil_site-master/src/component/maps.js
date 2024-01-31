import React, { useEffect } from "react";

const Maps = () => {
  useEffect(() => {

    const mapOptions = {
      center: { lat: 50.6198, lng: 26.2516 }, // Координати Рівного
      zoom: 12, // Рівень масштабування мапи
    };

    const map = new window.google.maps.Map(document.getElementById("map"), mapOptions);


    const centerMarker = new window.google.maps.Marker({
      position: { lat: 50.6198, lng: 26.2516 },
      map: map,
      title: "Центр Рівного",
    });

    // Зміна розмірів мапи при зміні розмірів вікна
    window.addEventListener("resize", () => {
      map.setCenter({ lat: 50.6198, lng: 26.2516 });
    });
  }, []);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default Maps;

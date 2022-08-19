import React, { useMemo, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import api from '../services/api';

import mapIcon from '../utils/mapIcon';
import mapMakerImg from '../images/map-marker.svg'

import '../styles/pages/map.css';

interface Foodtruck {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
}

function FoodtrucksMap() {
  const history = useHistory();

  const [foodtrucks, setFoodtrucks] = useState<Foodtruck[]>([]);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [loggedUser, setLoggedUser] = useState('');

  if (localStorage.getItem("qtruck:token"))
    api.defaults.headers.common['Authorization'] = localStorage.getItem("qtruck:token")
  else
    history.push('/')

  useMemo(async () => {

  if (localStorage.getItem("qtruck:user"))
    setLoggedUser(JSON.parse(String(localStorage.getItem("qtruck:user"))).name.split(' ')[0])

    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        navigator.geolocation.getCurrentPosition(function (geo) {
          setPosition({
            latitude: geo.coords.latitude,
            longitude: geo.coords.longitude
          })
        })

        result.onchange = function () {
          console.log(result.state);
        }
      })



    api.get("/foodtrucks")
      .then(res => {
        setFoodtrucks(res.data);
      })


  }, []);

  async function handleLogout() {
    localStorage.clear()
    history.push('/')
  }

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMakerImg} alt="Logo da plataforma qtruck" />
          <h2>Escolha um food truck no mapa</h2>
          <p>Ajude a divulgar food trucks na sua cidade</p>
        </header>

        <footer>
          <p className="logged-user">Olá, {loggedUser}</p>
          <small className="logout" onClick={handleLogout}>Sair</small>
        </footer>
      </aside>

      <Map
        center={[position.latitude, position.longitude]}
        zoom={16}
        style={{ width: "100%", height: "100%" }}
      >

        <TileLayer
          url={
            `https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`
          }
        />

        {foodtrucks.map(foodtruck => {
          return (
            <Marker
              key={foodtruck._id}
              icon={mapIcon}
              position={[foodtruck.latitude, foodtruck.longitude]}
              alt={foodtruck.name}
            >
              <Popup
                closeButton={false}
                minWidth={240}
                maxWidth={240}
                className="map-popup"
              >
                {foodtruck.name}
                <Link to={`/foodtrucks/${foodtruck._id}`}>
                  <FiArrowRight size={20} color="#FFF" />
                </Link>
              </Popup>
            </Marker>
          )
        })}

      </Map>

      <Link to="/foodtrucks/create" className="create-foodtruck">
        <FiPlus size={32} color="#FFF" />
      </Link>

    </div>
  );
}

export default FoodtrucksMap;

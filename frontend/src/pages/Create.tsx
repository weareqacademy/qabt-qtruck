import React, { useMemo, FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import api from "../services/api";

import Sidebar from "../components/SideBar";
import mapIcon from "../utils/mapIcon";

import '../styles/pages/create.css';

import swal from 'sweetalert2';

export default function CreateFoodTruck() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekends, setOpenOnWeekends] = useState(true);

  if (localStorage.getItem("qtruck:token"))
    api.defaults.headers.common['Authorization'] = localStorage.getItem("qtruck:token")
  else
    history.push('/')

  useMemo(() => {

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

  }, []);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    if (!latitude || !longitude) {
      return swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor, marque a localização no mapa!',
      })
    }

    if (
      (!name || name.length <= 0) ||
      (!details || details.length <= 0) ||
      (!openingHours || openingHours.length <= 0)
    ) {
      return swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'O campos nome, descrição e horário de funcionamento devem ser informados para recomendar um food truck!',
      })
    }

    const data = {
      name,
      latitude: latitude,
      longitude: longitude,
      details,
      opening_hours: openingHours,
      open_on_weekends: openOnWeekends
    }

    api.post('/foodtrucks', data)
      .then(response => {
        swal.fire({
          icon: 'success',
          title: 'Obrigado...',
          text: 'Food truck cadastrado com sucesso!'
        })
        history.push('/map');
      }).catch(err => {

        if (err.response && err.response.data) {
          const { bcode, error } = err.response.data

          if (error && bcode === 1001) {
            return swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Esse food fruck já foi cadastrado!'
            })
          }
        }
        console.log(err)
      })
  }

  return (
    <div id="page-create-foodtruck">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-foodtruck-form">
          <fieldset>
            <legend>Recomendar Food Truck</legend>

            <Map
              center={[position.latitude, position.longitude]}
              style={{ width: '100%', height: 280 }}
              zoom={17}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[
                    position.latitude,
                    position.longitude
                  ]}
                />
              )}

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome *</label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="details">Descrição *<span>Máximo de 300 caracteres</span></label>
              <textarea
                id="details"
                name="details"
                maxLength={300}
                value={details}
                onChange={event => setDetails(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening-hours">Horário de Funcionamento *</label>
              <input
                id="openingHours"
                name="opening-hours"
                value={openingHours}
                onChange={event => setOpeningHours(event.target.value)}
              />
            </div>


            <div className="input-block">
              <label htmlFor="open_on_weekends">Disponível no fim de semana?</label>

              <div className="button-select">
                <button
                  type="button"
                  className={openOnWeekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!openOnWeekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Cadastrar
          </button>
        </form>
      </main>
    </div>
  );
}
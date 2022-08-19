import React, { useEffect, useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from 'react-router-dom';

import Sidebar from "../components/SideBar";
import mapIcon from "../utils/mapIcon";
import { AiFillStar } from "react-icons/ai"

import api from "../services/api";

import '../styles/pages/item.css';

import swal from 'sweetalert2';

interface Foodtruck {
  item: FoodtruckItem;
  reviews: Array<Review>;
}

interface FoodtruckItem {
  name: string;
  latitude: number;
  longitude: number;
  details: string;
  opening_hours: string;
  open_on_weekends: boolean;
}

interface User {
  _id: string;
  name: string;
  instagram: string;
}


interface Review {
  _id: string;
  stars: number;
  comment: string;
  rated_by: User;
}

interface FoodtruckParams {
  id: string;
}

export default function Foodtruck() {
  const history = useHistory();
  const params = useParams<FoodtruckParams>();
  const [foodtruck, setFoodtruck] = useState<Foodtruck>();

  const [comment, setComment] = useState('');
  const [stars, setStars] = useState('');

  if (localStorage.getItem("qtruck:token"))
    api.defaults.headers.common['Authorization'] = localStorage.getItem("qtruck:token")
  else
    history.push('/')

  useEffect(() => {
    api.get(`/foodtrucks/${params.id}?top_reviews=10`).then(res => {
      setFoodtruck(res.data);
      console.log(res.data);
    });
  }, [params.id]);

  if (!foodtruck) {
    return <p className="loading">Carregando...</p>
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!comment || comment.length <= 0) {
      return swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor, descreva como foi sua experiência!',
      })
    }

    if (!stars || stars.length <= 0) {
      return swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Escolha uma nota de 1 à 5 estrelas!',
      })
    }

    api.post(`/foodtrucks/${params.id}/review`, { comment, stars: parseInt(stars) })
      .then(response => {

        api.get(`/foodtrucks/${params.id}`).then(res => {
          setFoodtruck(res.data);
        });

        setComment('')
        setStars('')

      }).catch(err => {

        if (err.response && err.response.data) {
          const { bcode, error } = err.response.data

          if (error && bcode === 1003)
            swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Você já enviou sua avaliação!'
            })
        }

        setComment('')
        setStars('')
        console.log(err)
      })


  }

  return (
    <div id="page-foodtruck">
      <Sidebar />

      <main>
        <div className="foodtruck-item">
          <div className="foodtruck-content">
            <div className="main">
              <h1>{foodtruck.item.name}</h1>
              <p>{foodtruck.item.details}</p>
            </div>

            <div className="map-container">
              <Map
                center={[foodtruck.item.latitude, foodtruck.item.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                />
                <Marker interactive={false} icon={mapIcon} position={[foodtruck.item.latitude, foodtruck.item.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://google.com/maps/dir/?api=1&destination=${foodtruck.item.latitude},${foodtruck.item.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <h3>Atendimento</h3>
            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {foodtruck.item.opening_hours}
              </div>

              {foodtruck.item.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
              ) : (
                <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#FF6690" />
                  Não atendemos <br />
                  fim de semana
                </div>
              )}
            </div>

            <h3>Escreva uma avaliação</h3>

            <form onSubmit={handleSubmit} className="create-foodtruck-review">
              <fieldset>
                <div className="input-block">
                  <textarea
                    placeholder="Conte como foi sua experiência neste lugar"
                    name="comment"
                    maxLength={300}
                    value={comment}
                    onChange={event => setComment(event.target.value)}
                  />
                </div>

                <div className="stars">
                  <div className="rating">
                    <label>
                      <input
                        type="radio" name="stars" value="1" onChange={event => setStars(event.target.value)} />
                      <span className="icon">★</span>
                    </label>
                    <label>
                      <input type="radio" name="stars" value="2" onChange={event => setStars(event.target.value)} />
                      <span className="icon">★</span>
                      <span className="icon">★</span>
                    </label>
                    <label>
                      <input type="radio" name="stars" value="3" onChange={event => setStars(event.target.value)} />
                      <span className="icon">★</span>
                      <span className="icon">★</span>
                      <span className="icon">★</span>
                    </label>
                    <label>
                      <input type="radio" name="stars" value="4" onChange={event => setStars(event.target.value)} />
                      <span className="icon">★</span>
                      <span className="icon">★</span>
                      <span className="icon">★</span>
                      <span className="icon">★</span>
                    </label>
                    <label>
                      <input type="radio" name="stars" value="5" onChange={event => setStars(event.target.value)} />
                      <span className="icon">★</span>
                      <span className="icon">★</span>
                      <span className="icon">★</span>
                      <span className="icon">★</span>
                      <span className="icon">★</span>
                    </label>
                  </div>
                </div>


              </fieldset>

              <button className="confirm-button" type="submit">
                Enviar avaliação
              </button>
            </form>

            {foodtruck.reviews.length > 0 &&
              <section id="reviews">
                <h3>Avaliações recentes </h3>
                {foodtruck.reviews.map(review => {
                  return (
                    <div className="review-box-container" key={review._id}>
                      <div className="review-box">
                        <div className="user">
                          <div className="profile">
                            <div className="avatar">
                              <img
                                src={`https://avatars.dicebear.com/api/initials/${review?.rated_by.name}.svg`}
                                alt={review.rated_by.name}
                              />
                            </div>
                            <div className="details">
                              <strong>{review.rated_by.name}</strong>
                              <span>{review.rated_by.instagram}</span>
                            </div>
                          </div>
                          <div className="stars">
                            {Array(review.stars).fill(1).map((el, i) =>
                              <AiFillStar key={i} />
                            )}
                          </div>
                        </div>
                        <div className="comment">
                          <p>{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </section>
            }
          </div>
        </div>
      </main>
    </div>
  );
}
import React, { FormEvent, useState } from 'react';
import { useHistory } from "react-router-dom";

import swal from 'sweetalert2';

import '../styles/pages/signup.css';

import logo from '../images/logo.svg';

import api from "../services/api";

function Signup() {
  const history = useHistory();

  const [name, setName] = useState('');
  const [insta, setInsta] = useState('');
  const [pass, setPass] = useState('');

  if (localStorage.getItem("qtruck:token")) history.push('/map')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if ((!name || name.length <= 0) && (!insta || insta.length <= 0) && (!pass || pass.length <= 0)) {
      return swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor, preencha todos os campos!',
      })
    }

    if (!name || name.length <= 0) {
      return swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor, informe o seu nome completo!',
      })
    }

    if (!insta || insta.length <= 0) {
      return swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor, informe o seu código do Instagram!',
      })
    }

    if (!pass || pass.length <= 0) {
      return swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor, informe a sua senha secreta!',
      })
    }

    api.post('/signup', {
      name: name,
      instagram: insta,
      password: pass
    })
      .then(response => {
        swal.fire({
          icon: 'success',
          title: 'Boas vindas ao Qtruck!',
          text: 'Agora você pode recomendar e/ou avaliar Food trucks.'
        })
        history.push('/');
      }).catch(err => {
        if (err.response && err.response.data) {
          const { bcode, error } = err.response.data

          if (error && bcode === 1001) {
            swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Instagram já cadastrado!'
            })
          }
        }
      })

  }

  return (
    <div id="page-signup">
      <div className="content-wrapper">
        <img src={logo} alt="Logo da plataforma qtruck" />

        <main>
          <h1>Crie sua conta para recomendar Food Trucks</h1>

          <form onSubmit={handleSubmit} className="signup-form">

            <div className="input-block">
              <input
                name="name"
                placeholder="Seu nome completo"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <input
                name="instagram"
                placeholder="Seu código do Instagram"
                value={insta}
                onChange={event => setInsta(event.target.value)}
              />
            </div>

            <div className="input-block">
              <input
                name="password"
                type="password"
                placeholder="Sua senha secreta"
                value={pass}
                onChange={event => setPass(event.target.value)}
              />
            </div>

            <button className="button btn-primary" type="submit">
              Cadastrar
            </button>
          </form>

          <small>
            Já conta? <a href="/">Faça login</a>
          </small>
        </main>
      </div>
    </div>
  );
}

export default Signup;
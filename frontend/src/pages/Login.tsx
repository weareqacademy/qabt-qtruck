import React, { FormEvent, useState } from 'react';
import { useHistory } from "react-router-dom";


import swal from 'sweetalert2';

import '../styles/pages/login.css';

import logo from '../images/logo.svg';

import api from "../services/api";


function Login() {
  const history = useHistory();

  if (localStorage.getItem("qtruck:token")) history.push('/map')

  const [insta, setInsta] = useState('');
  const [pass, setPass] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // const instaRegex: RegExp = /^[a-zA-Z0-9._]+$/

    // if (instaRegex.test(instagram)) setReqInsta(2)

    if ((!insta || insta.length <= 0) && (!pass || pass.length <= 0)) {
      return swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor, informe suas credenciais!',
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

    api.post('/sessions', { instagram: insta, password: pass })
      .then(response => {
        localStorage.setItem("qtruck:token", response.data.token);
        localStorage.setItem("qtruck:user", JSON.stringify(response.data.user));
        history.push('/map');
      }).catch(err => {
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Credenciais inválidas, tente novamente!',
        })
      })
  }

  return (
    <div id="page-login">
      <div className="content-wrapper">
        <img src={logo} alt="Logo da plataforma qtruck" />

        <main>
          <h1>Aproveite o melhor da comida de rua</h1>

          <form onSubmit={handleSubmit} className="login-form">

            <h2>Acesse sua conta</h2>

            <div className="input-block">
              <input
                name="instagram"
                placeholder="Código do Instagram"
                value={insta}
                onChange={event => setInsta(event.target.value)}
              />
            </div>

            <div className="input-block">
              <input
                name="password"
                type="password"
                placeholder="Senha secreta"
                value={pass}
                onChange={event => setPass(event.target.value)}
              />
            </div>

            <button className="button btn-primary" type="submit">
              Entrar
            </button>
          </form>

          <small>
            Não tem conta? <a href="/signup">Cadastre-se</a>
          </small>
        </main>
      </div>
    </div>
  );
}

export default Login;
import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import profileImage from '../../assets/profile-image.jpg'; // Import the profile image
import './home.css';

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Bem-vindo à Galeria NASA</h1>
      <p className="home-subtitle">
        Explore o cosmos com imagens deslumbrantes dos arquivos da NASA.
        Descubra a beleza do espaço, uma imagem de cada vez.
      </p>
      <ul className="features-list">
        <li className="feature-item">
          <h2 className="feature-title">Imagem do Dia</h2>
          <p className="feature-description">Descubra uma nova imagem em destaque da NASA todos os dias, completa com uma explicação detalhada.</p>
        </li>
        <li className="feature-item">
          <h2 className="feature-title">Pesquisar nos Arquivos</h2>
          <p className="feature-description">Mergulhe na vasta biblioteca de imagens da NASA. Pesquise por palavra-chave, data ou local.</p>
        </li>
        <li className="feature-item">
          <h2 className="feature-title">Salve Seus Favoritos</h2>
          <p className="feature-description">Crie sua própria coleção de imagens espaciais favoritas para revisitar a qualquer momento.</p>
        </li>
      </ul>

      <div className="developer-info">
        <h2 className="developer-title">Desenvolvido por:</h2>
        <img src={profileImage} alt="Developer Profile" className="profile-image" />
        <p className="developer-name">José Anderson da Silva Costa</p>
        <div className="social-links">
          <a href="https://linkedin.com/in/dessim" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="social-icon" />
          </a>
          <a href="https://github.com/dessima" target="_blank" rel="noopener noreferrer">
            <FaGithub className="social-icon" />
          </a>
        </div>
      </div>
    </div>
  );
}
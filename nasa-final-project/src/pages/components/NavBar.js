import React from "react";
import styled from "styled-components";
import * as ReactBootstrap from "react-bootstrap";
import { FaHome } from "react-icons/fa";
import { BiImageAlt } from "react-icons/bi";
import NASA_logo from "../../img/NASA_logo.png";
import "../../App.css";
import "../../styles/home.css";

export default function NavBar() {
  return (
    <div className="Navbar">
      <ReactBootstrap.Navbar className="Navbar" expand="sm" variant="dark">
        <ReactBootstrap.Navbar.Brand href="/">
          <img
            src={NASA_logo}
            alt="NASA Logo"
            className="Logo_Nasa"
            width="100"
            height="90"
          />
        </ReactBootstrap.Navbar.Brand>
        <ReactBootstrap.Navbar.Toggle />
        <ReactBootstrap.Navbar.Collapse>
          <Navbar>
            <ReactBootstrap.Nav className="mr-auto">
              <ReactBootstrap.Nav.Link href="/" className="Button_Home_Nav">
                <FaHome className="Icon_Home" />
                Início
              </ReactBootstrap.Nav.Link>
              <ReactBootstrap.Nav.Link
                href="/Fotos"
                className="Button_Home_Nav"
              >
                <BiImageAlt className="Icon_Image" />
                Imagem Astronômica do Dia
              </ReactBootstrap.Nav.Link>
            </ReactBootstrap.Nav>
          </Navbar>
        </ReactBootstrap.Navbar.Collapse>
      </ReactBootstrap.Navbar>
    </div>
  );
}

const Navbar = styled.div`
  padding-left: 0%;
  

  .Icon_Home,
  .Icon_Image {
    vertical-align: middle;
   margin-left: 10px;
  }
`;

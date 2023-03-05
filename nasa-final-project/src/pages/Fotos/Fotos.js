import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "../../App.css";
import "../../styles/home.css";
import "../../styles/Fotos.css";
import NavBar from "../components/NavBar";
import Earth_Background from "../../img/Earth_Background.mp4";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const My_Key_NASA = "0OdFuiCh6QGZIFcD1OGV0m7xyWNXpeZ7gGcpte1D";

export default function Fotos() {
  const [show, setShow] = useState(false);
  const [photoData, setPhotoData] = useState(null);

  useEffect(() => {
    fetchPhotoDay();

    async function fetchPhotoDay() {
      const res = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${My_Key_NASA}`
      );
      const data = await res.json();
      setPhotoData(data);
      console.log(data);
    }
  }, []);
  if (!photoData) return <div />;

  return (
    <>
      <NavBar />
      <video class="Video_Background" autoPlay loop muted>
        <source src={Earth_Background} type="video/mp4" />
      </video>
      <div className="Fotos">
        <Home2>
          <div>
            <div class="button_open_modal">
              <Button variant="primary" onClick={() => setShow(true)}>
                {" "}
                Saiba Mais
              </Button>
            </div>

            <Modal
              show={show}
              onHide={() => setShow(false)}
              dialogClassName="modal-90w"
              aria-labelledby="example-custom-modal-styling-title"
            >
              <Modal.Header
                closeButton
                variant="primary"
                className="Modal-Info"
              >
                <Modal.Title
                  id="example-custom-modal-styling-title"
                  className="Modal-Info"
                >                 
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="Modal-Info">
                <p className="Modal-Info">
                Esta seção mostra uma imagem ou um vídeo e as informações,
                   isso corresponde a hoje, todos os dias a imagem é atualizada
                </p>
              </Modal.Body>
            </Modal>
          </div>
          <h1 className="date">{photoData.date}</h1>
          <div className="Photo_Day">
            {photoData.media_type === "image" ? (
              <img
                src={photoData.url}
                alt={photoData.title}
                className="photo"
              />
            ) : (
              <iframe
                title="space-video"
                src={photoData.url}
                iframe="0"
                gesture="media"
                allow="encrypted-media"
                allowFullScreen
                className="photo"
              />
            )}
            <div>
              <h1>{photoData.title}</h1>
              <br />
              <p className="explanation">{photoData.explanation}</p>
            </div>
          </div>
        </Home2>
      </div>
    </>
  );
}

const Home2 = styled.div``;

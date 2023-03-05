import React from "react";
import styled from "styled-components";
import { useState } from "react";
import "../../App.css";
import "../../styles/home.css";
import NavBar from "../components/NavBar";
import Earth_Background from "../../img/Earth_Background.mp4";
import ImagePreview from "./ImagePreview";
import { BsSearch } from "react-icons/bs";
import { Button } from "react-bootstrap";


export default function HomePage({ items }) {
  const [search, setSearch] = useState("");
  const [photos, setPhotos] = useState(items);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = async () => {
    const results = await fetch(
      `https://images-api.nasa.gov/search?media_type=image&q=${search}`
    );
    const previews = await results.json();
    setPhotos(await previews.collection.items);
  };

  return (
    <>
      <div className="Home">
        <video class="Video_Background" autoPlay loop muted>
          <source src={Earth_Background} type="video/mp4" />
        </video>
        <Home>
          <NavBar />
          <Jumbotron>
            <h1 class="TitleHome">Olá, seja bem vindo a galeria da NASA</h1>
            <p class="PHome">
              Aqui você pode explorar imagens incríveis de planetas, nebulosas e
              galáxias deslumbrantes capturadas pelos telescópios da NASA!
            </p>
            <SearchContainer>
              <SearchInput
                className="SearchBarHome"
                id="nasaSearch"
                value={search}
                onChange={handleSearchChange}
                type="text"
                placeholder="Procurar imagem"
              />
              <Button
                className="button"
                variant="primary"
                disabled={search === ""}
                onClick={handleSearchSubmit}
                style={{
                  borderColor: "transparent",
                  borderRadius: "0 5px 5px 0",
                  backgroundColor: "midnightblue",
                  padding: "17px",
                  marginLeft: "0px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",                  
                }}
              >
                <BsSearch style={{ fontSize: "1.5rem", color: "white" }} />
              </Button>
            </SearchContainer>
            <ImageContainer>
              {photos &&
                photos.map((preview) => (
                  <ImagePreview
                    key={preview.data[0].title}
                    nasaPicture={preview.links[0].href}
                    title={preview.data[0].title}
                    description={preview.data[0].description}
                  />
                ))}
            </ImageContainer>
          </Jumbotron>
        </Home>
      </div>
    </>
  );
}

const Home = styled.div`
  width: 90vw;
  height: 100vh;
  color: white;
  paddingLeft: 50px;
`;

const Jumbotron = styled.div`
  margin-top: 2%;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 70%;
  max-width: 500px;
  height: 60px;
  border: none;
  border-radius: 5px 0 0 5px;
  padding-left: 10px;
  font-size: 18px;
  outline: none;
  background-color: rgba(0,0,0,0.5);
  margin-top: 0%;
  color: white;
  

  &::placeholder {
    color: #aaa;
  }
  &:focus {
    cursor: text;
    caret-color: white;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
`;

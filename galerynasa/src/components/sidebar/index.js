import React, { useEffect, useState } from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import { BsSearch, BsFillCalendar2MinusFill, BsFillEyeFill, BsInfoSquare } from "react-icons/bs";

export default function Sidebar() {
  const [image] = useState(
"https://assets.materialup.com/uploads/2979c2d8-d5dd-4576-8f4c-40133f4d324c/preview.jpg"  );

  useEffect(() => {});

  return (
    <div className="sidebar-container">
      <img src={image} className="profile-img" alt="profile" />
      <div>
        <SidebarButton title="Visualizar" to="/image-view" icon={<BsFillEyeFill />} />
        <SidebarButton title="Foto do Dia" to="/" icon={<BsFillCalendar2MinusFill />} />
        <SidebarButton
          title="Busca"
          to="/image-search"
          icon={<BsSearch />}
        />
      </div>
      <SidebarButton title="Sobre" to="" icon={<BsInfoSquare />} />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import { FaPlay, FaSignOutAlt } from "react-icons/fa";
import { BsFillFileImageFill } from "react-icons/bs";

export default function Sidebar() {
  const [image] = useState(
    "https://freesvg.org/img/abstract-user-flat-4.png"
  );

  useEffect(() => {
    
  });

  return (
    <div className="sidebar-container">
      <img src={image} className="profile-img" alt="profile" />
      <div>
        <SidebarButton title="Player" to="/player" icon={<FaPlay />} />
        <SidebarButton
          title="Imagens"
          to="/"
          icon={<BsFillFileImageFill />}
        />
        <SidebarButton
          title="Details"
          to="/image-details"
          icon={<BsFillFileImageFill />}
        />
      </div>
      <SidebarButton title="Sign Out" to="" icon={<FaSignOutAlt />} />
    </div>
  );
}

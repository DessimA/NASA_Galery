import React, { useEffect, useState } from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import { FaPlay, FaSignOutAlt } from "react-icons/fa";
import { BsFillFileImageFill } from "react-icons/bs";

export default function Sidebar() {
  const [image] = useState(
"https://assets.materialup.com/uploads/2979c2d8-d5dd-4576-8f4c-40133f4d324c/preview.jpg"  );

  useEffect(() => {});

  return (
    <div className="sidebar-container">
      <img src={image} className="profile-img" alt="profile" />
      <div>
        <SidebarButton title="Player" to="/ImageView" icon={<FaPlay />} />
        <SidebarButton title="Imagens" to="/" icon={<BsFillFileImageFill />} />
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

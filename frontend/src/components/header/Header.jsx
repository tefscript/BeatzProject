import React from "react";
import { Link } from "react-router-dom";
import "@/components/header/Header.css";
import Icon from "@/components/icon/Icon";

function BeatzHeader() {
  return (
    <div>
      <header className="beatzheader">
        <Link to="/login">
          <Icon name="beatz" alt="Beatz" className="logo-beatz" />
        </Link>
        <hr />
      </header>
    </div>
  );
}

export default BeatzHeader;
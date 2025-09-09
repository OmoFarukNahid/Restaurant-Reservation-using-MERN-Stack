import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link as ScrollLink } from "react-scroll";
import { Link as ReactRouterLink, useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../authState";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav>
      <div className="logo">
        <ReactRouterLink to="/" >FOODIE</ReactRouterLink>
      </div>
      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          {data[0].navbarLinks.map((element) => {
            const isHomePage = location.pathname === "/";
            return isHomePage ? (
              <ScrollLink
                to={element.link}
                spy={true}
                smooth={true}
                duration={500}
                key={element.id}
                onClick={() => setShow(false)}
              >
                {element.title}
              </ScrollLink>
            ) : (
              <ReactRouterLink
                key={element.id}
                to={{
                  pathname: "/",
                  state: { scrollTo: element.link },
                }}
                onClick={() => setShow(false)}
              >
                {element.title}
              </ReactRouterLink>
            );
          })}
          <ReactRouterLink
            to="/recommendations"
            onClick={() => setShow(false)}
          >
            RECOMMENDATIONS
          </ReactRouterLink>
        </div>
        {user ? (
          <button className="menuBtn" onClick={logout}>
            Logout
          </button>
        ) : (
          <button className="menuBtn" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </div>
      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
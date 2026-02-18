import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../redux/slices/uiSlice";



import { IoIosSettings } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { AiOutlineHome, AiOutlineSearch, AiOutlineHeart } from "react-icons/ai";

import logo from "../../assets/music-player.png";
import "../../css/sidemenu/SideMenu.css";


const SideMenu = ({ setView, view , onOpenEditProfile}) => {
  const dispatch = useDispatch();
  const {user, isAuthenticated} = useSelector((state) => state.auth);

  const displayUser ={
    name: user?.name || "",
    avatar: user?.avatar || "",
  };
  const handleSearchClick = () => {
    if(!isAuthenticated) {
      dispatch(openAuthModal("login"));
      return;
    }
    setView("search");
  };

  const handleFavouriteClick = () => {
    if(!isAuthenticated) {
      dispatch(openAuthModal("login"));
      return;
    }
    setView("favourite");
  };


  const getNavBtnClass = (item) =>
    `sidemenu-nav-btn ${view === item ? "active" : ""}`;
  return (
    <>
      <aside className="sidemenu-root">
        {/* Logo */}
        <div className="sidemenu-header">
          <img src={logo} alt="music-logo" className="sidemenu-logo-img" />
          <h2 className="sidemenu-logo-title">Vibzy</h2>
        </div>
        {/* Navigation */}
        <nav className="sidemenu-nav" aria-label="Main navigation">
          <ul className="sidemenu-nav-list">
            <li>
              <button
                className={getNavBtnClass("home")}
                onClick={() => setView("home")}
              >
                <AiOutlineHome className="sidemenu-nav-icon" size={18} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleSearchClick}
                className={getNavBtnClass("search")}
              >
                <AiOutlineSearch className="sidemenu-nav-icon" size={18} />
                <span> Search</span>
              </button>
            </li>
            <li>
              <button
                className={getNavBtnClass("favourite")}
                onClick={handleFavouriteClick}
              >
                <AiOutlineHeart size={18} />
                <span>Favourite</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex-1"></div>
        <div className="sidemenu-profile-row">
          <div className="profile-placeholder">
            <CiUser size={30} />
          </div>

          <div className="sidemenu-username-wrapper">
            <div className="sidemenu-username">{displayUser.name}</div>
          </div>
          {isAuthenticated && (
            <div className="settings-container">
              <button
                type="button" 
                className="sidemenu-settings-btn" 
                onClick={onOpenEditProfile}
              >
                <IoIosSettings size={20} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideMenu;

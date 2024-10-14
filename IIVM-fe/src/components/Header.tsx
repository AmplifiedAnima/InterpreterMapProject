import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setLanguage } from "../redux/languageSlice";
import iconWhite from "../assets/icons/home_white.svg";
import mapWhite from "../assets/icons/map_white.svg";
import questionMarkWhite from "../assets/icons/help-circle_white.svg";
import menuIcon from "../assets/icons/menu.svg";
import "/node_modules/flag-icons/css/flag-icons.min.css";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoggedIn } = useSelector((state: RootState) => state.authState);
  const { language } = useSelector((state: RootState) => state.language);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttonStylingSpecificForHeader = "px-4 mx-[4px] justify-start text-sm";

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLanguageSelection = (lang: string) => {
    dispatch(setLanguage(lang));
    setIsDropdownOpen(false);
  };

  const menuItems = [
    { label: "Home", icon: iconWhite, onClick: () => navigate("/") },
    ...(isLoggedIn
      ? [
          {
            label: 'Lexicon',
            icon: mapWhite,
            onClick: () => navigate("/vocabulary-map"),
          },
          {
            label: "Suggestions",
            onClick: () => navigate("suggestion-acquiesce"),
          },
          {
            label: 'Learn',
            icon: questionMarkWhite,
            onClick: () => navigate("/quiz-page"),
          },
        ]
      : []),
    {
      label: isLoggedIn ? "Profile" : "Login",
      onClick: isLoggedIn
        ? () => navigate("profile-page")
        : () => navigate("login-user"),
    },
  ];

  return (
    <div className="flex justify-end border-b-[1px] border-b-black bg-gradient-to-l py-1 from-white to-[#a09edd] px-1">
      <div className="relative">
        <Button
          className={buttonStylingSpecificForHeader}
          onClick={toggleDropdown}
          label={
            <div className="flex items-center">
              <i className={`fi fi-${language === "es" ? "es" : "pl"}`}></i>
            </div>
          }
        />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
            <button
              className="flex items-center px-4 py-2 hover:bg-gray-200 w-full text-left"
              onClick={() => handleLanguageSelection("pl")}
            >
              <i className="fi fi-pl mr-2"></i> Polish
            </button>
            <button
              className="flex items-center px-4 py-2 hover:bg-gray-200 w-full text-left"
              onClick={() => handleLanguageSelection("es")}
            >
              <i className="fi fi-es mr-2"></i> Spanish
            </button>
          </div>
        )}
      </div>

      {!isMobile ? (
        <>
          {menuItems.map((item, index) => (
            <Button
              key={index}
              label={item.label}
              imageIcon={item.icon}
              className={buttonStylingSpecificForHeader}
              onClick={item.onClick}
            />
          ))}
        </>
      ) : (
        <div className="relative">
          <Button
            imageIcon={menuIcon}
            className={buttonStylingSpecificForHeader}
            onClick={toggleMobileMenu}
          />
          {isMobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center px-4 py-2 hover:bg-gray-200 w-full text-left"
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
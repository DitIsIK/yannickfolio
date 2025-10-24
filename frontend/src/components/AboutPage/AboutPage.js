import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { zoomIn, fadeIn } from "../../services/variants";
import { styled } from "@stitches/react";
import "../../styles/AboutPage.css";
import { SpotlightBG } from "./SpotlightBG";
// import AboutImg from "../../../public/Kartavya-Profile-Photo.webp";
import siteData from "../../data/site";
import withPublicPath from "../../utils/publicPath";

const aboutStats = siteData.about.stats;

function AboutPage({ isBatterySavingOn, isWindowModalVisible, addTab }) {
  const resumeHref = withPublicPath(siteData.hero.secondaryCta.href);
  const profileImageSrc = withPublicPath(siteData.about.profileImage);
  const aiCompanionTitle = `${siteData.owner.name}'s AI Companion`;
  const feedTitle = `${siteData.owner.name}'s Feed`;
  useEffect(() => {
    const updateScale = () => {
      const aboutDiv = document.querySelector(".about-content");
      if (!aboutDiv) return;
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;
      let scaleValue = 1;
      if (screenHeight < 750 && screenWidth > 576) {
        scaleValue = screenHeight / 750;
      }
      aboutDiv.style.zoom = `${scaleValue}`;
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    const offset = 52; // Adjust based on your navbar height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };
  return (
    <section className="about-section-container" id="about">
      <SpotlightBG />
      <motion.div
        variants={isBatterySavingOn ? {} : zoomIn(0)}
        initial="show"
        whileInView="show"
        exit="hidden"
        className="about-div"
        style={
          isWindowModalVisible
            ? { opacity: 0, transition: "opacity 0.5s ease-in-out" }
            : { opacity: 1, transition: "opacity 0.5s ease-in-out" }
        }
      >
        <div className="about-content glass">
          <h2 className="section-title">ABOUT ME</h2>
          <div className="about-container">
            <motion.div className="about-row">
              <motion.img
                src={profileImageSrc}
                className="about-image"
                alt={`${siteData.owner.name} portret`}
                width={360}
                height={360}
                loading="lazy"
                variants={isBatterySavingOn ? {} : fadeIn("right", 200, 0)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial="hidden"
                whileInView="show"
                exit="hidden"
              />
              <motion.div
                className="about-info"
                variants={isBatterySavingOn ? {} : zoomIn(0)}
                initial="hidden"
                whileInView="show"
                exit="hidden"
              >
                {aboutStats.map((item, index) => (
                  <motion.div
                    className="about-box"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.99 }}
                    key={index}
                  >
                    <motion.i className={item.icon}></motion.i>
                    <h3 className="about-title">{item.title}</h3>
                    <span className="about-subtitle">{item.subtitle}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div className="about-row">
              <motion.div
                className="about-description-box"
                variants={isBatterySavingOn ? {} : fadeIn("left", 200, 0)}
                initial="hidden"
                whileInView="show"
                exit="hidden"
              >
                <span className="about-name">{siteData.owner.name}</span>
                <p className="about-role">{siteData.owner.tagline}</p>
                <p className="about-description">
                  {siteData.owner.bioShort}
                </p>
                <p className="about-description">
                  {siteData.owner.bioLong}
                </p>
                <div className="about-contact">
                  <p>
                    <strong>Locatie:</strong> {siteData.owner.location}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${siteData.owner.email}`}>
                      {siteData.owner.email}
                    </a>
                  </p>
                </div>
                <div className="about-now">
                  <h4>Nu bezig met</h4>
                  <ul>
                    {siteData.about.now.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              <motion.h2
                className="about-page-subtitle"
                variants={isBatterySavingOn ? {} : zoomIn(0)}
                initial="hidden"
                whileInView="show"
                exit="hidden"
              >
                Learn More About Me From My:
              </motion.h2>
              <motion.div
                className="button-container"
                variants={isBatterySavingOn ? {} : zoomIn(0)}
                initial="hidden"
                whileInView="show"
                exit="hidden"
              >
                <motion.a>
                  <StyledButton
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("skills");
                    }}
                  >
                    <ButtonShadow />
                    <ButtonEdge />
                    <ButtonLabel>Skills</ButtonLabel>
                  </StyledButton>
                </motion.a>
                <motion.a>
                  <StyledButton
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("projects");
                    }}
                  >
                    <ButtonShadow />
                    <ButtonEdge />
                    <ButtonLabel>Projecten</ButtonLabel>
                  </StyledButton>
                </motion.a>
                <motion.a
                  href={resumeHref}
                  download="Yannick_Deetman_CV.pdf"
                  className="download-cv"
                  style={{ userSelect: "none" }}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <StyledButton as="span">
                    <ButtonShadow />
                    <ButtonEdge />
                    <ButtonLabel>{siteData.hero.secondaryCta.label}</ButtonLabel>
                  </StyledButton>
                </motion.a>
              </motion.div>
              <motion.div
                className="button-container"
                variants={isBatterySavingOn ? {} : zoomIn(0)}
                initial="hidden"
                whileInView="show"
                exit="hidden"
              >
                <motion.a>
                  <StyledButton
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("experience");
                    }}
                  >
                    <ButtonShadow />
                    <ButtonEdge />
                    <ButtonLabel>Ervaring</ButtonLabel>
                  </StyledButton>
                </motion.a>
                <motion.a>
                  <StyledButton
                    onClick={(e) => {
                      e.preventDefault();
                      addTab("FeedTab", { title: feedTitle });
                    }}
                  >
                    <ButtonShadow />
                    <ButtonEdge />
                    <ButtonLabel>Feed</ButtonLabel>
                  </StyledButton>
                </motion.a>
                <motion.a>
                  <StyledButton
                    onClick={(e) => {
                      e.preventDefault();
                      addTab("AIChatTab", { title: aiCompanionTitle });
                    }}
                  >
                    <ButtonShadow />
                    <ButtonEdge />
                    <ButtonLabel>AI Companion</ButtonLabel>
                  </StyledButton>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default AboutPage;

// Styled Components for Custom Button
// Styled Components (Stitches / similar) for a responsive Custom Button

const ButtonPart = styled("span", {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  borderRadius: 5,
});

const ButtonShadow = styled(ButtonPart, {
  background: "hsl(0deg 0% 0% / 0.1)",
  borderRadius: 5,
  transform: "translateY(2px)",
  transition: "transform 250ms ease-out",
});

const ButtonEdge = styled(ButtonPart, {
  background: `linear-gradient(
    to left,
    hsl(0deg 0% 69%) 0%,
    hsl(0deg 0% 85%) 8%,
    hsl(0deg 0% 85%) 92%,
    hsl(0deg 0% 69%) 100%
  )`,
  borderRadius: 5,
});

const ButtonLabel = styled("span", {
  fontFamily: "Montserrat",
  fontSize: "18px",
  display: "block",
  position: "relative",
  borderRadius: 5,
  color: "#212529",
  padding: "0.75rem 1.5rem",
  background: "#f8f9fa",
  transform: "translateY(-4px)",
  width: "100%",
  userSelect: "none",
  transition:
    "transform 250ms ease-out, background-color 0.3s ease, color 0.3s ease",

  "&:hover": {
    backgroundColor: "#fcbc1d",
    color: "#212529",
    transform: "scale(1.05)",
  },

  // ——————————————————————————————
  // Responsive adjustments
  "@media (max-width: 992px)": {
    fontSize: "15px",
    padding: "0.6rem 1.2rem",
  },
  "@media (max-width: 576px)": {
    fontSize: "12px",
    padding: "0.5rem 1rem",
  },
  // ——————————————————————————————
});

const StyledButton = styled("button", {
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
  borderRadius: 5,
  background: "transparent",
  position: "relative",
  padding: 0,
  transition: "filter 250ms ease-out",

  "&:hover": {
    filter: "brightness(110%)",

    [`& ${ButtonLabel}`]: {
      transform: "translateY(-6px)",
    },

    [`& ${ButtonShadow}`]: {
      transform: "translateY(4px)",
    },
  },

  "&:active": {
    [`& ${ButtonLabel}`]: {
      transform: "translateY(-2px)",
      transition: "transform 34ms",
    },

    [`& ${ButtonShadow}`]: {
      transform: "translateY(1px)",
      transition: "transform 34ms",
    },
  },
});

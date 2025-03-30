import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zoomIn } from "../../services/variants";
import LeftArrow from "../../assets/img/icons/arrow1.svg";
import RightArrow from "../../assets/img/icons/arrow2.svg";
import LikeButton from "../SpecialComponents/LikeButton";
import { fetchHonorsExperiences } from "../../services/honorsExperienceService";
import { fetchYearInReviews } from "../../services/yearInReviewService";
import { styled } from "@stitches/react";

const slideVariants = {
  hidden: { opacity: 0, scale: 0.6, x: 0, rotateY: 0, z: -400, zIndex: 7 },
  prev: { opacity: 0.8, scale: 0.8, x: -240, rotateY: 15, z: -200, zIndex: 9 },
  next: { opacity: 0.8, scale: 0.8, x: 240, rotateY: -15, z: -200, zIndex: 9 },
  active: { opacity: 1, scale: 1, x: 0, rotateY: 0, z: 0, zIndex: 10 },
};
const slideTransition = {
  duration: 0.8,
  ease: "easeInOut",
  zIndex: { duration: 0 },
};

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 52;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};
const CustomArrow = ({ direction, onClick, imgSrc, label }) => {
  const handleClick = () => {
    if (onClick) onClick();
    scrollToSection("experience");
  };
  return (
    <button
      className={`custom-arrow custom-${direction}-arrow`}
      onClick={handleClick}
      aria-label={label}
    >
      <img src={imgSrc} alt={`${label} Arrow`} />
    </button>
  );
};

const HonorsTabPage = ({ addTab, isBatterySavingOn }) => {
  const [honors, setHonors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const honorsData = await fetchHonorsExperiences();
        const reviewsData = await fetchYearInReviews();
        setHonors(honorsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const combinedLength = honors.length + reviews.length;

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % combinedLength);

  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + combinedLength) % combinedLength);

  const getSlideData = (index) => {
    if (index < honors.length) {
      return { type: "honor", data: honors[index] };
    } else {
      return { type: "review", data: reviews[index - honors.length] };
    }
  };

  const n = combinedLength;
  const prevIndex = (activeSlide - 1 + n) % n;
  const nextIndex = (activeSlide + 1) % n;
  const visibleIndices =
    n === 0
      ? []
      : n === 1
      ? [0]
      : n === 2
      ? [activeSlide, nextIndex]
      : [prevIndex, activeSlide, nextIndex];

  return (
    <motion.div
      className="career-tab-page"
      variants={isBatterySavingOn ? {} : zoomIn(0)}
      initial="hidden"
      whileInView="show"
      exit="hidden"
      viewport={{ once: true }}
    >
      <h1 className="career-tab-header">My Honors Journey</h1>
      <div className="career-tabs-slider">
        <div className="slide-container">
          <AnimatePresence initial={false}>
            {visibleIndices.map((index) => {
              const { type, data } = getSlideData(index);
              return (
                <motion.div
                  key={`${type}-${index}`}
                  className="slide"
                  variants={slideVariants}
                  initial="hidden"
                  animate={
                    index === activeSlide
                      ? "active"
                      : index === prevIndex
                      ? "prev"
                      : index === nextIndex
                      ? "next"
                      : "hidden"
                  }
                  exit="hidden"
                  transition={slideTransition}
                >
                  <div className="slider-content">
                    {type === "honor" ? (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          zIndex: 100,
                        }}
                      >
                        <LikeButton
                          type="HonorsExperience"
                          title={data.honorsExperienceTitle}
                          onLikeSuccess={() =>
                            setHonors((prevHonorsExperience) =>
                              prevHonorsExperience.map((he) =>
                                he.honorsExperienceTitle ===
                                data.honorsExperienceTitle
                                  ? {
                                      ...he,
                                      likesCount: (he.likesCount || 0) + 1,
                                    }
                                  : he
                              )
                            )
                          }
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          zIndex: 100,
                        }}
                      >
                        <LikeButton
                          type="YearInReview"
                          title={data.yearInReviewTitle}
                          onLikeSuccess={() =>
                            setReviews((prevReviews) =>
                              prevReviews.map((ri) =>
                                ri.yearInReviewTitle === data.yearInReviewTitle
                                  ? {
                                      ...ri,
                                      likesCount: (ri.likesCount || 0) + 1,
                                    }
                                  : ri
                              )
                            )
                          }
                        />
                      </div>
                    )}
                    <div className="career-container">
                      <div className="career-image">
                        <img
                          src={
                            type === "honor"
                              ? data.honorsExperienceImages[0]
                              : data.yearInReviewImages[0]
                          }
                          alt=""
                          className="career-image-content"
                        />
                      </div>
                      <div className="career-details">
                        <h2 className="career-title">
                          {type === "honor"
                            ? data.honorsExperienceTitle
                            : data.yearInReviewTitle}
                        </h2>
                        <div className="career-subtitle-area">
                          <h4 className="career-subtitle">
                            {type === "honor"
                              ? data.honorsExperienceSubTitle
                              : data.yearInReviewSubTitle}
                          </h4>
                          <p className="career-timeline">
                            {type === "honor"
                              ? data.honorsExperienceTimeline
                              : data.yearInReviewTimeline}
                          </p>
                          <p className="career-tagline">
                            {type === "honor"
                              ? data.honorsExperienceTagline
                              : data.yearInReviewTagline}
                          </p>
                        </div>
                        <motion.div
                          className="career-learn-button-motioned"
                          onClick={() => {
                            if (type === "honor") {
                              addTab("Honors", data);
                            } else if (type === "review") {
                              addTab("YearInReview", data);
                            } else {
                              console.error(
                                "No career data available for the review tab"
                              );
                            }
                          }}
                          variants={zoomIn(0)}
                          initial="hidden"
                          animate="show"
                          drag
                          dragConstraints={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                          }}
                          dragElastic={0.3}
                          dragTransition={{
                            bounceStiffness: 250,
                            bounceDamping: 15,
                          }}
                        >
                          <StyledButton
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <ButtonShadow />
                            <ButtonEdge />
                            <ButtonLabel>Learn More →</ButtonLabel>
                          </StyledButton>
                        </motion.div>
                      </div>
                    </div>
                    {data.likesCount > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "27.5px",
                          right: "10px",
                          color: "#edeeef",
                          fontSize: "0.8em",
                          zIndex: 150,
                        }}
                      >
                        Likes: {data.likesCount}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <div className="btns">
          <CustomArrow
            direction="left"
            onClick={prevSlide}
            imgSrc={LeftArrow}
            label="Previous"
          />
          <CustomArrow
            direction="right"
            onClick={nextSlide}
            imgSrc={RightArrow}
            label="Next"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HonorsTabPage;

// Styled Components for Button
const ButtonPart = styled("span", {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  borderRadius: 8,
});

const ButtonShadow = styled(ButtonPart, {
  background: "hsl(0deg 0% 0% / 0.1)",
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
});

const ButtonLabel = styled("span", {
  fontFamily: "Montserrat",
  fontSize: "14px",
  display: "block",
  position: "relative",
  borderRadius: 5,
  color: "#212529",
  padding: "1rem 1.5rem",
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
});

const StyledButton = styled("button", {
  border: "none",
  fontWeight: 600,
  width: "fit-content",
  cursor: "pointer",
  background: "transparent",
  position: "relative",
  padding: 0,
  transition: "filter 250ms ease-out",

  "&:hover": {
    filter: "brightness(110%)",

    [`& ${ButtonLabel}`]: {
      transform: "translateY(-8px)",
    },

    [`& ${ButtonShadow}`]: {
      transform: "translateY(6px)",
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

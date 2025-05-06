import React from "react";
import { motion } from "framer-motion";
import "../../styles/ProjectTab.css";
import github from "../../assets/img/icons/github.png";
import youtube from "../../assets/img/icons/youtube.png";
import devpost from "../../assets/img/icons/devpost.png";
import web from "../../assets/img/icons/web.png";
import ImagesCarousel from "./ImageCarousel"; // Import ImageCarousel component

const HonorsTab = ({ data, isBatterySavingOn }) => {
  const renderLogos = (urls) => {
    if (!urls) return null; // Check if URLs exist

    return Object.entries(urls).map(([key, value]) => {
      const iconName = getIconForLink(value);
      return (
        <motion.a
          key={key}
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          initial={isBatterySavingOn ? {} : { opacity: 0, scale: 0, rotate: 0 }}
          animate={
            isBatterySavingOn ? {} : { opacity: 1, scale: 1, rotate: 360 }
          }
          transition={
            isBatterySavingOn
              ? {}
              : {
                  delay: 1.7 + 0.4 * key,
                  type: "ease",
                }
          }
          viewport={{ once: true }}
        >
          <motion.img
            src={`${iconName}`}
            alt={`${iconName} logo`}
            className="project-window-logo"
            whileHover={
              isBatterySavingOn
                ? {}
                : {
                    scale: 1.01,
                    rotate: 360,
                  }
            }
            whileTap={
              isBatterySavingOn
                ? {}
                : {
                    scale: 0.99,
                    rotate: 0,
                  }
            }
            transition={
              isBatterySavingOn
                ? {}
                : {
                    type: "ease",
                  }
            }
          />
        </motion.a>
      );
    });
  };

  const getIconForLink = (link) => {
    if (link.includes("github")) return github;
    if (link.includes("youtube") || link.includes("youtu")) return youtube;
    if (link.includes("devpost")) return devpost;
    return web;
  };

  return (
    <>
      <motion.div className="project-window-tab-container">
        {/* Images Section */}
        {data.honorsExperienceImages && (
          <div className="project-image-container">
            <ImagesCarousel
              data={data.honorsExperienceImages} // Repeat images 9 times
              title={data.honorsExperienceTitle || "Honors Experience"}
              isBatterySavingOn={isBatterySavingOn}
            />
          </div>
        )}

        <motion.div
          className="project-window-content"
          initial={isBatterySavingOn ? {} : { opacity: 0, scale: 0.8 }}
          animate={isBatterySavingOn ? {} : { opacity: 1, scale: 1 }}
          transition={isBatterySavingOn ? {} : { delay: 0.5, type: "ease" }}
        >
          {data.honorsExperienceTitle && (
            <motion.h2
              className="project-window-title"
              initial={isBatterySavingOn ? {} : { opacity: 0, scale: 0 }}
              animate={isBatterySavingOn ? {} : { opacity: 1, scale: 1 }}
              transition={isBatterySavingOn ? {} : { delay: 0.7, type: "ease" }}
              viewport={{ once: true }}
            >
              {data.honorsExperienceTitle}
            </motion.h2>
          )}

          {data.honorsExperienceSubTitle &&
            data.honorsExperienceSubTitle !== "NA" && (
              <motion.h3
                className="project-window-subtitle"
                initial={isBatterySavingOn ? {} : { opacity: 0, scale: 0 }}
                animate={isBatterySavingOn ? {} : { opacity: 1, scale: 1 }}
                transition={
                  isBatterySavingOn ? {} : { delay: 0.9, type: "ease" }
                }
                viewport={{ once: true }}
              >
                {data.honorsExperienceSubTitle}
              </motion.h3>
            )}

          {data.honorsExperienceTimeline &&
            data.honorsExperienceTimeline !== "NA" && (
              <motion.h4
                className="project-window-timeline"
                initial={isBatterySavingOn ? {} : { opacity: 0 }}
                animate={isBatterySavingOn ? {} : { opacity: 1 }}
                transition={
                  isBatterySavingOn ? {} : { delay: 1.1, type: "ease" }
                }
                viewport={{ once: true }}
              >
                {data.honorsExperienceTimeline}
              </motion.h4>
            )}

          {data.honorsExperienceTagline &&
            data.honorsExperienceTagline !== "NA" && (
              <motion.h4
                className="project-window-tagline"
                initial={isBatterySavingOn ? {} : { opacity: 0, scale: 0 }}
                animate={isBatterySavingOn ? {} : { opacity: 1, scale: 1 }}
                // drag
                // dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                // dragElastic={0.3}
                // dragTransition={{
                //   bounceStiffness: 250,
                //   bounceDamping: 15,
                // }}
                whileHover={isBatterySavingOn ? {} : { scale: 1.01 }}
                whileTap={
                  isBatterySavingOn
                    ? {}
                    : {
                        scale: 0.98,
                        boxsizing: "border-box",
                        outline: "1px solid limegreen !important",
                      }
                }
                transition={
                  isBatterySavingOn ? {} : { delay: 1.3, type: "ease" }
                }
                viewport={{ once: true }}
              >
                {data.honorsExperienceTagline}
              </motion.h4>
            )}

          {data.honorsExperienceURLs.length > 0 && (
            <motion.div
              className="project-window-urls"
              initial={isBatterySavingOn ? {} : { opacity: 0, scale: 0 }}
              // drag
              // dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              // dragElastic={0.3}
              // dragTransition={{
              //   bounceStiffness: 250,
              //   bounceDamping: 15,
              // }}
              animate={isBatterySavingOn ? {} : { opacity: 1, scale: 1 }}
              whileHover={isBatterySavingOn ? {} : { scale: 1.01 }}
              whileTap={isBatterySavingOn ? {} : { scale: 0.98 }}
              transition={isBatterySavingOn ? {} : { delay: 1.5, type: "ease" }}
              viewport={{ once: true }}
            >
              {renderLogos(data.honorsExperienceURLs)}
            </motion.div>
          )}

          {data.honorsExperienceParagraphs &&
            data.honorsExperienceParagraphs.length > 0 && (
              <motion.div
                className="project-window-paragraphs glass"
                initial={isBatterySavingOn ? {} : { opacity: 0, scale: 0 }}
                animate={isBatterySavingOn ? {} : { opacity: 1, scale: 1 }}
                transition={isBatterySavingOn ? {} : { delay: 2, type: "ease" }}
                viewport={{ once: true }}
              >
                {data.honorsExperienceParagraphs.map((para, index) => (
                  <motion.p
                    key={index}
                    className="project-window-paragraph"
                    initial={isBatterySavingOn ? {} : { opacity: 0, scale: 0 }}
                    animate={isBatterySavingOn ? {} : { opacity: 1, scale: 1 }}
                    transition={
                      isBatterySavingOn ? {} : { delay: 0, type: "ease" }
                    }
                    viewport={{ once: true }}
                  >
                    {para}
                  </motion.p>
                ))}
              </motion.div>
            )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default HonorsTab;

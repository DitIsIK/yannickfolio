import siteData from "../data/site";
import { withPublicPaths } from "../utils/publicPath";

const withSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const fetchExperiences = async () => {
  return siteData.experience.career.map((experience) => ({
    ...experience,
    experienceLink:
      experience.experienceLink || withSlug(experience.experienceTitle),
    experienceImages: withPublicPaths(experience.experienceImages),
  }));
};

export const fetchExperienceByLink = async (experienceLink) => {
  const experience = (await fetchExperiences()).find(
    (item) => item.experienceLink === experienceLink
  );

  return experience || null;
};

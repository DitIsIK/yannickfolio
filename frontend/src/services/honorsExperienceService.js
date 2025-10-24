import siteData from "../data/site";
import { withPublicPaths } from "../utils/publicPath";

const withSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const fetchHonorsExperiences = async () => {
  return siteData.experience.honors.map((honor) => ({
    ...honor,
    honorsExperienceLink:
      honor.honorsExperienceLink || withSlug(honor.honorsExperienceTitle),
    honorsExperienceImages: withPublicPaths(honor.honorsExperienceImages),
  }));
};

export const fetchHonorsExperienceByLink = async (honorsExperienceLink) => {
  const honor = (await fetchHonorsExperiences()).find(
    (item) => item.honorsExperienceLink === honorsExperienceLink
  );

  return honor || null;
};

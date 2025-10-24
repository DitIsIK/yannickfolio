import siteData from "../data/site";

const basePublicUrl = process.env.PUBLIC_URL || "";

const withPublicUrl = (paths = []) =>
  (paths || []).map((path) => `${basePublicUrl}${path}`);

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
    honorsExperienceImages: withPublicUrl(honor.honorsExperienceImages),
  }));
};

export const fetchHonorsExperienceByLink = async (honorsExperienceLink) => {
  const honor = (await fetchHonorsExperiences()).find(
    (item) => item.honorsExperienceLink === honorsExperienceLink
  );

  return honor || null;
};

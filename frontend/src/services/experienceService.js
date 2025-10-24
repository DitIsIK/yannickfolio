import siteData from "../data/site";

const basePublicUrl = process.env.PUBLIC_URL || "";

const withPublicUrl = (paths = []) =>
  (paths || []).map((path) => `${basePublicUrl}${path}`);

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
    experienceImages: withPublicUrl(experience.experienceImages),
  }));
};

export const fetchExperienceByLink = async (experienceLink) => {
  const experience = (await fetchExperiences()).find(
    (item) => item.experienceLink === experienceLink
  );

  return experience || null;
};

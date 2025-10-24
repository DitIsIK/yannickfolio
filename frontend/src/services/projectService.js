import siteData from "../data/site";

const basePublicUrl = process.env.PUBLIC_URL || "";

const withPublicUrl = (paths = []) =>
  (paths || []).map((path) => `${basePublicUrl}${path}`);

export const fetchProjects = async () => {
  return siteData.projects.map((project) => ({
    ...project,
    projectImages: withPublicUrl(project.projectImages),
  }));
};

export const fetchProjectByLink = async (projectLink) => {
  const project = siteData.projects.find(
    (item) => item.projectLink === projectLink
  );
  return project
    ? { ...project, projectImages: withPublicUrl(project.projectImages) }
    : null;
};

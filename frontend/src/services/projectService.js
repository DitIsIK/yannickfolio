import siteData from "../data/site";
import { withPublicPaths } from "../utils/publicPath";

export const fetchProjects = async () => {
  return siteData.projects.map((project) => ({
    ...project,
    projectImages: withPublicPaths(project.projectImages),
  }));
};

export const fetchProjectByLink = async (projectLink) => {
  const project = siteData.projects.find(
    (item) => item.projectLink === projectLink
  );
  return project
    ? { ...project, projectImages: withPublicPaths(project.projectImages) }
    : null;
};

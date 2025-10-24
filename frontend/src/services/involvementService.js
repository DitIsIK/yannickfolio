import siteData from "../data/site";
import { withPublicPaths } from "../utils/publicPath";

const withSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const fetchInvolvements = async () => {
  return siteData.experience.involvements.map((involvement) => ({
    ...involvement,
    involvementLink:
      involvement.involvementLink || withSlug(involvement.involvementTitle),
    involvementImages: withPublicPaths(involvement.involvementImages),
  }));
};

export const fetchInvolvementByLink = async (involvementLink) => {
  const involvement = (await fetchInvolvements()).find(
    (item) => item.involvementLink === involvementLink
  );

  return involvement || null;
};

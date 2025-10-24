import siteData from "../data/site";

const basePublicUrl = process.env.PUBLIC_URL || "";

const withPublicUrl = (paths = []) =>
  (paths || []).map((path) => `${basePublicUrl}${path}`);

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
    involvementImages: withPublicUrl(involvement.involvementImages),
  }));
};

export const fetchInvolvementByLink = async (involvementLink) => {
  const involvement = (await fetchInvolvements()).find(
    (item) => item.involvementLink === involvementLink
  );

  return involvement || null;
};

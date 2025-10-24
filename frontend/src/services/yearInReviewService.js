import siteData from "../data/site";

const basePublicUrl = process.env.PUBLIC_URL || "";

const withPublicUrl = (paths = []) =>
  (paths || []).map((path) => `${basePublicUrl}${path}`);

const withSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const fetchYearInReviews = async () => {
  return siteData.experience.yearInReview.map((review) => ({
    ...review,
    yearInReviewLink:
      review.yearInReviewLink || withSlug(review.yearInReviewTitle),
    yearInReviewImages: withPublicUrl(review.yearInReviewImages),
  }));
};

export const fetchYearInReviewByLink = async (yearInReviewLink) => {
  const review = (await fetchYearInReviews()).find(
    (item) => item.yearInReviewLink === yearInReviewLink
  );

  return review || null;
};

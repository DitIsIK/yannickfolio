import siteData from "../data/site";
import { withPublicPaths } from "../utils/publicPath";

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
    yearInReviewImages: withPublicPaths(review.yearInReviewImages),
  }));
};

export const fetchYearInReviewByLink = async (yearInReviewLink) => {
  const review = (await fetchYearInReviews()).find(
    (item) => item.yearInReviewLink === yearInReviewLink
  );

  return review || null;
};

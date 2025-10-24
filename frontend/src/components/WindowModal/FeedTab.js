import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import siteData from "../../data/site";
import "../../styles/FeedTab.css";

const PREVIEW_LIMIT = 180;

const normaliseFeed = (feedItems = []) =>
  feedItems.map((item, index) => ({
    ...item,
    id: `${index}-${item.feedTitle}`,
    feedCategory: Array.isArray(item.feedCategory)
      ? item.feedCategory.filter(Boolean)
      : item.feedCategory
      ? [item.feedCategory]
      : [],
  }));

const FeedTab = () => {
  const feeds = useMemo(() => normaliseFeed(siteData.feed), []);
  const [expandedFeeds, setExpandedFeeds] = useState({});

  const toggleReadMore = (feedId) => {
    setExpandedFeeds((prev) => ({ ...prev, [feedId]: !prev[feedId] }));
  };

  const truncatedDescription = (text = "", isExpanded = false) => {
    if (isExpanded || text.length <= PREVIEW_LIMIT) {
      return text;
    }

    return `${text.slice(0, PREVIEW_LIMIT)}…`;
  };

  return (
    <>
      <h1 className="feed-tab-title">Yannick&apos;s Feed</h1>

      <div className="feed-tab">
        <p className="feed-tab-description">
          Updates over projecten, studie en inspiratie. Allemaal rechtstreeks
          uit de contentconfig.
        </p>

        <div className="feed-items">
          {feeds.map((feed, index) => {
            const isExpanded = expandedFeeds[feed.id];
            const description = feed.feedDescription || "";

            return (
              <motion.div
                key={feed.id}
                className="feed-item glass"
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 * index, type: "spring", stiffness: 120 }}
              >
                <div className="feed-item-container">
                  <div className="feed-item-header">
                    <h2 className="feed-item-title">{feed.feedTitle}</h2>

                    {feed.feedCategory.length > 0 && (
                      <div className="feed-item-categories">
                        {feed.feedCategory.map((category) => (
                          <span key={category} className="feed-category">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="feed-item-content project-window-tagline">
                    {truncatedDescription(description, isExpanded)}
                  </p>

                  {description.length > PREVIEW_LIMIT && (
                    <button
                      type="button"
                      className="read-more-btn"
                      onClick={() => toggleReadMore(feed.id)}
                    >
                      {isExpanded ? "Minder" : "Meer"}
                    </button>
                  )}

                  {feed.feedLink && (
                    <a
                      className="feed-link-btn"
                      href={feed.feedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span aria-hidden="true" className="feed-link-icon">
                        ↗
                      </span>
                      <span className="sr-only">Open link in nieuw tabblad</span>
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FeedTab;

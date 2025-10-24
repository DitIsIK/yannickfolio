import React, { useState, useEffect, useRef } from "react";
import {
  FaSignOutAlt,
  FaDatabase,
  FaArrowLeft,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import axios from "axios";
import "../../styles/AdminConsole.css";

const API_URL = process.env.REACT_APP_API_URI;

const tables = [
  { title: "Skills", key: "skillsCollection" },
  { title: "Skill Graph", key: "skillsTable" },
  { title: "Projects", key: "projectTable" },
  { title: "Experiences", key: "experienceTable" },
  { title: "Involvements", key: "involvementTable" },
  { title: "Honors", key: "honorsExperienceTable" },
  { title: "Year In Reviews", key: "yearInReviewTable" },
  { title: "Admin Management", key: "KartavyaPortfolio" },
  { title: "Feeds", key: "FeedTable" },
];

const routeMap = {
  projectTable: "project",
  experienceTable: "experience",
  involvementTable: "involvement",
  honorsExperienceTable: "honorsexperience",
  yearInReviewTable: "yearinreview",
  skillsCollection: "skill",
  skillsTable: "skillcomponent",
  FeedTable: "Feed",
};

const AdminConsole = ({ logout }) => {
  const [collectionCounts, setCollectionCounts] = useState({});
  const [selectedTable, setSelectedTable] = useState(null);
  const [items, setItems] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null); // index of expanded item
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [activeFormData, setActiveFormData] = useState(null);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminCurrentPassword, setAdminCurrentPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const formRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_URL}/collection-counts`).then((res) => {
      setCollectionCounts(res.data);
    });
  }, []);

  // Fetch items whenever a table is selected
  useEffect(() => {
    if (!selectedTable) return;
    // Reset any open forms when switching tables
    setExpandedItem(null);
    setNewItemOpen(false);
    setActiveFormData(null);
    setAdminError("");
    if (selectedTable.key === "KartavyaPortfolio") {
      // User Management (admin credentials) – no items to fetch
      setItems([]);
    } else {
      let endpoint = "";
      switch (selectedTable.key) {
        case "skillsCollection":
          endpoint = "/getskills";
          break;
        case "skillsTable":
          endpoint = "/getskillcomponents";
          break;
        case "projectTable":
          endpoint = "/getprojects";
          break;
        case "experienceTable":
          endpoint = "/getexperiences";
          break;
        case "involvementTable":
          endpoint = "/getinvolvements";
          break;
        case "honorsExperienceTable":
          endpoint = "/gethonorsexperiences";
          break;
        case "yearInReviewTable":
          endpoint = "/getyearinreviews";
          break;
        case "FeedTable": // <-- Add this case
          endpoint = "/getFeeds";
          break;
        default:
          endpoint = "";
      }
      if (endpoint) {
        axios
          .get(`${API_URL}${endpoint}`)
          .then((res) => setItems(res.data))
          .catch((err) => {
            console.error("Error fetching items:", err);
            setItems([]);
          });
      }
    }
  }, [selectedTable]);

  // Close expanded item/new form when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setExpandedItem(null);
        setNewItemOpen(false);
        setActiveFormData(null);
        setAdminError("");
      }
    };
    if (expandedItem !== null || newItemOpen) {
      document.addEventListener("mousedown", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [expandedItem, newItemOpen]);

  const isFormComplete = (dataObj) => {
    if (!dataObj) return false;
    // If it's a Feed item, only require feedTitle and feedCategory.
    if (dataObj.hasOwnProperty("feedTitle")) {
      return Boolean(dataObj.feedTitle) && Boolean(dataObj.feedCategory);
    }
    // For other items, use the default check.
    return Object.entries(dataObj).every(([key, value]) => {
      if (key.toLowerCase().includes("subtitle")) {
        return value !== undefined;
      }
      if (Array.isArray(value)) {
        if (value.length === 0) return false;
        return value.every((item) => {
          if (typeof item === "object" && item !== null) {
            return Object.values(item).every(
              (val) => val !== "" && val !== undefined
            );
          } else {
            return item !== "" && item !== undefined;
          }
        });
      }
      return value !== "" && value !== undefined;
    });
  };

  const handleExpandItem = (index) => {
    setNewItemOpen(false);
    setExpandedItem(index);
    const itemCopy = JSON.parse(JSON.stringify(items[index]));
    setActiveFormData(itemCopy);
  };

  const handleFieldChange = (
    field,
    value,
    nestedIndex = null,
    nestedField = null
  ) => {
    setActiveFormData((prev) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      if (Array.isArray(newData[field]) && nestedIndex !== null) {
        if (nestedField) {
          newData[field][nestedIndex][nestedField] =
            field === "Scores" ? Number(value) : value;
        } else {
          newData[field][nestedIndex] =
            field === "Scores" ? Number(value) : value;
        }
      } else {
        newData[field] = field === "Scores" ? Number(value) : value;
      }
      return newData;
    });
  };

  const handleAddListItem = (field) => {
    setActiveFormData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev };
      if (!Array.isArray(newData[field])) {
        newData[field] = [];
      }
      if (field.toLowerCase() === "skills") {
        newData[field].push({ logo: "", name: "", proficiency: "" });
      } else if (field === "Labels" || field === "Scores") {
        const otherField = field === "Labels" ? "Scores" : "Labels";
        if (!Array.isArray(newData[otherField])) newData[otherField] = [];
        newData[field].push(field === "Labels" ? "" : 0);
        newData[otherField].push(field === "Labels" ? 0 : "");
      } else {
        newData[field].push("");
      }
      return newData;
    });
  };

  const handleRemoveListItem = (field, index) => {
    setActiveFormData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev };
      if (!Array.isArray(newData[field])) return newData;
      if (field === "Labels" || field === "Scores") {
        if (newData.Labels) newData.Labels.splice(index, 1);
        if (newData.Scores) newData.Scores.splice(index, 1);
      } else {
        newData[field].splice(index, 1);
      }
      return newData;
    });
  };

  const handleBack = () => {
    setSelectedTable(null);
    setItems([]);
    setExpandedItem(null);
    setNewItemOpen(false);
    setActiveFormData(null);
    setAdminError("");
  };

  const initializeNewItemData = () => {
    if (!selectedTable) return {};
    const key = selectedTable.key;
    let template = {};
    if (items.length > 0) {
      Object.keys(items[0]).forEach((k) => {
        if (k === "_id" || k === "deleted") return;
        const val = items[0][k];
        if (Array.isArray(val)) {
          if (val.length && typeof val[0] === "object") {
            const blankObj = {};
            Object.keys(val[0]).forEach((subKey) => (blankObj[subKey] = ""));
            template[k] = [];
          } else {
            template[k] = [];
          }
        } else {
          template[k] = "";
        }
      });
    } else {
      switch (key) {
        case "projectTable":
          template = {
            projectTitle: "",
            projectLink: "",
            projectImages: [""],
            projectSubTitle: "",
            projectTimeline: "",
            projectTagline: "",
            projectParagraphs: [""],
            projectURLs: [""],
          };
          break;
        case "experienceTable":
          template = {
            experienceTitle: "",
            experienceLink: "",
            experienceImages: [""],
            experienceSubTitle: "",
            experienceTimeline: "",
            experienceTagline: "",
            experienceParagraphs: [""],
            experienceURLs: [""],
          };
          break;
        case "involvementTable":
          template = {
            involvementTitle: "",
            involvementLink: "",
            involvementImages: [""],
            involvementSubTitle: "",
            involvementTimeline: "",
            involvementTagline: "",
            involvementParagraphs: [""],
            involvementURLs: [""],
          };
          break;
        case "honorsExperienceTable":
          template = {
            honorsExperienceTitle: "",
            honorsExperienceLink: "",
            honorsExperienceImages: [""],
            honorsExperienceSubTitle: "",
            honorsExperienceTimeline: "",
            honorsExperienceTagline: "",
            honorsExperienceParagraphs: [""],
            honorsExperienceURLs: [""],
          };
          break;
        case "yearInReviewTable":
          template = {
            yearInReviewTitle: "",
            yearInReviewLink: "",
            yearInReviewImages: [""],
            yearInReviewSubTitle: "",
            yearInReviewTimeline: "",
            yearInReviewTagline: "",
            yearInReviewParagraphs: [""],
            yearInReviewURLs: [""],
          };
          break;
        case "skillsCollection":
          template = {
            title: "",
            description: "",
            skills: [],
          };
          break;
        case "skillsTable":
          template = {
            skillTitle: "",
            skillDescription: "",
            Labels: [""],
            Scores: [0],
          };
          break;
        default:
          template = {};
      }
    }
    return template;
  };

  const handleAddNew = () => {
    if (!selectedTable) return;
    setExpandedItem(null);
    const newItem = initializeNewItemData();
    setActiveFormData(newItem);
    setNewItemOpen(true);
  };

  const handleSubmitNew = async () => {
    if (!selectedTable || !activeFormData) return;
    try {
      const base =
        routeMap[selectedTable.key] || selectedTable.key.toLowerCase();
      const res = await axios.post(`${API_URL}/add${base}`, activeFormData, {
        withCredentials: true,
      });
      if (res.data && res.data.success) {
        if (res.data.newItem) {
          setItems((prev) => [res.data.newItem, ...prev]);
        }
        setCollectionCounts((prev) => ({
          ...prev,
          [selectedTable.key]: (prev[selectedTable.key] || 0) + 1,
        }));
        setNewItemOpen(false);
        setActiveFormData(null);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (expandedItem === null || !selectedTable || !activeFormData) return;
    const itemId = items[expandedItem]._id;
    try {
      const base =
        routeMap[selectedTable.key] || selectedTable.key.toLowerCase();
      // Remove _id from payload so that MongoDB won't try to update it.
      const { _id, ...updateData } = activeFormData;
      const res = await axios.put(
        `${API_URL}/update${base}/${itemId}`,
        updateData
      );
      if (res.data && res.data.success) {
        setItems((prev) => {
          const updatedList = [...prev];
          updatedList[expandedItem] = activeFormData;
          return updatedList;
        });
        setExpandedItem(null);
        setActiveFormData(null);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeleteItem = async (index) => {
    if (!selectedTable || index == null) return;
    const itemId = items[index]._id;
    if (
      !window.confirm(
        `Do you want to delete "${
          items[index].projectTitle ||
          items[index].experienceTitle ||
          items[index].involvementTitle ||
          items[index].honorsExperienceTitle ||
          items[index].yearInReviewTitle ||
          items[index].title
        }"?`
      )
    )
      return;
    try {
      const base =
        routeMap[selectedTable.key] || selectedTable.key.toLowerCase();
      const res = await axios.delete(`${API_URL}/delete${base}/${itemId}`);
      if (res.data && res.data.success) {
        setItems((prev) => prev.filter((_, i) => i !== index));
        setCollectionCounts((prev) => ({
          ...prev,
          [selectedTable.key]: Math.max((prev[selectedTable.key] || 1) - 1, 0),
        }));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleResetChanges = () => {
    if (expandedItem !== null) {
      const original = JSON.parse(JSON.stringify(items[expandedItem]));
      setActiveFormData(original);
    } else if (newItemOpen) {
      const blank = initializeNewItemData();
      setActiveFormData(blank);
    }
  };

  const handleAdminSubmit = async () => {
    setAdminError("");
    if (!adminUsername || !adminPassword || !adminCurrentPassword) {
      setAdminError("All fields are required.");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/setAdminCredentials`, {
        userName: adminUsername,
        password: adminPassword,
        currentPassword: adminCurrentPassword,
      });
      if (res.data && res.data.success) {
        alert("Admin credentials updated successfully.");
        setAdminUsername("");
        setAdminPassword("");
        setAdminCurrentPassword("");
      }
    } catch (error) {
      console.error("Error updating admin credentials:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setAdminError(error.response.data.message);
      } else {
        setAdminError("Failed to update credentials.");
      }
    }
  };

  return (
    <div className="admin-console">
      <div className="admin-title-bar">
        {selectedTable && (
          <button className="back-btn" onClick={handleBack}>
            <FaArrowLeft />
          </button>
        )}
        <div className="admin-title">Admin Database Explorer</div>
        <div className="admin-btn-group">
          <button
            className="db-btn"
            onClick={() =>
              window.open(
                "https://cloud.mongodb.com/v2/672950dc517fd96235a1c212#/metrics/replicaSet/672951f5bf98b168a06dfdb4/explorer/KartavyaPortfolioDB",
                "_blank"
              )
            }
          >
            <FaDatabase />
          </button>
          <button
            className="logout-btn close"
            onClick={() => window.confirm("Confirm logout?") && logout()}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      {!selectedTable ? (
        <div className="admin-dashboard">
          {tables.map((table) => (
            <div
              key={table.key}
              className="dashboard-box glass"
              onClick={() => setSelectedTable(table)}
            >
              <h3>{table.title}</h3>
              <span className="count">
                {collectionCounts[table.key] || 0} Items
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="expanded-view">
          <h2>{selectedTable.title}</h2>
          {selectedTable.key !== "KartavyaPortfolio" && (
            <span className="count">
              Total Items: {collectionCounts[selectedTable.key] || 0}
            </span>
          )}
          {selectedTable.key !== "KartavyaPortfolio" && (
            <button className="add-item-btn" onClick={handleAddNew}>
              <FaPlus /> Add New
            </button>
          )}

          {selectedTable.key === "KartavyaPortfolio" && (
            <div className="admin-credentials-form">
              <h3>Update Admin Credentials</h3>
              <input
                type="text"
                placeholder="New Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Current Password"
                value={adminCurrentPassword}
                onChange={(e) => setAdminCurrentPassword(e.target.value)}
              />
              <button
                className="save-btn"
                onClick={handleAdminSubmit}
                disabled={
                  !adminUsername || !adminPassword || !adminCurrentPassword
                }
              >
                Update Credentials
              </button>
              {adminError && <p className="danger">{adminError}</p>}
            </div>
          )}

          {selectedTable.key !== "KartavyaPortfolio" && (
            <div className="item-list">
              {newItemOpen && activeFormData && (
                <div className="item-card new-item-card" ref={formRef}>
                  <h3>Add New {selectedTable.title.slice(0, -1)}</h3>
                  <div className="item-details">
                    {Object.keys(activeFormData).map((field) => {
                      if (field === "_id" || field === "deleted") return null;

                      // For feedImageURL in FeedTable, render a file upload input.
                      if (
                        selectedTable.key === "FeedTable" &&
                        field === "feedImageURL"
                      ) {
                        return (
                          <div className="field" key={field}>
                            <label>{field} (Enter URL or upload file)</label>
                            {/* If editing and an image is already set, show a preview */}
                            {activeFormData[field] &&
                              typeof activeFormData[field] === "object" && (
                                <img
                                  src={
                                    activeFormData[field].data.startsWith(
                                      "data:"
                                    )
                                      ? activeFormData[field].data
                                      : `data:${activeFormData[field].contentType};base64,${activeFormData[field].data}`
                                  }
                                  alt="Preview"
                                  style={{
                                    maxWidth: "100%",
                                    marginBottom: "10px",
                                  }}
                                  loading="lazy"
                                  width={320}
                                  height={180}
                                />
                              )}
                            {/* Text input for entering an image URL */}
                            <input
                              type="text"
                              placeholder="Enter image URL"
                              value={
                                typeof activeFormData[field] === "string"
                                  ? activeFormData[field]
                                  : ""
                              }
                              onChange={(e) =>
                                handleFieldChange(field, e.target.value)
                              }
                            />
                            {/* File input for uploading an image */}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    // Update activeFormData for feedImageURL with the file data and MIME type
                                    handleFieldChange(field, {
                                      data: reader.result,
                                      contentType: file.type,
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        );
                      }

                      // Default rendering for non-list fields (or list fields)
                      const value = activeFormData[field];
                      const isList = Array.isArray(value);
                      return (
                        <div className="field" key={field}>
                          <label>{field}</label>
                          {!isList ? (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                handleFieldChange(field, e.target.value)
                              }
                            />
                          ) : (
                            // (Your existing code for rendering list fields)
                            <div className="list-field">
                              {value.map((item, idx) => (
                                <div className="list-item" key={idx}>
                                  {typeof item === "object" && item !== null ? (
                                    Object.keys(item).map((subKey) => (
                                      <input
                                        key={subKey}
                                        type="text"
                                        placeholder={subKey}
                                        value={item[subKey]}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            field,
                                            e.target.value,
                                            idx,
                                            subKey
                                          )
                                        }
                                      />
                                    ))
                                  ) : (
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          field,
                                          e.target.value,
                                          idx
                                        )
                                      }
                                    />
                                  )}
                                  <button
                                    type="button"
                                    className="list-remove-btn"
                                    onClick={() =>
                                      handleRemoveListItem(field, idx)
                                    }
                                  >
                                    <FaMinus />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="list-add-btn"
                                onClick={() => handleAddListItem(field)}
                              >
                                <FaPlus />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="item-actions">
                    <button
                      className="save-btn"
                      onClick={handleSubmitNew}
                      disabled={!isFormComplete(activeFormData)}
                    >
                      Add to Database
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={handleResetChanges}
                    >
                      Reset Changes
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={() => {
                        setNewItemOpen(false);
                        setActiveFormData(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {items.map((item, index) => {
                const titleField =
                  Object.keys(item).find(
                    (k) =>
                      k.toLowerCase().includes("title") &&
                      !k.toLowerCase().includes("description")
                  ) || "title";
                const itemTitle = item[titleField] || "Untitled";
                return (
                  <div className="item-card" key={item._id || index}>
                    <div
                      className="item-title"
                      onClick={() => handleExpandItem(index)}
                    >
                      {itemTitle}
                    </div>
                    {expandedItem === index && activeFormData && (
                      <div className="item-details" ref={formRef}>
                        {Object.keys(activeFormData).map((field) => {
                          if (field === "_id" || field === "deleted")
                            return null;
                          const value = activeFormData[field];
                          const isList = Array.isArray(value);
                          return (
                            <div className="field" key={field}>
                              <label>{field}</label>
                              {!isList ? (
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) =>
                                    handleFieldChange(field, e.target.value)
                                  }
                                />
                              ) : field === "Labels" &&
                                activeFormData.Scores ? (
                                <div className="list-field">
                                  {activeFormData.Labels.map((lbl, idx) => (
                                    <div className="list-item" key={idx}>
                                      <input
                                        type="text"
                                        placeholder="Label"
                                        value={lbl}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            "Labels",
                                            e.target.value,
                                            idx
                                          )
                                        }
                                      />
                                      <input
                                        type="text"
                                        placeholder="Score"
                                        value={activeFormData.Scores[idx]}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            "Scores",
                                            e.target.value,
                                            idx
                                          )
                                        }
                                      />
                                      <button
                                        type="button"
                                        className="list-remove-btn"
                                        onClick={() =>
                                          handleRemoveListItem("Labels", idx)
                                        }
                                      >
                                        <FaMinus />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    className="list-add-btn"
                                    onClick={() => handleAddListItem("Labels")}
                                  >
                                    <FaPlus />
                                  </button>
                                </div>
                              ) : (
                                <div className="list-field">
                                  {value.map((itemVal, idx) => (
                                    <div className="list-item" key={idx}>
                                      {typeof itemVal === "object" &&
                                      itemVal !== null ? (
                                        Object.keys(itemVal).map((subKey) => (
                                          <input
                                            key={subKey}
                                            type="text"
                                            placeholder={subKey}
                                            value={itemVal[subKey]}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                field,
                                                e.target.value,
                                                idx,
                                                subKey
                                              )
                                            }
                                          />
                                        ))
                                      ) : (
                                        <input
                                          type="text"
                                          value={itemVal}
                                          onChange={(e) =>
                                            handleFieldChange(
                                              field,
                                              e.target.value,
                                              idx
                                            )
                                          }
                                        />
                                      )}
                                      <button
                                        type="button"
                                        className="list-remove-btn"
                                        onClick={() =>
                                          handleRemoveListItem(field, idx)
                                        }
                                      >
                                        <FaMinus />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    className="list-add-btn"
                                    onClick={() => handleAddListItem(field)}
                                  >
                                    <FaPlus />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div className="item-actions">
                          <button
                            className="save-btn"
                            onClick={handleSaveChanges}
                            disabled={!isFormComplete(activeFormData)}
                          >
                            Save Changes
                          </button>
                          <button
                            className="secondary-btn"
                            onClick={handleResetChanges}
                          >
                            Reset Changes
                          </button>
                          <button
                            className="secondary-btn"
                            onClick={() => {
                              setExpandedItem(null);
                              setActiveFormData(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="secondary-btn delete-btn"
                            onClick={() => handleDeleteItem(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminConsole;

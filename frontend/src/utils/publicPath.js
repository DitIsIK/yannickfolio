const externalPattern = /^(?:[a-z]+:|\/\/|#|\?)/i;

export const withPublicPath = (path = "") => {
  if (!path || externalPattern.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\//, "");
  const publicUrl = process.env.PUBLIC_URL;

  if (!publicUrl || publicUrl === "/") {
    return normalizedPath;
  }

  const normalizedBase = publicUrl.replace(/\/$/, "");
  return `${normalizedBase}/${normalizedPath}`;
};

export const withPublicPaths = (paths = []) =>
  (paths || []).map((item) => withPublicPath(item));

export default withPublicPath;

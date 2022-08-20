const compileURL = (path?: string) => {
  let basePath = "http://localhost:3000";
  switch (process.env.NEXT_ENV) {
    case "production":
      basePath = "https://www.maxrux.dev";
      break;
    default:
      break;
  }
  return path
    ? path.startsWith("/")
      ? `${basePath}${path}`
      : `${basePath}/${path}`
    : `${basePath}/`;
};
export default compileURL;

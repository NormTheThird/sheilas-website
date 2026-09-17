import { Layout } from "./Layout";
import { matchRoute } from "./routes";
import "./styles.css";

export function App({ path }: { path: string }) {
  const route = matchRoute(path);
  return <Layout currentPath={route.path}>{route.element()}</Layout>;
}

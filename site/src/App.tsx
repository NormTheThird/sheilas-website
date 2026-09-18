import { Layout } from "./Layout";
import { matchRoute } from "./routes";
import "./styles.css";

export function App({ path }: { path: string }) {
  const route = matchRoute(path);
  if (route.standalone) {
    return route.element();
  }
  return <Layout currentPath={route.path}>{route.element()}</Layout>;
}

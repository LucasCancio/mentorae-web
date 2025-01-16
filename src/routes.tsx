import { BrowserRouter, Routes as RoutesRouterDom, Route } from "react-router";
import { Home } from "./pages/Home";

function Routes() {
  return (
    <BrowserRouter>
      <RoutesRouterDom>
        <Route path="/" element={<Home />} />
        {/*  <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<RecentActivity />} />
          <Route path="project/:id" element={<Project />} />
        </Route> */}
      </RoutesRouterDom>
    </BrowserRouter>
  );
}

export default Routes;

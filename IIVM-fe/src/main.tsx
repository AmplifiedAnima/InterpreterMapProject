import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Router/Router";
import "./index.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

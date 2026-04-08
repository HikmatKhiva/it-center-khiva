import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "@/Router.tsx";
import { RouterProvider } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import { persistor, store } from "@/lib/redux/app.ts";
// devtool
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// persist
import { PersistGate } from "redux-persist/integration/react";
// css imports
import "@/css/index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import { SocketProvider } from "./context/SocketContext";
// import NavigationProgressComponent from "./loading/NavigationProgressComponent.tsx";
// Create a client
const queryClient = new QueryClient();
const theme = createTheme({
  breakpoints: {},
  fontSizes: {
    lg: "16px",
  },
  /** Put your mantine theme override here */
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* tanstack query wrapper */}
    <QueryClientProvider client={queryClient}>
      {/* mantine ui wrapper */}
      <MantineProvider theme={theme}>
        {/* redux wrapper */}
        <Provider store={store}>
          {/* socket provider */}
          <SocketProvider>
            <PersistGate loading={null} persistor={persistor}>
              {/* react-router */}
              <RouterProvider router={routes} />
            </PersistGate>
          </SocketProvider>
        </Provider>
        {/* mantine notification component */}
        <Notifications />
      </MantineProvider>
      {/* tanstack query devtool */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);

import { lazy } from "react";
export const LoadHomePage = lazy(() => import("./HomePage"));
export const LoadContactPage = lazy(() => import("./contact/ContactPage"));
export const LoadNewsPage = lazy(() => import("./news/NewsPage"));
export const LoadNewsPreview = lazy(() => import("./news/NewsPreview"));
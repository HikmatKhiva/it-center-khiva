import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/redux/app";
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
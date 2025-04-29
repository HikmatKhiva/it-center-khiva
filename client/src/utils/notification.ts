import React from "react";
import { notifications } from "@mantine/notifications"; // Adjust the import based on your notification library
import { Check, X } from "lucide-react"; // Adjust the import based on your icon library
export const createNotification = (isPending: boolean) => {
  const id = notifications.show({
    loading: isPending,
    title: "Ma'lumotlar uzatilyapti.",
    message: "Iltimos ma'lumotlar uzatilguncha kutib turing!",
    color: "blue",
    position: "top-right",
    withCloseButton: true,
  });
  return id;
};
export const showSuccessNotification = (id: string, message: string) => {
  notifications.update({
    id,
    title: "Ma'lumot mouffaqiyatli uzatildi.",
    message,
    color: "white",
    autoClose: 3000,
    position: "top-right",
    icon: React.createElement(Check, { color: "#93CE03" }),
  });
};
export const showErrorNotification = (id: string, message: string) => {
  notifications.update({
    id,
    title: "Ma'lumot uzatishda xato bo'ldi.",
    message,
    color: "red",
    autoClose: 3000,
    position: "top-right",
    icon: React.createElement(X, { color: "#fff" }),
  });
};
export const customErrorNotification = (message: string) => {
  const id = notifications.show({
    title: message,
    message: "",
    color: "red",
    autoClose: 3000,
    position: "top-right",
    icon: React.createElement(X, { color: "#fff" }),
  });
  return id;
};
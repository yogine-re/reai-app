import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const storeUser = (data: any) => {
  localStorage.setItem(
    "user",
    JSON.stringify({
      username: data.user.username,
      jwt: data.jwt,
    })
  );
};

export const userData = () => {
  const stringifiedUser = localStorage.getItem("user") || '""';
  return JSON.parse(stringifiedUser || "") as { jwt: string };
};

export const Protector = ({ Component }: { Component: React.ComponentType }) => {
  const navigate = useNavigate();

  const { jwt } = userData();

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
    }
  }, [navigate, jwt]);

  return Component;
};

import React from "react";
import { Redirect } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";


export default function Index() {
  return (
    <Redirect href="/(auth)" />
  );
}

"use client"
import { useEffect, useState } from "react";
import App from "./App";
import liff from "@line/liff";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    liff.init({ liffId: "2001004594-ZgKXx6kE" }, () => {
      liff.ready.then(() => {
        liff.isLoggedIn() ? setIsLoggedIn(true) : liff.login()
      });
    });
  }, []);

  return (
    <main className="flex flex-col justify-center items-center h-screen">
      {isLoggedIn ? <App /> : <Loader2 className="animate-spin" size={35} />}
    </main>
  );
}

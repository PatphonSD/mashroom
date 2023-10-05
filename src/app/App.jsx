"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Loader2, Power } from "lucide-react";
import React, { useEffect, useState } from "react";
import liff from "@line/liff";
export default function App() {
  const [serverStatus, setServerStatus] = useState("รอสักครู่...");
  const [mode, setMode] = useState("");
  const changeMode = (e) => {
    if (e === "power") {
      if (mode === "on") setMode("off");
      if (mode === "off" || mode === "auto" || mode === "") setMode("on");
    } else if (e === "auto") {
      if (mode === "auto") {
        setMode("off");
      } else {
        setMode("auto");
      }
    }
  };

  useEffect(() => {
    if (mode === "") {
      setServerStatus("รอสักครู่...");
      fetch("/mqtt", {
        method: "GET",
      })
        .then((res) => {
          res.json().then((data) => {
            setMode(data.data);
            console.log(data.data);
            data.data === "on" && setServerStatus("กำลังทำงาน");
            data.data === "off" && setServerStatus("ปิด");
            data.data === "auto" && setServerStatus("อัตโนมัติ");
            data.data === "" && setServerStatus("ไม่ทราบสถานะ");
          });
        })
        .catch((error) => {
          console.log(error);
          setServerStatus("เครือข่ายขัดข้อง");
        });
    } else {
      setServerStatus("รอสักครู่...");
      fetch("/mqtt", {
        body: JSON.stringify({ data: mode }),
        method: "POST",
      })
        .then((res) => {
          res.json().then((data) => {
            console.log(data.data);
            data.data === "on" && setServerStatus("กำลังทำงาน");
            data.data === "off" && setServerStatus("ปิด");
            data.data === "auto" && setServerStatus("อัตโนมัติ");
            data.data === "" && setServerStatus("ไม่ทราบสถานะ");
          });
        })
        .catch((error) => {
          console.log(error);
          setServerStatus("เครือข่ายขัดข้อง");
        });
    }
  }, [mode]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>ฟาร์มเห็ดอัจฉริยะ</CardTitle>
        <CardDescription>ควบคุมได้อย่างง่ายดายด้วยปลายนิ้ว</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <button
          className={`p-4 transition-all flex flex-col items-center w-full md:w-auto active:scale-95 border rounded-md shadow ${
            mode === "on" && "bg-green-500"
          }`}
          onClick={() => changeMode("power")}
        >
          <Power size={40} />
          <small className="text-center">
            {mode === "on" ? "ปิด" : "เปิด"}
          </small>
        </button>
        <button
          className={`p-4 transition-all flex flex-col items-center w-full md:w-auto active:scale-95 border rounded-md shadow ${
            mode === "auto" && "bg-blue-500"
          }`}
          onClick={() => changeMode("auto")}
        >
          <Bot size={40} />
          <small className="text-center">อัตโนมัติ</small>
        </button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="flex flex-row items-center gap-1">
          {serverStatus === "รอสักครู่..." ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <span
              className={`rounded-md p-1 w-1 h-1 aspect-square ${
                mode === "on"
                  ? "opacity-100 bg-lime-500"
                  : mode === "auto" && "bg-blue-500 opacity-100"
              }`}
            >
              {""}
            </span>
          )}
          <small className="text-neutral-500">{serverStatus}</small>
        </span>
        <Button
          onClick={() => {
            liff.logout();
            window.location.reload();
          }}
          size="sm"
          variant="secondary"
        >
          ออกจากระบบ
        </Button>
      </CardFooter>
    </Card>
  );
}

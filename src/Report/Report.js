import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios, { BASE_URL } from "../services/axios";
import { toast } from "react-toastify";

const Report = () => {
  const location = useLocation();
  const pet = location.state?.pet;
  const petID = pet.petID;
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordingDuration = 7000; // Thời gian quay cố định (7 giây)
  let mediaRecorder;
  let chunks = [];

  // Hàm để bắt đầu ghi hình
  const startRecording = () => {
    if (!videoRef.current.srcObject) {
      console.error("No video stream available for recording.");
      return;
    }

    mediaRecorder = new MediaRecorder(videoRef.current.srcObject);
    mediaRecorder.ondataavailable = function (event) {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = function () {
      const blob = new Blob(chunks, { type: "video/webm" });
      chunks = [];

      // Gửi video lên server
      const formData = new FormData();
      formData.append("videoFile", blob, "recorded-video.webm");

      axios
        .post(`${BASE_URL}pets/report/${petID}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.success(response.data.message);
        })
        .catch((error) => {
          console.error("There was an error uploading the video:", error);
          toast.error(error.response.data.message);
        });

      setIsRecording(false);
    };

    mediaRecorder.start();
    setIsRecording(true);

    // Dừng quay video sau thời gian quy định
    setTimeout(() => {
      mediaRecorder.stop();
    }, recordingDuration); // Dừng sau recordingDuration ms (7 giây)
  };

  // Sử dụng useEffect để truy cập camera ngay khi component được tải
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    // Bắt đầu truy cập camera
    initCamera();

    // Cleanup để tắt camera khi component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      {/* Video element để hiển thị luồng video trực tiếp (xem trước) */}
      <video
        ref={videoRef}
        style={{ width: "500px", height: "400px" }}
        autoPlay
        muted
      ></video>
      <br />
      {/* Nút bắt đầu quay video */}
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
    </div>
  );
};

export default Report;

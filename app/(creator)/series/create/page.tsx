"use client";

import { useRef, useState, useEffect, ChangeEvent, DragEvent } from "react";
import { createSeries, getS3SignedUrl } from "@/app/_lib/actions";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

// 定义类型
type SeriesData = {
  name: string;
  price: string;
  description: string;
  image: string;
};

type StatusType = "idle" | "loading" | "success" | "error";

const Page = () => {
  const { user } = useUser();
  const [series, setSeries] = useState<SeriesData>({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [status, setStatus] = useState<StatusType>("idle");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const upload = async () => {
      const key = `${uuidv4()}${file.name.substring(file.name.lastIndexOf("."))}`;
      const contentType = file.type;
      const { url: postUrl } = await getS3SignedUrl(key, contentType);

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", postUrl, true);
      xhr.setRequestHeader("Content-Type", contentType);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setSeries((prev) => ({
            ...prev,
            image: `https://s3.abandon.ai/${key}`,
          }));
          setUploadProgress(0);
        } else {
          alert("上传失败");
          setUploadProgress(0);
        }
      };

      xhr.onerror = () => {
        alert("上传出错");
        setUploadProgress(0);
      };

      xhr.send(file);
    };

    upload();

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const validateImageFile = (file: File): boolean => {
    const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    return file && acceptedTypes.includes(file.type);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    if (selectedFile && validateImageFile(selectedFile)) {
      setFile(selectedFile);
    } else if (selectedFile) {
      alert("只能上传图片文件 (JPEG, PNG, GIF, WEBP, SVG)");
    }
  };

  const handleClickUpload = (): void => {
    if (!preview && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!preview) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging && !preview) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (preview) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length === 0) return;

    const droppedFile = droppedFiles[0];
    if (droppedFile && validateImageFile(droppedFile)) {
      setFile(droppedFile);
    } else if (droppedFile) {
      alert("只能上传图片文件 (JPEG, PNG, GIF, WEBP, SVG)");
    }
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    setSeries((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto p-8 relative min-h-screen w-full">
      <div className="max-w-[1232px] mx-auto h-8">
        <div className="text-xl font-bold">Create a new series</div>
      </div>
      <div className="flex gap-8 mt-4 mb-[72px] justify-center">
        <div className="w-full max-w-[600px] min-w-[300px]">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <div
            className={`border border-[#DBDBDB] rounded-xl border-dashed w-full aspect-square flex flex-col items-center justify-center relative ${
              isDragging ? "border-blue-500 bg-blue-50" : preview ? "border-solid" : ""
            }`}
            onClick={handleClickUpload}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="w-full h-full relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-xl"
                />
                <button
                  onClick={removeFile}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                  title="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg font-medium">
                  {isDragging ? "松开以上传图片" : "点击或拖拽图片到此处上传"}
                </p>
                <p className="text-sm text-gray-500">封面图片</p>
              </div>
            )}
          </div>
          {uploadProgress > 0 && (
            <div className="w-full px-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">
                上传中... {uploadProgress}%
              </p>
            </div>
          )}
          {
            series.image && (
              <div className="w-full px-6">
                <a href={series.image} target="_blank" className="text-sm text-gray-600 text-center mt-2 underline">
                  {series.image}
                </a>
              </div>
            )
          }
        </div>
        {/* 表单区域 */}
        <div className="w-full flex flex-col max-w-[600px] min-w-[300px]">
          <div>
            <div className="font-bold mb-4 leading-5">Name</div>
            <input
              value={series.name}
              onChange={(e) => setSeries({ ...series, name: e.target.value })}
              placeholder="Series name"
              className="border border-[#DBDBDB] rounded-xl px-3 py-2.5 w-full leading-5"
            />
          </div>
          <div>
            <div className="font-bold my-4 leading-5">Price(USD)</div>
            <input
              value={series.price}
              type="number"
              onChange={(e) => setSeries({ ...series, price: e.target.value })}
              placeholder="Price"
              className="border border-[#DBDBDB] rounded-xl px-3 py-2.5 w-full leading-5"
            />
          </div>
          <div>
            <div className="font-bold my-4 leading-5">Description</div>
            <input
              value={series.description}
              onChange={(e) => setSeries({ ...series, description: e.target.value })}
              placeholder="Description"
              className="border border-[#DBDBDB] rounded-xl px-3 py-2.5 w-full leading-5"
            />
          </div>
          <div className="flex justify-between my-4 items-center">
            <Link href="/series" prefetch className="font-bold text-[#0095F6] px-3 py-1 text-sm">
              Back
            </Link>
            <button
              disabled={status === "loading" || !series.name || !user || !series.image || !series.price || uploadProgress !== 0}
              onClick={async () => {
                if (!user) return;
                setStatus("loading");

                const seriesData = {
                  owner: user.sub as string,
                  unit_amount: Math.floor(Number(series.price) * 100),
                  name: series.name,
                  description: series.description || undefined,
                  image: series.image || undefined,
                };

                const { ok } = await createSeries(seriesData);
                if (ok) {
                  setStatus("success");
                  setSeries({
                    name: "",
                    price: "",
                    description: "",
                    image: "",
                  });
                  setFile(null);
                  setPreview(null);
                  setUploadProgress(0);
                  setTimeout(() => setStatus("idle"), 3000);
                } else {
                  setStatus("error");
                  setTimeout(() => setStatus("idle"), 3000);
                }
              }}
              className={`bg-[#0095F6] text-white w-60 h-11 font-bold rounded-lg flex items-center justify-center ${
                !series.name || !user || !file ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {status === "loading" && "Loading..."}
              {status === "idle" && "Create"}
              {status === "success" && "Success"}
              {status === "error" && "Error"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
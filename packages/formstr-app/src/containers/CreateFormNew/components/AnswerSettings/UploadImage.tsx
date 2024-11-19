import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState, ChangeEvent } from "react";

interface Props {
  onImageUpload?: (url: string) => void;
}

const UploadImage: React.FC<Props> = ({ onImageUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=47b2691c6dca3f52bf6f70029396682d",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.data?.display_url) {
        const url = result.data.display_url;
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        const markdownFormat = `[${fileName}](${url})`;
        onImageUpload?.(markdownFormat);  
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* Ant Design Button that triggers the file input */}
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={handleButtonClick}
        loading={uploading}
        size="large"
        style={{ 
            marginBottom: 16,
            width: '60%',
            height: 40,
            borderRadius: 6,
            marginLeft:12,
            marginTop:10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </Button>

      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default UploadImage;

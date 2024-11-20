import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Input, Tabs } from "antd";
import React, { useState, ChangeEvent, useRef } from "react";

interface Props {
  onImageUpload?: (url: string) => void;
}

const UploadImage: React.FC<Props> = ({ onImageUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const formatImageUrl = (url: string, customName?: string) => {
    const fileName = customName || url.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'image';
    return `[${fileName}](${url})`;
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setUrlInput("");
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      onImageUpload?.(formatImageUrl(urlInput));
      setIsModalOpen(false);
      setUrlInput("");
    }
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
        onImageUpload?.(formatImageUrl(result.data.display_url, file.name));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const items = [
    {
      key: '1',
      label: 'Upload Image',
      children: (
        <div style={{ padding: '20px 0' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            aria-label="File upload"
          />
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleButtonClick}
            loading={uploading}
            size="large"
            style={{ width: '100%' }}
          >
            {uploading ? "Uploading..." : "Click to Upload"}
          </Button>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Image URL',
      children: (
        <div style={{ padding: '20px 0' }}>
          <Input.TextArea
            placeholder="Enter image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ marginBottom: 16 }}
            rows={4}
            aria-label="Image URL input"
          />
          <Button 
            type="primary" 
            onClick={handleUrlSubmit}
            disabled={!urlInput}
            style={{ width: '100%' }}
          >
            Submit URL
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={showModal}
        size="large"
        style={{ 
          marginBottom: 16,
          width: '60%',
          height: 40,
          borderRadius: 6,
          marginLeft: 12,
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Upload Image
      </Button>

      <Modal 
        title="Upload Image" 
        open={isModalOpen} 
        onCancel={handleCancel}
        footer={null}
        modalRender={(modal) => (
          <div ref={modalRef} tabIndex={-1}>
            {modal}
          </div>
        )}
      >
        <Tabs 
          defaultActiveKey="1" 
          items={items}
          centered
        />
      </Modal>

      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Uploaded" 
          style={{ maxWidth: '100%', marginTop: '16px' }}
        />
      )}
    </div>
  );
};

export default UploadImage;
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [petImage, setPetImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 处理文件上传
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // API基础URL
  const API_BASE_URL = 'http://localhost:3001';

  // 处理上传到服务器
  const handleUpload = async () => {
    if (!petImage) {
      setError('请选择宠物照片');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('petImage', petImage);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImageUrl(response.data.filePath);
      setError('');
    } catch (error) {
      setError('上传失败，请重试');
      console.error('上传失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成图片
  const handleGenerateImage = async () => {
    if (!prompt) {
      setError('请输入生成需求');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-image`, {
        prompt,
        imageUrl
      });
      setGeneratedImage(response.data.imageUrl);
      setError('');
    } catch (error) {
      setError('图片生成失败，请重试');
      console.error('生成图片失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成视频
  const handleGenerateVideo = async () => {
    if (!prompt) {
      setError('请输入生成需求');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-video`, {
        prompt,
        imageUrl
      });
      setGeneratedVideo(response.data.videoUrl);
      setError('');
    } catch (error) {
      setError('视频生成失败，请重试');
      console.error('生成视频失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>汪星联络员</h1>
        <p>让我们一起为您的宠物创造美好的回忆</p>
      </div>

      <div className="form-group">
        <label htmlFor="petImage">上传宠物照片</label>
        <input 
          type="file" 
          id="petImage" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        {imageUrl && (
          <div style={{ marginTop: '10px' }}>
            <img 
              src={imageUrl} 
              alt="宠物照片" 
              style={{ maxWidth: '300px', borderRadius: '5px' }}
            />
          </div>
        )}
        <button className="btn" onClick={handleUpload} style={{ marginTop: '10px' }}>
          上传照片
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="prompt">生成需求</label>
        <textarea 
          id="prompt" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="请描述您希望生成的内容，例如：在汪星的草地上奔跑的金毛犬，阳光明媚，周围有花朵..."
        ></textarea>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button className="btn" onClick={handleGenerateImage} style={{ marginRight: '10px' }}>
          生成图片
        </button>
        <button className="btn" onClick={handleGenerateVideo}>
          生成视频
        </button>
      </div>

      {loading && <div className="loading">生成中，请稍候...</div>}
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {generatedImage && (
        <div className="result-area">
          <h3>生成的图片</h3>
          <img 
            src={generatedImage} 
            alt="生成的图片" 
            className="result-image"
          />
          <a 
            href={generatedImage} 
            download="generated-image.png" 
            className="btn" 
            style={{ marginTop: '10px' }}
          >
            下载图片
          </a>
        </div>
      )}

      {generatedVideo && (
        <div className="result-area">
          <h3>生成的视频</h3>
          <video 
            src={generatedVideo} 
            controls 
            className="result-video"
          ></video>
          <a 
            href={generatedVideo} 
            download="generated-video.mp4" 
            className="btn" 
            style={{ marginTop: '10px' }}
          >
            下载视频
          </a>
        </div>
      )}

      <div className="footer">
        <p>© 2026 汪星联络员 | 让每一个宠物都能在汪星快乐生活</p>
      </div>
    </div>
  );
}

export default App;

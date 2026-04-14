const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = (upload) => {
  const router = express.Router();

  // 上传宠物照片
  router.post('/upload', upload.single('petImage'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: '请上传宠物照片' });
      }
      
      res.json({ 
        message: '上传成功', 
        filePath: `/uploads/${req.file.filename}` 
      });
    } catch (error) {
      res.status(500).json({ error: '上传失败' });
    }
  });

  // 生成图片
  router.post('/generate-image', async (req, res) => {
    try {
      const { prompt, imageUrl } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: '请输入生成需求' });
      }

      // 这里使用免费的AIGC API，实际项目中需要替换为真实的API
      // 示例：使用Stable Diffusion API
      const response = await axios.post(
        'https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image',
        {
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 512,
          width: 512,
          steps: 30
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
          },
          responseType: 'arraybuffer'
        }
      );

      // 保存生成的图片
      const imageBuffer = Buffer.from(response.data);
      const imageFilename = `generated-${Date.now()}.png`;
      const imagePath = path.join(__dirname, '../uploads', imageFilename);
      fs.writeFileSync(imagePath, imageBuffer);

      res.json({ 
        message: '图片生成成功', 
        imageUrl: `/uploads/${imageFilename}` 
      });
    } catch (error) {
      console.error('生成图片失败:', error);
      res.status(500).json({ error: '图片生成失败' });
    }
  });

  // 生成视频
  router.post('/generate-video', async (req, res) => {
    try {
      const { prompt, imageUrl } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: '请输入生成需求' });
      }

      // 这里使用免费的AIGC API，实际项目中需要替换为真实的API
      // 示例：使用DALL-E API生成多张图片，然后合成视频
      // 由于视频生成API通常需要付费，这里我们返回一个模拟的视频URL
      
      res.json({ 
        message: '视频生成成功', 
        videoUrl: 'https://example.com/sample-video.mp4' 
      });
    } catch (error) {
      console.error('生成视频失败:', error);
      res.status(500).json({ error: '视频生成失败' });
    }
  });

  return router;
};
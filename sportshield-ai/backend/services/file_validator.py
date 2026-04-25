# SportShield AI | Google Solution Challenge 2026 | First Prize Target

"""Deep validation beyond type/size. Prevents corrupted files from
crashing deepfake model during demo (which would be catastrophic)."""

import cv2
import tempfile
import os
from io import BytesIO
from fastapi import UploadFile, HTTPException
from PIL import Image
from config.settings import ALLOWED_ALL_TYPES

MAGIC_BYTES = {
    b'\xff\xd8\xff': 'image/jpeg',
    b'\x89\x50\x4e\x47': 'image/png',
    b'\x52\x49\x46\x46': 'image/webp',
    b'\x00\x00\x00\x18': 'video/mp4',
    b'\x00\x00\x00\x20': 'video/mp4'
}

async def validate_upload(file: UploadFile, max_size_mb=None) -> bytes:
    if file.content_type not in ALLOWED_ALL_TYPES:
        raise HTTPException(400, "Unsupported format")
        
    if not file.filename or '..' in file.filename or '/' in file.filename:
        raise HTTPException(400, "Invalid filename")
        
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    
    if max_size_mb and size_mb > max_size_mb:
        raise HTTPException(413, "File too large")
        
    if len(content) < 100:
        raise HTTPException(400, "File too small")
        
    magic_valid = False
    for magic in MAGIC_BYTES:
        if content.startswith(magic):
            magic_valid = True; break
            
    if file.content_type == 'video/mp4' and not magic_valid:
        if len(content) >= 8 and content[4:8] == b'ftyp':
            magic_valid = True
            
    if file.content_type.startswith('image/') and not magic_valid:
        raise HTTPException(400, "Corrupt magic bytes")
        
    if file.content_type.startswith('image/'):
        try:
            img = Image.open(BytesIO(content))
            img.verify()
        except:
            raise HTTPException(400, "Corrupted image")
            
    if file.content_type.startswith('video/'):
        tmp_path = ""
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.tmp') as tmp:
                tmp.write(content)
                tmp_path = tmp.name
                
            cap = cv2.VideoCapture(tmp_path)
            if not cap.isOpened():
                raise Exception()
            cap.release()
        except:
            if os.path.exists(tmp_path): os.remove(tmp_path)
            raise HTTPException(400, "Corrupted video")
        finally:
            if os.path.exists(tmp_path): os.remove(tmp_path)
            
    await file.seek(0)
    return content

import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, createAuditLog, AuthRequest } from '../middleware/auth.js';
import { config } from '../config/index.js';
import { AppError, NotFoundError } from '../middleware/errorHandler.js';

const router = Router();
router.use(authenticate);

// Ensure upload directory exists
const uploadDir = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer with validation
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, `File type ${file.mimetype} not allowed`));
    }
  },
});

// POST /assets/upload
router.post('/upload', authorize('admin', 'sales', 'operations'), upload.single('file'), async (req: AuthRequest, res) => {
  if (!req.file) throw new AppError(400, 'No file uploaded');
  
  const { fileType, advertiserId, campaignId } = req.body;
  
  const asset = await prisma.asset.create({
    data: {
      fileName: req.file.originalname,
      fileType: fileType || 'document',
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      storagePath: req.file.filename,
      advertiserId: advertiserId || null,
      campaignId: campaignId || null,
      uploadedBy: req.user!.userId,
    },
  });
  
  await createAuditLog(req.user!.userId, 'create', 'asset', asset.id, undefined, req.ip);
  res.status(201).json({ success: true, data: asset });
});

// GET /assets - List assets with filters
router.get('/', authorize('admin', 'sales', 'operations'), async (req, res) => {
  const { fileType, advertiserId, campaignId } = req.query;
  const where: Record<string, unknown> = {};
  if (fileType) where.fileType = fileType;
  if (advertiserId) where.advertiserId = advertiserId;
  if (campaignId) where.campaignId = campaignId;
  
  const assets = await prisma.asset.findMany({
    where,
    include: {
      advertiser: { select: { id: true, businessName: true } },
      campaign: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  res.json({ success: true, data: assets });
});

// GET /assets/:id/download
router.get('/:id/download', async (req, res) => {
  const asset = await prisma.asset.findUnique({ where: { id: req.params.id } });
  if (!asset) throw new NotFoundError('Asset');
  
  const filePath = path.resolve(uploadDir, asset.storagePath);
  if (!filePath.startsWith(uploadDir)) {
    throw new AppError(400, 'Invalid file path');
  }
  if (!fs.existsSync(filePath)) {
    throw new NotFoundError('File');
  }
  
  res.setHeader('Content-Disposition', `attachment; filename="${asset.fileName}"`);
  res.setHeader('Content-Type', asset.mimeType);
  res.sendFile(filePath);
});

// DELETE /assets/:id
router.delete('/:id', authorize('admin'), async (req: AuthRequest, res) => {
  const asset = await prisma.asset.findUnique({ where: { id: req.params.id } });
  if (!asset) throw new NotFoundError('Asset');
  
  // Delete file from disk
  const filePath = path.resolve(uploadDir, asset.storagePath);
  if (filePath.startsWith(uploadDir) && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  await prisma.asset.delete({ where: { id: req.params.id } });
  await createAuditLog(req.user!.userId, 'delete', 'asset', req.params.id, undefined, req.ip);
  
  res.json({ success: true, message: 'Asset deleted' });
});

export { router as assetRoutes };

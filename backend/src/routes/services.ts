import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Service } from '../models/Service';
import * as memoryDb from '../memoryDb';

const router = Router();

// Check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET /api/services
// @desc    Get featured services (limit 4)
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const services = await Service.find().limit(4);
      return res.json(services);
    } else {
      // Fallback
      const featured = memoryDb.services.slice(0, 4);
      return res.json(featured);
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching featured services' });
  }
});

// @route   GET /api/services/explore
// @desc    Explore services with search, category filtering, price filtering, sorting, and pagination
router.get('/explore', async (req: Request, res: Response) => {
  try {
    const q = req.query.q ? String(req.query.q).toLowerCase().trim() : '';
    const category = req.query.category ? String(req.query.category) : '';
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 0;
    const sort = req.query.sort ? String(req.query.sort) : 'default';
    const page = req.query.page ? Math.max(1, Number(req.query.page)) : 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    if (isDbConnected()) {
      const filterQuery: any = {};

      if (q) {
        filterQuery.$or = [
          { title: { $regex: q, $options: 'i' } },
          { shortDesc: { $regex: q, $options: 'i' } },
          { fullDesc: { $regex: q, $options: 'i' } }
        ];
      }

      if (category && category !== 'all') {
        filterQuery.category = category;
      }

      if (maxPrice > 0) {
        filterQuery.priceFrom = { $lte: maxPrice };
      }

      let sortQuery: any = {};
      if (sort === 'priceAsc') {
        sortQuery.priceFrom = 1;
      } else if (sort === 'priceDesc') {
        sortQuery.priceFrom = -1;
      } else if (sort === 'ratingDesc') {
        sortQuery.rating = -1;
      } else {
        sortQuery.createdAt = -1;
      }

      const total = await Service.countDocuments(filterQuery);
      const services = await Service.find(filterQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

      return res.json({
        services,
        total,
        page,
        pages: Math.ceil(total / limit)
      });
    } else {
      // Fallback: Query memoryDb.services
      let results = [...memoryDb.services];

      // 1. Text Search
      if (q) {
        results = results.filter(
          s =>
            s.title.toLowerCase().includes(q) ||
            s.shortDesc.toLowerCase().includes(q) ||
            s.fullDesc.toLowerCase().includes(q)
        );
      }

      // 2. Category Filter
      if (category && category !== 'all') {
        results = results.filter(s => s.category === category);
      }

      // 3. Price Filter
      if (maxPrice > 0) {
        results = results.filter(s => s.priceFrom <= maxPrice);
      }

      // 4. Sorting
      if (sort === 'priceAsc') {
        results.sort((a, b) => a.priceFrom - b.priceFrom);
      } else if (sort === 'priceDesc') {
        results.sort((a, b) => b.priceFrom - a.priceFrom);
      } else if (sort === 'ratingDesc') {
        results.sort((a, b) => b.rating - a.rating);
      }

      const total = results.length;
      const paginatedResults = results.slice(skip, skip + limit);

      return res.json({
        services: paginatedResults,
        total,
        page,
        pages: Math.ceil(total / limit)
      });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error exploring services' });
  }
});

// @route   GET /api/services/:id
// @desc    Get service by ID and fetch related items in same category (excluding self)
router.get('/:id', async (req: Request, res: Response) => {
  const serviceId = req.params.id;

  try {
    if (isDbConnected()) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      const related = await Service.find({
        category: service.category,
        _id: { $ne: service._id }
      }).limit(4);

      return res.json({
        service,
        related
      });
    } else {
      // Fallback
      const service = memoryDb.services.find(s => s._id === serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      const related = memoryDb.services
        .filter(s => s.category === service.category && s._id !== service._id)
        .slice(0, 4);

      return res.json({
        service,
        related
      });
    }
  } catch (err: any) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Server error fetching service details' });
  }
});

export default router;

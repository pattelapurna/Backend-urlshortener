import urlSchema from "../models/url.schema";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../services/CustomError";
import shortid from 'shortid';


export const createShortUrl = asyncHandler(async (req, res) => {
  const { url, user } = req.body;

  if (!url) {
    throw new CustomError('Please provide a URL to shorten', 400);
  }

  const shortId = shortid.generate();

  const newUrl = await urlSchema.create({
    url,
    shortId,
    user,
    clickCount: 0,
    Analytics: [],
  });

  res.status(201).json({
    success: true,
    message: 'URL shortened successfully',
    data: {
      url: newUrl.url,
      shortId: newUrl.shortId,
      user: newUrl.user,
      clickCount: newUrl.clickCount,
      createdAt: newUrl.createdAt,
    }
  });
});

export const getOriginalUrl = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  const urlRecord = await urlSchema.findOne({ shortId });

  if (!urlRecord) {
    throw new CustomError('URL not found', 404);
  }

});

export const getUrlStatistics = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  const urlRecord = await urlSchema.findOne({ shortId });

  if (!urlRecord) {
    throw new CustomError('URL not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      url: urlRecord.url,
      shortId: urlRecord.shortId,
      clickCount: urlRecord.clickCount,
      createdAt: urlRecord.createdAt,
      Analytics: urlRecord.Analytics,
    }
  });
});


export const deleteShortUrl = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  const urlRecord = await urlSchema.findOneAndDelete({ shortId });

  if (!urlRecord) {
    throw new CustomError('URL not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'URL successfully deleted',
  });
});



export const updateShortUrl = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const { url, user } = req.body;

  const urlRecord = await urlSchema.findOne({ shortId });

  if (!urlRecord) {
    throw new CustomError('URL not found', 404);
  }

  if (url) urlRecord.url = url;
  if (user) urlRecord.user = user;

  await urlRecord.save();

  res.status(200).json({
    success: true,
    message: 'URL successfully updated',
    data: urlRecord,
  });
});

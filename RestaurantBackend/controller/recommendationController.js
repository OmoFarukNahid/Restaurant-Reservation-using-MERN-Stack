import { Recommendation } from "../models/recommendationSchema.js";
import ErrorHandler from "../error/error.js";

export const createRecommendation = async (req, res, next) => {
  try {
    const { title, description, image } = req.body;
    
    // Validate session and user ID
    if (!req.session.userId) {
      return next(new ErrorHandler('User not authenticated', 401));
    }

    // Validate required fields
    if (!title || !description) {
      return next(new ErrorHandler('Title and description are required', 400));
    }

    // Create recommendation
    const recommendation = await Recommendation.create({
      title,
      description,
      image: image || "",
      user: req.session.userId
    });

    res.status(201).json({
      success: true,
      message: "Recommendation created successfully",
      recommendation
    });

  } catch (error) {
    // Handle duplicate key errors (if you add unique constraints)
    if (error.code === 11000) {
      return next(new ErrorHandler('Recommendation with this title already exists', 400));
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new ErrorHandler(messages.join(', '), 400));
    }
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return next(new ErrorHandler('User not authenticated', 401));
    }

    const recommendations = await Recommendation.find({ 
      user: req.session.userId 
    }).sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations
    });

  } catch (error) {
    next(error);
  }
};

export const updateRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    if (!req.session.userId) {
      return next(new ErrorHandler('User not authenticated', 401));
    }

    // Validate input
    if (!title && !description && !image) {
      return next(new ErrorHandler('At least one field to update is required', 400));
    }

    const recommendation = await Recommendation.findOneAndUpdate(
      { _id: id, user: req.session.userId },
      { title, description, image },
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!recommendation) {
      return next(new ErrorHandler('Recommendation not found or not authorized', 404));
    }

    res.status(200).json({
      success: true,
      message: "Recommendation updated successfully",
      recommendation
    });

  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new ErrorHandler(messages.join(', '), 400));
    }
    next(error);
  }
};

export const deleteRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.session.userId) {
      return next(new ErrorHandler('User not authenticated', 401));
    }

    const recommendation = await Recommendation.findOneAndDelete({
      _id: id,
      user: req.session.userId
    });

    if (!recommendation) {
      return next(new ErrorHandler('Recommendation not found or not authorized', 404));
    }

    res.status(200).json({
      success: true,
      message: "Recommendation deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};
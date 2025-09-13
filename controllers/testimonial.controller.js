const { Testimonial } = require("../models");
const fs = require("fs");

exports.createTestimonial = async (req, res) => {
  try {
    const { name, designation, message } = req.body;

    const testimonial = await Testimonial.create({
      name,
      designation,
      message,
      image: req.file ? req.file.filename : null,
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(`uploads/${req.file.filename}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isActive: true },
    });
    return res.json({ success: true, data: testimonials });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      if (req.file) fs.unlinkSync(`uploads/${req.file.filename}`);
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (req.file && testimonial.image) {
      fs.unlinkSync(`uploads/${testimonial.image}`);
    }

    await testimonial.update({
      ...req.body,
      image: req.file ? req.file.filename : testimonial.image,
    });

    return res.json({
      success: true,
      message: "Updated successfully",
      data: testimonial,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial)
      return res.status(404).json({ success: false, message: "Not found" });

    if (testimonial.image) fs.unlinkSync(`uploads/${testimonial.image}`);

    await testimonial.destroy();
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

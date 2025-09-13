const { Artist, Product } = require("../models");

// Create a new artist

// Get single artist by id
exports.getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const artist = await Artist.findByPk(id);

    if (!artist) return res.status(404).json({ error: "Artist not found" });

    const { rows: products, count } = await Product.findAndCountAll({
      where: { artistId: id },
      offset,
      limit: parseInt(limit),
    });

    res.json({
      artist,
      products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Create Artist
exports.createArtist = async (req, res) => {
  try {
    const { name, isActive, isFeatured, aboutArtist } = req.body;

    if (!name)
      return res.status(400).json({ error: "Artist name is required" });

    const artist = await Artist.create({
      name,
      isActive: isActive === "true" || isActive === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
      aboutArtist: aboutArtist ?? null,
      image: req.file ? req.file.filename : null,
    });

    res.status(201).json(artist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get All Artists
exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll();
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
exports.featuredArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({
      where: {
        isFeatured: true, // ✅ only featured
        isActive: true, // ✅ optional: only active featured
      },
    });

    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update Artist
exports.updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive, isFeatured, aboutArtist } = req.body;

    const artist = await Artist.findByPk(id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });

    artist.name = name ?? artist.name;
    artist.isActive =
      isActive !== undefined
        ? isActive === "true" || isActive === true
        : artist.isActive;
    artist.isFeatured =
      isFeatured !== undefined
        ? isFeatured === "true" || isFeatured === true
        : artist.isFeatured;
    artist.aboutArtist = aboutArtist ?? artist.aboutArtist;
    if (req.file) artist.image = req.file.filename;

    await artist.save();
    res.json(artist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete Artist
exports.deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });

    await artist.destroy();
    res.json({ message: "Artist deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

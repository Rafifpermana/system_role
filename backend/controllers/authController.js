const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password wajib diisi" });
    }

    const user = await User.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ message: "Username, password, dan role wajib diisi" });
    }

    const isRoleValid = await Role.checkRoleExists(role);
    if (!isRoleValid) {
      return res.status(400).json({
        message: `Role '${role}' tidak valid atau tidak terdaftar di sistem.`,
      });
    }

    const existingUser = await User.findUserByUsername(username);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username sudah digunakan, silakan pilih yang lain" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await User.createUser(username, hashedPassword, role);

    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: result.insertId,
        username: username,
        role: role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server saat registrasi" });
  }
};

const registerViewer = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password wajib diisi" });
    }

    const role = "viewer";

    const existingUser = await User.findUserByUsername(username);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username sudah digunakan, silakan pilih yang lain" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await User.createUser(username, hashedPassword, role);

    res.status(201).json({
      message: "Pembuatan akun viewer berhasil",
      user: {
        id: result.insertId,
        username: username,
        role: role,
      },
    });
  } catch (error) {
    console.error("Register Viewer error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server saat registrasi" });
  }
};

module.exports = {
  login,
  register,
  registerViewer,
};

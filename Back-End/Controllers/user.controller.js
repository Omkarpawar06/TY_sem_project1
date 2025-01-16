import User from "../models/User.model.js";
import bcryptjs from 'bcryptjs';

export const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  const LOCK_TIME = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  const MAX_FAILED_ATTEMPTS = 3;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      // To prevent user enumeration, use a generic message
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check if user is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remaining = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60); // in minutes
      return res.status(403).json({ 
        message: `Account locked. Try again in ${remaining} minute(s).`,
        lockUntil: user.lockUntil,
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;

      // Lock the account if max attempts exceeded
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        await user.save();
        return res.status(403).json({ 
          message: "Account locked due to multiple failed login attempts. Try again after 6 hours.",
          lockUntil: user.lockUntil,
        });
      } else {
        await user.save();
        return res.status(400).json({ message: "Invalid email or password." });
      }
    }

    // Successful login: reset failed attempts and lockUntil
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Generate a token or session as per your authentication strategy
    // For simplicity, just returning the userId
    res.status(200).json({ message: "Login successful", userId: user._id });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server Error." });
  }
};

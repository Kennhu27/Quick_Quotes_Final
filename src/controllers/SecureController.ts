import { Request, Response } from 'express';
import { AppDataSource } from '../dataSource.js';
import { User } from '../entities/User.js';
import { Admin } from '../entities/Admin.js';
import argon2 from 'argon2';
import { AdminLoginSchema, CreateAdminSchema } from '../validators/secure.js';
import { parseDatabaseError } from '../utils/db-utils.js';

const userRepository = AppDataSource.getRepository(User);
const adminRepository = AppDataSource.getRepository(Admin);

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const newUser = new User();
    const savedUser = await userRepository.save(newUser);

    req.session.currentUserId = savedUser.userId;

    res.status(201).json({
      userId: savedUser.userId,
      message: 'User created successfully',
    });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const userId = req.params.userId as string;

  try {
    const user = await userRepository.findOne({ where: { userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ userId: user.userId, createdAt: user.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get user' });
  }
}

export async function adminLogin(req: Request, res: Response): Promise<void> {
  const result = AdminLoginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten() });
    return;
  }

  const { email, password } = result.data;

  try {
    const admin = await adminRepository.findOne({ where: { email } });

    if (!admin) {
      res.sendStatus(403);
      return;
    }

    if (!admin.isActive) {
      res.sendStatus(403);
      return;
    }

    let isValidPassword = false;
    try {
      isValidPassword = await argon2.verify(admin.passwordHash, password);
    } catch (err) {
      console.error('Argon2 verification error:', err);
      res.sendStatus(500);
      return;
    }

    if (!isValidPassword) {
      res.sendStatus(403);
      return;
    }

    admin.lastLoginAt = new Date();
    await adminRepository.save(admin);

    await req.session.clearSession();

    req.session.isAdminLoggedIn = true;
    req.session.authenticatedAdmin = {
      adminId: admin.adminId,
      email: admin.email,
      fullName: admin.fullName,
    };

    res.json({
      adminId: admin.adminId,
      email: admin.email,
      fullName: admin.fullName,
    });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export async function adminLogout(req: Request, res: Response): Promise<void> {
  await req.session.clearSession();
  res.sendStatus(204);
}

export async function getCurrentAdmin(req: Request, res: Response): Promise<void> {
  if (!req.session.isAdminLoggedIn || !req.session.authenticatedAdmin) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  res.json(req.session.authenticatedAdmin);
}

export async function createFirstAdmin(req: Request, res: Response): Promise<void> {
  const adminCount = await adminRepository.count();
  if (adminCount > 0) {
    res.status(403).json({ error: 'Admin already exists. Use admin login.' });
    return;
  }

  const result = CreateAdminSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten() });
    return;
  }

  const { email, password, fullName } = result.data;

  try {
    const passwordHash = await argon2.hash(password);

    const newAdmin = new Admin();
    newAdmin.email = email;
    newAdmin.passwordHash = passwordHash;
    newAdmin.fullName = fullName;
    newAdmin.isActive = true;

    const savedAdmin = await adminRepository.save(newAdmin);

    const { passwordHash: _, ...adminWithoutPassword } = savedAdmin;
    res.status(201).json(adminWithoutPassword);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  if (!req.session.isAdminLoggedIn || !req.session.authenticatedAdmin) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const result = CreateAdminSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten() });
    return;
  }

  const { email, password, fullName } = result.data;

  try {
    const existingAdmin = await adminRepository.findOne({ where: { email } });
    if (existingAdmin) {
      res.status(409).json({ error: 'Admin with this email already exists' });
      return;
    }

    const passwordHash = await argon2.hash(password);

    const newAdmin = new Admin();
    newAdmin.email = email;
    newAdmin.passwordHash = passwordHash;
    newAdmin.fullName = fullName;
    newAdmin.isActive = true;

    const savedAdmin = await adminRepository.save(newAdmin);

    const { passwordHash: _, ...adminWithoutPassword } = savedAdmin;
    res.status(201).json(adminWithoutPassword);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export async function getAllAdmins(req: Request, res: Response): Promise<void> {
  if (!req.session.isAdminLoggedIn || !req.session.authenticatedAdmin) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const admins = await adminRepository.find({
      select: ['adminId', 'email', 'fullName', 'isActive', 'lastLoginAt', 'createdAt'],
    });
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get admins' });
  }
}

export async function updateAdminStatus(req: Request, res: Response): Promise<void> {
  if (!req.session.isAdminLoggedIn || !req.session.authenticatedAdmin) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const adminId = req.params.adminId as string;

  try {
    const admin = await adminRepository.findOne({ where: { adminId } });
    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    if (admin.adminId === req.session.authenticatedAdmin.adminId) {
      res.status(400).json({ error: 'Cannot disable your own account' });
      return;
    }

    admin.isActive = !admin.isActive;
    const updatedAdmin = await adminRepository.save(admin);

    res.json({
      adminId: updatedAdmin.adminId,
      email: updatedAdmin.email,
      isActive: updatedAdmin.isActive,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update admin status' });
  }
}

export async function deleteAdmin(req: Request, res: Response): Promise<void> {
  if (!req.session.isAdminLoggedIn || !req.session.authenticatedAdmin) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const adminId = req.params.adminId as string;

  try {
    const admin = await adminRepository.findOne({ where: { adminId } });
    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    if (admin.adminId === req.session.authenticatedAdmin.adminId) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    await adminRepository.remove(admin);
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete admin' });
  }
}

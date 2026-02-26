import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Company from '../models/Company';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import crypto from 'crypto';
import { sendEmployeeInvitation } from '../utils/email';

// Helper function to generate secure random password
const generateSecurePassword = (): string => {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }

  // Ensure password has at least one of each required character type
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  if (hasLower && hasUpper && hasDigit && hasSpecial) {
    return password;
  }

  // If not all requirements met, recursively generate again
  return generateSecurePassword();
};

// @desc    Invite an employee to the company
// @route   POST /api/v1/company/invite
// @access  Private (Company Admin only)
export const inviteEmployee = async (req: AuthRequest, res: Response) => {
    try {
        const { email, name, department } = req.body;

        // Logic:
        // 1. Check if user exists.
        // 2. If yes, add to company employees if not already.
        // 3. If no, create pending user.

        // Identifying the company of the requester
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const requester = await User.findById(req.user._id);
        if (!requester || !requester.companyId) {
            return res.status(403).json({ success: false, message: 'Not authorized for company operations' });
        }

        const company = await Company.findById(requester.companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        // Check permissions - requester must be company admin or super_admin
        const isCompanyAdmin = company.admins.some((adminId) => adminId.toString() === requester._id.toString());
        const isSuperAdmin = requester.role === 'super_admin';

        if (!isCompanyAdmin && !isSuperAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Only company admins can invite employees'
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            if (user.companyId && user.companyId.toString() !== company._id.toString()) {
                return res.status(400).json({ success: false, message: 'User already belongs to another company' });
            }
            user.companyId = company._id as any;
            // user.department = department; // Assuming we might add this field later to User
            await user.save();
        } else {
            // Create new user with secure random password
            const temporaryPassword = generateSecurePassword();
            user = await User.create({
                name,
                email,
                password: temporaryPassword,
                role: 'user',
                companyId: company._id,
                isVerified: false,
                // department // if added to schema
            });

            // Send email invitation with temporary password
            try {
                await sendEmployeeInvitation(email, name, company.name, temporaryPassword, false);
            } catch (emailError) {
                // Log error but don't fail the request
                console.error('Failed to send invitation email:', emailError);
            }
        }

        // Add to company employees list
        if (!company.employees.includes(user._id as any)) {
            company.employees.push(user._id as any);
            await company.save();
        }

        res.status(200).json({
            success: true,
            data: user,
            message: 'Employee invited successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Add a company admin
// @route   POST /api/v1/company/add-admin
// @access  Private (Company Admin only)
export const addAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const { email, name } = req.body;

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const requester = await User.findById(req.user._id);
        if (!requester || !requester.companyId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const company = await Company.findById(requester.companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        // Check permissions - requester must be existing admin or super_admin
        const isCompanyAdmin = company.admins.some((adminId) => adminId.toString() === requester._id.toString());
        const isSuperAdmin = requester.role === 'super_admin';

        if (!isCompanyAdmin && !isSuperAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Only company admins can add new admins'
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            const temporaryPassword = generateSecurePassword();
            user = await User.create({
                name,
                email,
                password: temporaryPassword,
                role: 'user', // Determine if they should be 'company' role? Let's keep 'user' but add to admins list.
                companyId: company._id,
                isVerified: false
            });

            // Send email with temporary password
            try {
                await sendEmployeeInvitation(email, name, company.name, temporaryPassword, true);
            } catch (emailError) {
                // Log error but don't fail the request
                console.error('Failed to send admin invitation email:', emailError);
            }
        } else {
            if (user.companyId && user.companyId.toString() !== company._id.toString()) {
                return res.status(400).json({ success: false, message: 'User belongs to another company' });
            }
            user.companyId = company._id as any;
            await user.save();
        }

        // Add to company admins list
        if (!company.admins.includes(user._id as any)) {
            company.admins.push(user._id as any);
            await company.save();
        }

        res.status(200).json({
            success: true,
            message: 'Admin added successfully',
            data: user
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

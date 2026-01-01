import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Company from '../models/Company';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

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

        let user = await User.findOne({ email });

        if (user) {
            if (user.companyId && user.companyId.toString() !== company._id.toString()) {
                return res.status(400).json({ success: false, message: 'User already belongs to another company' });
            }
            user.companyId = company._id as any;
            // user.department = department; // Assuming we might add this field later to User
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                password: 'TempPassword123!', // Should generate random string
                role: 'user',
                companyId: company._id,
                isVerified: false,
                // department // if added to schema
            });
            // In real app: Send email invitation here
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

        // Check permissions - assume requester must be existing admin or super_admin
        // (This logic can be refined)

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: 'TempPassword123!',
                role: 'user', // Determine if they should be 'company' role? Let's keep 'user' but add to admins list.
                companyId: company._id,
                isVerified: false
            });
            // Send email
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

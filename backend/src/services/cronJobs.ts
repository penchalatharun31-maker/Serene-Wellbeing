import cron from 'node-cron';
import Session from '../models/Session';
import User from '../models/User';
import Notification from '../models/Notification';
import { sendSessionReminder } from '../utils/email';
import logger from '../utils/logger';

// Send session reminders 24 hours before scheduled time
cron.schedule('0 * * * *', async () => {
  // Runs every hour
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find sessions scheduled in 24 hours that haven't sent reminders
    const upcomingSessions = await Session.find({
      status: { $in: ['pending', 'confirmed'] },
      reminderSent: false,
      scheduledDate: {
        $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
        $lt: new Date(tomorrow.setHours(23, 59, 59, 999)),
      },
    })
      .populate('userId', 'name email')
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name',
        },
      });

    for (const session of upcomingSessions) {
      const user = session.userId as any;
      const expert = (session.expertId as any).userId;

      // Send email reminder
      await sendSessionReminder(user.email, user.name, {
        expertName: expert.name,
        date: new Date(session.scheduledDate).toLocaleDateString(),
        time: session.scheduledTime,
        duration: session.duration,
        meetingLink: session.meetingLink,
      });

      // Create in-app notification
      await Notification.create({
        userId: session.userId,
        type: 'session_reminder',
        title: 'Upcoming Session Reminder',
        message: `You have a session with ${expert.name} tomorrow at ${session.scheduledTime}`,
        link: `/sessions/${session._id}`,
      });

      // Mark reminder as sent
      session.reminderSent = true;
      await session.save();

      logger.info(`Reminder sent for session ${session._id}`);
    }

    if (upcomingSessions.length > 0) {
      logger.info(`Sent ${upcomingSessions.length} session reminders`);
    }
  } catch (error: any) {
    logger.error('Error sending session reminders:', error.message);
  }
});

// Auto-complete sessions that are past their scheduled time
cron.schedule('*/30 * * * *', async () => {
  // Runs every 30 minutes
  try {
    const now = new Date();

    // Find confirmed sessions that are past their end time
    const pastSessions = await Session.find({
      status: 'confirmed',
      scheduledDate: { $lt: now },
    });

    for (const session of pastSessions) {
      // Check if session end time has passed (scheduledDate + duration)
      const sessionEndTime = new Date(session.scheduledDate.getTime() + session.duration * 60000);

      if (sessionEndTime < now) {
        session.status = 'completed';
        session.completedAt = sessionEndTime;
        await session.save();

        // Create notification for user to rate session
        await Notification.create({
          userId: session.userId,
          type: 'session_reminder',
          title: 'Rate Your Session',
          message: 'Please rate your recent session',
          link: `/rate-session/${session._id}`,
        });

        logger.info(`Auto-completed session ${session._id}`);
      }
    }

    if (pastSessions.length > 0) {
      logger.info(`Auto-completed ${pastSessions.length} sessions`);
    }
  } catch (error: any) {
    logger.error('Error auto-completing sessions:', error.message);
  }
});

// Clean up old notifications (older than 30 days)
cron.schedule('0 0 * * *', async () => {
  // Runs daily at midnight
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      isRead: true,
    });

    if (result.deletedCount > 0) {
      logger.info(`Deleted ${result.deletedCount} old notifications`);
    }
  } catch (error: any) {
    logger.error('Error cleaning up notifications:', error.message);
  }
});

// Update expert statistics daily
cron.schedule('0 1 * * *', async () => {
  // Runs daily at 1 AM
  try {
    const Expert = (await import('../models/Expert')).default;

    const experts = await Expert.find();

    for (const expert of experts) {
      // Update stats based on recent sessions
      const completedSessions = await Session.countDocuments({
        expertId: expert._id,
        status: 'completed',
      });

      const cancelledSessions = await Session.countDocuments({
        expertId: expert._id,
        status: 'cancelled',
      });

      const totalEarnings = await Session.aggregate([
        {
          $match: {
            expertId: expert._id,
            status: 'completed',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$metadata.expertCommission' },
          },
        },
      ]);

      expert.completedSessions = completedSessions;
      expert.cancelledSessions = cancelledSessions;
      expert.totalSessions = completedSessions + cancelledSessions;
      expert.totalEarnings = totalEarnings[0]?.total || 0;

      await expert.save();
    }

    logger.info('Updated expert statistics');
  } catch (error: any) {
    logger.error('Error updating expert statistics:', error.message);
  }
});

// Check for inactive users (no activity in 90 days)
cron.schedule('0 2 * * 0', async () => {
  // Runs weekly on Sunday at 2 AM
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const inactiveUsers = await User.find({
      updatedAt: { $lt: ninetyDaysAgo },
      role: 'user',
      isActive: true,
    });

    for (const user of inactiveUsers) {
      // Send re-engagement notification
      await Notification.create({
        userId: user._id,
        type: 'system',
        title: 'We Miss You!',
        message: 'Check out our new experts and resources',
        link: '/browse',
      });
    }

    if (inactiveUsers.length > 0) {
      logger.info(`Sent re-engagement notifications to ${inactiveUsers.length} inactive users`);
    }
  } catch (error: any) {
    logger.error('Error checking inactive users:', error.message);
  }
});

logger.info('Cron jobs initialized');

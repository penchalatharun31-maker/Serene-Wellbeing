import { GoogleGenerativeAI } from '@google/generative-ai';
import AIConversation, { IMessage } from '../models/AIConversation';
import MoodEntry from '../models/MoodEntry';
import Journal from '../models/Journal';
import CrisisResource from '../models/CrisisResource';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CrisisDetectionResult {
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  keywords: string[];
  immediateAction: boolean;
}

class AICompanionService {
  private model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  });

  // Crisis keywords for detection
  private crisisKeywords = {
    critical: [
      'kill myself', 'end my life', 'commit suicide', 'want to die',
      'plan to kill', 'how to die', 'suicide plan', 'goodbye forever',
      'better off dead', 'end it all', 'take my life'
    ],
    high: [
      'suicidal', 'self harm', 'hurt myself', 'cutting', 'overdose',
      'jump off', 'hanging', 'pills', 'weapon', 'hopeless',
      'can\'t go on', 'no reason to live', 'give up'
    ],
    medium: [
      'depressed', 'worthless', 'burden', 'alone', 'hate myself',
      'can\'t take it', 'unbearable', 'desperate', 'crisis'
    ]
  };

  /**
   * Start or continue a conversation with the AI companion
   */
  async chat(
    userId: string,
    message: string,
    sessionId?: string
  ): Promise<{
    response: string;
    sessionId: string;
    crisisDetected: boolean;
    resources?: any[];
  }> {
    try {
      // Get or create conversation
      let conversation = sessionId
        ? await AIConversation.findOne({ sessionId, userId })
        : null;

      if (!conversation) {
        sessionId = uuidv4();
        conversation = new AIConversation({
          userId,
          sessionId,
          messages: [],
          analytics: {
            totalMessages: 0,
            avgSentiment: 0,
            crisisFlags: 0,
            topics: [],
            duration: 0
          },
          status: 'active',
          startedAt: new Date()
        });
      }

      // Get user context
      const context = await this.getUserContext(userId);

      // Detect crisis before responding
      const crisisDetection = await this.detectCrisis(message);

      // Add user message
      const userMessage: IMessage = {
        role: 'user',
        content: message,
        timestamp: new Date(),
        crisisDetected: crisisDetection.detected
      };
      conversation.messages.push(userMessage);

      // If crisis detected, handle appropriately
      if (crisisDetection.detected && crisisDetection.severity === 'critical') {
        const crisisResponse = await this.handleCrisis(userId, crisisDetection);

        const assistantMessage: IMessage = {
          role: 'assistant',
          content: crisisResponse.message,
          timestamp: new Date()
        };
        conversation.messages.push(assistantMessage);

        conversation.crisisIntervention = {
          triggered: true,
          timestamp: new Date(),
          reason: crisisDetection.reason,
          action: 'resources_provided'
        };
        conversation.analytics.crisisFlags++;
        conversation.status = 'escalated';

        await conversation.save();

        return {
          response: crisisResponse.message,
          sessionId: conversation.sessionId,
          crisisDetected: true,
          resources: crisisResponse.resources
        };
      }

      // Generate AI response with context
      const aiResponse = await this.generateResponse(
        conversation.messages,
        context,
        crisisDetection
      );

      const assistantMessage: IMessage = {
        role: 'assistant',
        content: aiResponse.response,
        timestamp: new Date(),
        sentiment: aiResponse.sentiment
      };
      conversation.messages.push(assistantMessage);

      // Update analytics
      conversation.analytics.totalMessages = conversation.messages.length;
      conversation.analytics.topics = aiResponse.topics;

      await conversation.save();

      return {
        response: aiResponse.response,
        sessionId: conversation.sessionId,
        crisisDetected: crisisDetection.detected && crisisDetection.severity !== 'low'
      };

    } catch (error) {
      console.error('AI Companion error:', error);
      throw new Error('Failed to process conversation');
    }
  }

  /**
   * Detect crisis situation in user message
   */
  private async detectCrisis(message: string): Promise<CrisisDetectionResult> {
    const lowerMessage = message.toLowerCase();
    const detectedKeywords: string[] = [];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Check critical keywords
    for (const keyword of this.crisisKeywords.critical) {
      if (lowerMessage.includes(keyword)) {
        detectedKeywords.push(keyword);
        severity = 'critical';
      }
    }

    // Check high severity if not critical
    if (severity !== 'critical') {
      for (const keyword of this.crisisKeywords.high) {
        if (lowerMessage.includes(keyword)) {
          detectedKeywords.push(keyword);
          severity = 'high';
        }
      }
    }

    // Check medium severity
    if (severity === 'low') {
      for (const keyword of this.crisisKeywords.medium) {
        if (lowerMessage.includes(keyword)) {
          detectedKeywords.push(keyword);
          severity = 'medium';
        }
      }
    }

    // Use AI for more nuanced detection
    if (detectedKeywords.length > 0 || severity !== 'low') {
      try {
        const prompt = `Analyze this message for signs of mental health crisis or suicidal ideation.
Message: "${message}"

Provide a JSON response with:
{
  "isCrisis": boolean,
  "severity": "low" | "medium" | "high" | "critical",
  "reason": "brief explanation",
  "immediateAction": boolean
}`;

        const result = await this.model.generateContent(prompt);
        const analysis = JSON.parse(result.response.text());

        return {
          detected: analysis.isCrisis || detectedKeywords.length > 0,
          severity: analysis.severity || severity,
          reason: analysis.reason,
          keywords: detectedKeywords,
          immediateAction: analysis.immediateAction || severity === 'critical'
        };
      } catch (error) {
        // Fallback to keyword-based detection
        return {
          detected: detectedKeywords.length > 0,
          severity,
          reason: `Detected concerning keywords: ${detectedKeywords.join(', ')}`,
          keywords: detectedKeywords,
          immediateAction: severity === 'critical'
        };
      }
    }

    return {
      detected: false,
      severity: 'low',
      reason: '',
      keywords: [],
      immediateAction: false
    };
  }

  /**
   * Handle crisis situation
   */
  private async handleCrisis(
    userId: string,
    detection: CrisisDetectionResult
  ): Promise<{ message: string; resources: any[] }> {
    // Get user info
    const user = await User.findById(userId);
    const country = user?.preferences?.country || 'US';

    // Get crisis resources
    const resources = await CrisisResource.find({
      country,
      category: { $in: ['suicide', 'mental_health', 'general'] },
      isActive: true
    })
      .sort({ isPrimary: -1, priority: 1 })
      .limit(5);

    const message = `I'm really concerned about what you're sharing with me. Your safety and wellbeing are the top priority right now.

If you're in immediate danger or having thoughts of hurting yourself, please:

🚨 **IMMEDIATE HELP:**
${resources.filter(r => r.isPrimary).map(r =>
  `• ${r.name}: ${r.contact.phone || r.contact.website}`
).join('\n')}

${detection.severity === 'critical' ? `
⚠️ **If this is an emergency:**
- Call 911 (or your local emergency number)
- Go to your nearest emergency room
- Call the crisis hotline above
` : ''}

I care about you and want to help you get through this. You don't have to face this alone. Professional support is available 24/7.

**Would you like me to:**
1. Connect you with a licensed therapist immediately
2. Provide more crisis resources
3. Help you create a safety plan
4. Talk about what's troubling you (while professional help is on the way)

You matter, and there are people who want to help you.`;

    // TODO: Notify emergency contacts if configured
    // TODO: Escalate to on-call expert

    return { message, resources };
  }

  /**
   * Get user context for personalized responses
   */
  private async getUserContext(userId: string): Promise<any> {
    const [recentMoods, recentJournals, user] = await Promise.all([
      MoodEntry.find({ userId })
        .sort({ createdAt: -1 })
        .limit(7),
      Journal.find({ userId })
        .sort({ createdAt: -1 })
        .limit(3),
      User.findById(userId)
    ]);

    return {
      recentMood: recentMoods[0]?.mood || 'unknown',
      moodTrend: this.analyzeMoodTrend(recentMoods),
      concerns: recentJournals
        .flatMap(j => j.aiAnalysis?.areasOfConcern || [])
        .slice(0, 3),
      userName: user?.firstName || 'there',
      preferences: user?.preferences
    };
  }

  /**
   * Generate AI response with context
   */
  private async generateResponse(
    messages: IMessage[],
    context: any,
    crisisDetection: CrisisDetectionResult
  ): Promise<{ response: string; sentiment: string; topics: string[] }> {
    const systemPrompt = `You are Serene, an empathetic AI mental health companion. Your role is to:
- Provide emotional support and active listening
- Offer evidence-based coping strategies
- Encourage self-reflection and growth
- Recognize when professional help is needed
- Never diagnose or replace professional therapy

User context:
- Recent mood: ${context.recentMood}
- Mood trend: ${context.moodTrend}
- Current concerns: ${context.concerns.join(', ') || 'none identified'}

${crisisDetection.detected && crisisDetection.severity !== 'low' ?
  `⚠️ ALERT: User may be experiencing distress (${crisisDetection.severity}). Be extra supportive and gently suggest professional resources if appropriate.`
  : ''}

Guidelines:
- Be warm, empathetic, and non-judgmental
- Ask thoughtful follow-up questions
- Validate emotions
- Offer practical coping strategies
- Keep responses conversational (2-3 paragraphs max)
- Use "I" statements to show empathy
- Avoid clinical jargon
- If user seems in crisis, prioritize safety`;

    const conversationHistory = messages.slice(-10).map(m => ({
      role: m.role === 'system' ? 'user' : m.role,
      parts: [{ text: m.content }]
    }));

    const chat = this.model.startChat({
      history: conversationHistory,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024,
      }
    });

    const lastUserMessage = messages[messages.length - 1].content;
    const fullPrompt = `${systemPrompt}\n\nUser: ${lastUserMessage}`;

    const result = await chat.sendMessage(fullPrompt);
    const response = result.response.text();

    // Analyze sentiment and topics
    const sentiment = this.analyzeSentiment(response);
    const topics = this.extractTopics(lastUserMessage);

    return { response, sentiment, topics };
  }

  /**
   * Analyze mood trend from recent entries
   */
  private analyzeMoodTrend(moods: any[]): string {
    if (moods.length < 2) return 'insufficient data';

    const scores = moods.map(m => m.moodScore);
    const recentAvg = scores.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, scores.length);
    const olderAvg = scores.slice(3).reduce((a, b) => a + b, 0) / Math.max(1, scores.length - 3);

    if (recentAvg > olderAvg + 1) return 'improving';
    if (recentAvg < olderAvg - 1) return 'declining';
    return 'stable';
  }

  /**
   * Analyze sentiment of text
   */
  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' | 'concerning' {
    const positive = ['happy', 'glad', 'great', 'wonderful', 'better', 'good', 'thank'];
    const negative = ['sad', 'difficult', 'hard', 'struggle', 'worse', 'bad'];
    const concerning = ['hopeless', 'worthless', 'give up', 'can\'t'];

    const lower = text.toLowerCase();

    if (concerning.some(word => lower.includes(word))) return 'concerning';

    const positiveCount = positive.filter(word => lower.includes(word)).length;
    const negativeCount = negative.filter(word => lower.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Extract topics from message
   */
  private extractTopics(message: string): string[] {
    const topicKeywords: { [key: string]: string[] } = {
      anxiety: ['anxious', 'worry', 'nervous', 'panic', 'stress'],
      depression: ['depressed', 'sad', 'hopeless', 'down', 'empty'],
      relationships: ['relationship', 'partner', 'friend', 'family', 'alone'],
      work: ['work', 'job', 'career', 'boss', 'colleague'],
      sleep: ['sleep', 'insomnia', 'tired', 'rest'],
      selfcare: ['self-care', 'exercise', 'meditation', 'healthy']
    };

    const lower = message.toLowerCase();
    const topics: string[] = [];

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        topics.push(topic);
      }
    }

    return topics.length > 0 ? topics : ['general'];
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(userId: string, limit: number = 10) {
    return await AIConversation.find({ userId })
      .sort({ startedAt: -1 })
      .limit(limit)
      .select('sessionId title startedAt endedAt status messages analytics');
  }

  /**
   * End conversation
   */
  async endConversation(sessionId: string) {
    const conversation = await AIConversation.findOne({ sessionId });
    if (!conversation) throw new Error('Conversation not found');

    conversation.status = 'completed';
    conversation.endedAt = new Date();
    conversation.analytics.duration = Math.floor(
      (conversation.endedAt.getTime() - conversation.startedAt.getTime()) / 1000
    );

    await conversation.save();
    return conversation;
  }
}

export default new AICompanionService();

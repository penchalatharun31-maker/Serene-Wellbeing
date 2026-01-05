import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger';
import { AppError } from '../utils/errors';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'placeholder-add-your-gemini-api-key-here') {
      logger.warn('GEMINI_API_KEY is not configured - AI features will not work');
      // Use a dummy key to prevent crash - AI features will fail gracefully
      this.genAI = new GoogleGenerativeAI('dummy-key-for-development');
    } else {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }

    this.model = this.genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    });
  }

  // --- Vector Memory Simulation ---
  // In a real implementation, this would connect to Pinecone/Milvus
  private memoryStore: Map<string, string[]> = new Map();

  async addToMemory(userId: string, interaction: string) {
    const history = this.memoryStore.get(userId) || [];
    history.push(interaction);
    if (history.length > 20) history.shift(); // Keep last 20 context interactions
    this.memoryStore.set(userId, history);
  }

  async retrieveContext(userId: string): Promise<string> {
    const history = this.memoryStore.get(userId) || [];
    return history.join('\n');
  }

  /**
   * Generate expert recommendations based on user preferences and needs
   */
  async getExpertRecommendations(userProfile: {
    concerns?: string[];
    preferences?: string;
    previousSessions?: any[];
  }): Promise<string> {
    try {
      const prompt = `You are a wellbeing expert recommendation assistant. Based on the following user profile, provide personalized expert recommendations:

User Concerns: ${userProfile.concerns?.join(', ') || 'General wellbeing'}
User Preferences: ${userProfile.preferences || 'No specific preferences'}
Previous Sessions: ${userProfile.previousSessions?.length || 0} completed

Provide 3-5 specific recommendations explaining why each expert type would be beneficial for this user. Focus on matching their needs with appropriate specializations (e.g., CBT, Meditation, Nutrition, Yoga, Life Coaching, etc.).

Format your response as a clear, helpful recommendation list.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      logger.error('Gemini API error:', error.message);
      throw new AppError('Failed to generate recommendations', 500);
    }
  }

  /**
   * Generate personalized wellness insights based on session history
   */
  async generateWellnessInsights(sessionData: {
    completedSessions: number;
    sessionTypes: string[];
    ratings: number[];
    duration: number; // in months
  }): Promise<string> {
    try {
      const avgRating = sessionData.ratings.length
        ? (
          sessionData.ratings.reduce((a, b) => a + b, 0) /
          sessionData.ratings.length
        ).toFixed(1)
        : 'N/A';

      const prompt = `You are a wellbeing insights analyst. Analyze the following user's wellness journey and provide personalized insights:

Total Sessions: ${sessionData.completedSessions}
Session Types: ${sessionData.sessionTypes.join(', ')}
Average Rating: ${avgRating}/5
Journey Duration: ${sessionData.duration} months

Provide:
1. Progress summary and achievements
2. Patterns or trends identified
3. Suggestions for continued growth
4. Recommended next steps

Keep the tone encouraging and supportive. Focus on actionable insights.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      logger.error('Gemini API error:', error.message);
      throw new AppError('Failed to generate insights', 500);
    }
  }

  /**
   * Generate session summary and key takeaways
   */
  async generateSessionSummary(sessionNotes: string): Promise<string> {
    try {
      const prompt = `You are a wellness session analyst. Summarize the following session notes into key takeaways and action items:

Session Notes:
${sessionNotes}

Provide:
1. Brief summary (2-3 sentences)
2. Key takeaways (3-5 bullet points)
3. Suggested action items for the client

Keep it professional and focused on the client's growth.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      logger.error('Gemini API error:', error.message);
      throw new AppError('Failed to generate session summary', 500);
    }
  }

  /**
   * Generate content for wellness resources
   */
  async generateWellnessContent(topic: string, type: 'article' | 'tips' | 'guide'): Promise<string> {
    try {
      let prompt = '';

      switch (type) {
        case 'article':
          prompt = `Write a comprehensive wellness article about "${topic}". Include an introduction, main points with explanations, and a conclusion with actionable tips. Keep it informative, engaging, and evidence-based. Aim for 500-700 words.`;
          break;
        case 'tips':
          prompt = `Provide 7-10 practical, actionable tips about "${topic}". Each tip should be concise (2-3 sentences) and immediately applicable. Focus on evidence-based practices.`;
          break;
        case 'guide':
          prompt = `Create a step-by-step guide for "${topic}". Include clear instructions, expected outcomes, and tips for success. Make it beginner-friendly and practical.`;
          break;
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      logger.error('Gemini API error:', error.message);
      throw new AppError('Failed to generate content', 500);
    }
  }

  /**
   * Analyze expert profile and suggest improvements
   */
  async analyzeExpertProfile(expertData: {
    bio: string;
    specializations: string[];
    experience: number;
    rating: number;
  }): Promise<string> {
    try {
      const prompt = `You are an expert profile optimization consultant. Analyze this expert's profile and provide suggestions for improvement:

Bio: ${expertData.bio}
Specializations: ${expertData.specializations.join(', ')}
Experience: ${expertData.experience} years
Current Rating: ${expertData.rating}/5

Provide:
1. Strengths of the current profile
2. Areas for improvement (be specific)
3. Suggestions to make the bio more compelling
4. Keywords or phrases to add
5. Tips to attract more clients

Keep suggestions constructive and actionable.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      logger.error('Gemini API error:', error.message);
      throw new AppError('Failed to analyze profile', 500);
    }
  }

  /**
   * Generate matching score explanation for user-expert pairing
   */
  async explainMatch(
    userNeeds: string[],
    expertSpecializations: string[]
  ): Promise<{ score: number; explanation: string }> {
    try {
      const prompt = `You are a matching algorithm explainer. Analyze why an expert matches a user's needs:

User Needs: ${userNeeds.join(', ')}
Expert Specializations: ${expertSpecializations.join(', ')}

Provide:
1. A matching score out of 100
2. A brief explanation (2-3 sentences) of why this is a good match or what considerations to keep in mind

Format your response as:
SCORE: [number]
EXPLANATION: [text]`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response
      const scoreMatch = text.match(/SCORE:\s*(\d+)/);
      const explanationMatch = text.match(/EXPLANATION:\s*(.+)/s);

      const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;
      const explanation = explanationMatch
        ? explanationMatch[1].trim()
        : 'This expert could be a good match for your needs.';

      return { score, explanation };
    } catch (error: any) {
      logger.error('Gemini API error:', error.message);
      // Return fallback values instead of throwing
      return {
        score: 75,
        explanation: 'This expert has relevant specializations for your needs.',
      };
    }
  }

  /**
   * Generate personalized chat response for user queries
   */
  async chatAssistant(userMessage: string, userId: string): Promise<string> {
    try {
      const context = await this.retrieveContext(userId);
      const prompt = `You are a helpful wellness assistant for Serene Wellbeing Hub.
      
      Previous Context: ${context}
      
      User Question: ${userMessage}

      Provide a helpful, empathetic, and informative response. If the question is about booking sessions, finding experts, or platform features, guide them appropriately. Keep responses concise (3-5 sentences) unless more detail is needed.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await this.addToMemory(userId, `User: ${userMessage}\nAI: ${text}`);

      return text;
    } catch (error: any) {
      logger.error('Gemini API error:', error.message);
      throw new AppError('Failed to generate response', 500);
    }
  }

  /**
   * Analyze session feedback and generate insights for expert
   */
  async analyzeFeedback(reviews: Array<{ rating: number; comment: string }>): Promise<string> {
    try {
      const prompt = `You are a feedback analyst for wellness experts. Analyze the following client reviews and provide actionable insights:

Reviews:
${reviews.map((r, i) => `${i + 1}. Rating: ${r.rating}/5 - "${r.comment}"`).join('\n')}

Provide:
1. Common themes (both positive and areas for improvement)
2. Specific strengths to maintain
3. Actionable suggestions for improvement
4. Overall sentiment analysis

Keep feedback constructive and professional.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      logger.error('Gemini API error:', error.message);
      throw new AppError('Failed to analyze feedback', 500);
    }
  }
}

export default new GeminiService();

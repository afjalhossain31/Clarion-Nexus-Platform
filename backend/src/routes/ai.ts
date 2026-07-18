import { Response } from 'express';
import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mongoose from 'mongoose';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { ChatHistory, IMessage } from '../models/ChatHistory';
import * as memoryDb from '../memoryDb';

const router = Router();

// Check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// Initialize Gemini API client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY environment variable is not defined. Using mock AI fallbacks.');
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Error initializing GoogleGenerativeAI client:', error);
    return null;
  }
};

// @route   GET /api/ai/chat/history
// @desc    Get user's chat logs
router.get('/chat/history', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'User ID missing' });

  try {
    if (isDbConnected()) {
      let chat = await ChatHistory.findOne({ user: userId });
      if (!chat) {
        chat = new ChatHistory({ user: userId, messages: [] });
        await chat.save();
      }
      return res.json(chat.messages);
    } else {
      // Fallback
      let messages = memoryDb.chatHistory.get(userId);
      if (!messages) {
        messages = [];
        memoryDb.chatHistory.set(userId, messages);
      }
      return res.json(messages);
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching chat history' });
  }
});

// @route   POST /api/ai/chat
// @desc    Chat with AI chatbot (NexusAI)
router.post('/chat', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  const userId = req.user?.id;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }
  if (!userId) return res.status(401).json({ message: 'User ID missing' });

  try {
    let recentMessages: any[] = [];
    let saveHandler: (replyText: string) => Promise<void>;

    if (isDbConnected()) {
      let chatDb = await ChatHistory.findOne({ user: userId });
      if (!chatDb) {
        chatDb = new ChatHistory({ user: userId, messages: [] });
      }

      // Add user message
      const userMsg: IMessage = { role: 'user', content: message };
      chatDb.messages.push(userMsg);
      recentMessages = chatDb.messages.slice(-10);

      saveHandler = async (replyText: string) => {
        const assistantMsg: IMessage = { role: 'assistant', content: replyText };
        chatDb!.messages.push(assistantMsg);
        await chatDb!.save();
      };
    } else {
      // Fallback: MemoryDB
      let messages = memoryDb.chatHistory.get(userId);
      if (!messages) {
        messages = [];
      }

      messages.push({
        role: 'user',
        content: message,
        createdAt: new Date()
      });

      recentMessages = messages.slice(-10);

      saveHandler = async (replyText: string) => {
        messages!.push({
          role: 'assistant',
          content: replyText,
          createdAt: new Date()
        });
        memoryDb.chatHistory.set(userId!, messages!);
      };
    }

    let aiReply = '';
    let suggestedPrompts: string[] = [];

    const genAI = getGeminiClient();

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const systemPrompt = `You are NexusAI, a helpful, highly professional virtual advisor for Clarion Nexus, a premium digital agency.
Our services include:
- Web Development: Full-stack applications, next.js projects, e-commerce ($1499+)
- SEO: Technical audits, content mapping, keyword ranking (#1 guarantee) ($999+)
- UI/UX Design: Brand books, layout assets, mobile mockups ($499+)
- Digital Marketing: Paid ads, brand copy, outreach ($799+)
- AI Integration: Custom chatbot embeds, automations ($1999+)

Answer the client's questions professionally, briefly (under 100 words), and encourage them to view services in "/explore" or submit custom specs in "/items/add".
In your response, write exactly three suggested follow-up question chips for the user at the very end of your response, formatted exactly like:
[SUGGESTIONS]
- Suggestion 1
- Suggestion 2
- Suggestion 3`;

        const historyData = recentMessages.slice(0, -1).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
          history: historyData,
          systemInstruction: systemPrompt
        });

        const result = await chat.sendMessage(message);
        const fullText = result.response.text();

        if (fullText.includes('[SUGGESTIONS]')) {
          const parts = fullText.split('[SUGGESTIONS]');
          aiReply = parts[0].trim();
          
          suggestedPrompts = parts[1]
            .split('\n')
            .map(line => line.replace(/^-\s*/, '').trim())
            .filter(line => line.length > 0)
            .slice(0, 3);
        } else {
          aiReply = fullText.trim();
          suggestedPrompts = [
            'What services do you offer?',
            'How do I request a custom project?',
            'What are your pricing plans?'
          ];
        }
      } catch (geminiErr) {
        console.error('Gemini API chat error, using mock fallback:', geminiErr);
        const fallback = getMockChatResponse(message);
        aiReply = fallback.reply;
        suggestedPrompts = fallback.prompts;
      }
    } else {
      const fallback = getMockChatResponse(message);
      aiReply = fallback.reply;
      suggestedPrompts = fallback.prompts;
    }

    // Save assistant message to DB or Memory
    await saveHandler(aiReply);

    res.json({
      reply: aiReply,
      suggestedPrompts
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error processing chat request' });
  }
});

// @route   POST /api/ai/generate
// @desc    Generate a project proposal document
router.post('/generate', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { businessType, requirements, tone, length } = req.body;

  if (!businessType || !requirements) {
    return res.status(400).json({ message: 'Business type and requirements are required' });
  }

  const targetWords = length === 'short' ? 150 : length === 'long' ? 600 : 350;

  try {
    let proposalContent = '';
    const genAI = getGeminiClient();

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const systemPrompt = `You are the Clarion Nexus AI Content Generator. Generate a beautifully structured, premium project proposal draft based on these inputs:
- Client Business Type: ${businessType}
- Specific Requirements: ${requirements}
- Tone: ${tone || 'professional'}
- Word Count Limit: Approximately ${targetWords} words

Structure the output using clean, elegant Markdown headers:
# Project Proposal for [Business Name/Type]
## 1. Executive Summary
## 2. Recommended Project Scope (Web, SEO, or Marketing depending on details)
## 3. Implementation Process & Timeline
## 4. Expected Deliverables & Outcomes
## 5. Estimate & Timeline

Maintain a highly convincing, agency-grade presentation. Output ONLY the markdown content.`;

        const result = await model.generateContent(systemPrompt);
        proposalContent = result.response.text();
      } catch (geminiErr) {
        console.error('Gemini API generate error, using mock fallback:', geminiErr);
        proposalContent = getMockProposal(businessType, requirements, tone, targetWords);
      }
    } else {
      proposalContent = getMockProposal(businessType, requirements, tone, targetWords);
    }

    res.json({ proposal: proposalContent });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error generating proposal' });
  }
});

// Helper for Mock Chat Advisor Responses
function getMockChatResponse(msg: string) {
  const input = msg.toLowerCase();
  
  if (input.includes('price') || input.includes('cost') || input.includes('budget') || input.includes('how much')) {
    return {
      reply: 'Clarion Nexus provides custom tiered pricing depending on requirements: Brand Identity packages start at $499, technical SEO audits start at $999, and full-stack web builds start at $1,499. You can log details of your project on the "/items/add" page and our team will get back with a precise estimate!',
      prompts: ['What are standard web features?', 'How do I add a project request?', 'Tell me about SEO package costs.']
    };
  }
  
  if (input.includes('web') || input.includes('dev') || input.includes('website') || input.includes('code') || input.includes('next.js')) {
    return {
      reply: 'Our core expertise is developing blazing-fast, Next.js full-stack websites with server-side rendering, responsive Tailwind styling, database persistence, and smooth Framer Motion interfaces. We also build custom Node.js and Mongoose backend databases.',
      prompts: ['Do you build e-commerce stores?', 'Show web development prices.', 'How long to complete a website?']
    };
  }

  if (input.includes('seo') || input.includes('rank') || input.includes('search') || input.includes('marketing')) {
    return {
      reply: 'Our SEO & Marketing strategies are keyword-driven and ranking-focused. We cover on-page tag audits, structured schema markup, high-authority backlink outreach, and performance analytics to increase your organic traffic by up to 200%.',
      prompts: ['How do you track ranking?', 'What is the SEO price?', 'Can I optimize my existing site?']
    };
  }

  if (input.includes('ai') || input.includes('bot') || input.includes('agent') || input.includes('gemini')) {
    return {
      reply: 'We integrate advanced LLMs like Google Gemini into customer support chatbot frames, semantic document parsing tools, auto-classification pipelines, and content engines. AI tools save our clients over 20+ hours of operations per week!',
      prompts: ['Can you build a chatbot for me?', 'What APIs do you use?', 'How much does AI integration cost?']
    };
  }

  return {
    reply: 'Hello! I am NexusAI, your project consultant. I can guide you through our core services (Web Development, UI/UX, SEO, Marketing, AI), explain our deliverables, or help you generate project proposal drafts in the "/generate" portal.',
    prompts: ['What services do you offer?', 'How does the proposal creator work?', 'How do I request a custom quote?']
  };
}

// Helper for Mock Proposal Generation (Dynamic Template)
function getMockProposal(businessType: string, requirements: string, tone: string, targetWords: number): string {
  return `# Project Proposal: Digital Acceleration for ${businessType}

## 1. Executive Summary
We are pleased to submit this proposal to support the expansion of **${businessType}**. Our agency, Clarion Nexus, specializes in blending premium UI/UX interfaces with high-performance software and AI. We aim to convert your core requirement ("${requirements}") into a competitive advantage using a ${tone || 'professional'} tone and structured timeline.

## 2. Recommended Project Scope
To satisfy your goal, we recommend the following deliverables:
- **Phase A (Design & Architecture)**: Custom high-fidelity Figma mockups, user persona journey layouts, and tech stack mapping.
- **Phase B (Engineering)**: Fully responsive application utilizing React/Next.js, Tailwind styling, Express backend, and MongoDB database storage.
- **Phase C (Optimization)**: Integrated SEO meta schemas, lightning-fast load scores, and core vitals audit.
- **Phase D (AI Integration)**: Custom agentic assistant tools to automate customer onboarding and user analysis.

## 3. Implementation Process & Timeline
We operate in structured two-week sprints:
- **Sprint 1 (Discovery & Wireframing)**: Wireframe design, database relationship setup, and visual style confirmation.
- **Sprint 2 (Core Development)**: REST API setup, frontend components integration, and initial staging deployment.
- **Sprint 3 (AI Integration & QA)**: Connect Gemini assistant workflows, verify responsive viewports, and finalize SEO checkups.

## 4. Expected Deliverables & Outcomes
- Live production web portal accessible on desktop and mobile viewports.
- Search-engine optimized landing frames ready to register customers.
- Full ownership code repository transfer upon contract completion.
- Ongoing bi-weekly progress dashboards.

## 5. Estimate & Timeline
- **Estimated Timeline**: 6 Weeks
- **Cost Estimate**: $4,999 - $7,500 (dependent on custom integrations)
- **Status**: Ready for immediate authorization.
`;
}

export default router;

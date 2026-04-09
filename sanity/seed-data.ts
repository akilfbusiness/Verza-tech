/**
 * Seed Data for Verza CMS
 * 
 * This file contains example content to populate your Sanity CMS.
 * Use this as a template for creating your initial content.
 */

export const categories = [
  {
    _type: 'category',
    name: 'AI Writing',
    slug: { current: 'ai-writing' },
    description: 'AI-powered writing and content generation tools',
    icon: '✍️',
  },
  {
    _type: 'category',
    name: 'Productivity',
    slug: { current: 'productivity' },
    description: 'Tools to boost productivity and streamline workflows',
    icon: '⚡',
  },
  {
    _type: 'category',
    name: 'Design & Creative',
    slug: { current: 'design-creative' },
    description: 'Design, image generation, and creative tools',
    icon: '🎨',
  },
  {
    _type: 'category',
    name: 'Development',
    slug: { current: 'development' },
    description: 'Developer tools, code assistants, and APIs',
    icon: '💻',
  },
  {
    _type: 'category',
    name: 'Marketing & SEO',
    slug: { current: 'marketing-seo' },
    description: 'Marketing automation, SEO, and analytics tools',
    icon: '📈',
  },
  {
    _type: 'category',
    name: 'Customer Support',
    slug: { current: 'customer-support' },
    description: 'Chatbots, help desks, and customer service platforms',
    icon: '💬',
  },
]

export const authors = [
  {
    _type: 'author',
    name: 'Sarah Mitchell',
    slug: { current: 'sarah-mitchell' },
    bio: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Senior tech reviewer with 8+ years of experience testing and evaluating SaaS platforms. Specializes in productivity tools and AI applications.',
          },
        ],
        style: 'normal',
      },
    ],
    role: 'Senior Tech Reviewer',
    expertise: ['SaaS', 'AI Tools', 'Productivity Software'],
    email: 'sarah@verza.com',
    socialLinks: {
      twitter: 'https://twitter.com/sarahreviews',
      linkedin: 'https://linkedin.com/in/sarahmitchell',
    },
  },
  {
    _type: 'author',
    name: 'Alex Chen',
    slug: { current: 'alex-chen' },
    bio: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Developer and software architect who reviews development tools and APIs. Passionate about helping teams choose the right tech stack.',
          },
        ],
        style: 'normal',
      },
    ],
    role: 'Lead Developer & Tech Analyst',
    expertise: ['Developer Tools', 'APIs', 'Cloud Platforms'],
    email: 'alex@verza.com',
    socialLinks: {
      github: 'https://github.com/alexchen',
      twitter: 'https://twitter.com/alexdevtools',
    },
  },
]

export const sampleTools = [
  {
    _type: 'tool',
    name: 'NotionAI',
    slug: { current: 'notion-ai' },
    tagline: 'Your AI-powered workspace for notes, docs, and collaboration',
    description: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Notion AI combines a powerful workspace with AI assistance to help you write, brainstorm, and organize your work more efficiently.',
          },
        ],
        style: 'normal',
      },
    ],
    website: 'https://notion.so',
    affiliateLink: 'https://notion.so?ref=verza',
    pricing: {
      model: 'freemium',
      startingPrice: 0,
      currency: 'USD',
      pricingDetails: 'Free for personal use, paid plans start at $10/month',
    },
    features: [
      'AI writing assistant',
      'Collaborative workspace',
      'Templates and databases',
      'Integration with 100+ apps',
      'Mobile apps for iOS and Android',
    ],
    useCases: [
      'Note-taking and knowledge management',
      'Project planning and tracking',
      'Team wikis and documentation',
      'Content creation and blogging',
    ],
    pros: [
      'Extremely flexible and customizable',
      'Great collaboration features',
      'AI assistance for writing and brainstorming',
      'Beautiful, intuitive interface',
    ],
    cons: [
      'Can be overwhelming for beginners',
      'Mobile app lacks some features',
      'Performance issues with large databases',
    ],
    targetAudience: 'Teams, knowledge workers, content creators, students',
    rating: 4.5,
    isVerified: true,
    isFeatured: true,
    status: 'active',
  },
  {
    _type: 'tool',
    name: 'ChatGPT',
    slug: { current: 'chatgpt' },
    tagline: 'Advanced AI assistant for writing, coding, and problem-solving',
    description: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'ChatGPT is OpenAI\'s conversational AI that can help with writing, coding, research, and creative tasks through natural language interaction.',
          },
        ],
        style: 'normal',
      },
    ],
    website: 'https://chat.openai.com',
    affiliateLink: 'https://chat.openai.com?ref=verza',
    pricing: {
      model: 'freemium',
      startingPrice: 0,
      currency: 'USD',
      pricingDetails: 'Free tier available, ChatGPT Plus at $20/month',
    },
    features: [
      'Natural language understanding',
      'Code generation and debugging',
      'Multi-language support',
      'Web browsing capability',
      'Image analysis (GPT-4)',
    ],
    useCases: [
      'Content writing and editing',
      'Programming assistance',
      'Research and learning',
      'Brainstorming and ideation',
    ],
    pros: [
      'Highly capable and versatile',
      'Constantly improving with updates',
      'Great for technical and creative tasks',
      'Free tier available',
    ],
    cons: [
      'Can generate incorrect information',
      'Requires internet connection',
      'Rate limits on free tier',
    ],
    targetAudience: 'Developers, writers, students, professionals',
    rating: 4.7,
    isVerified: true,
    isFeatured: true,
    status: 'active',
  },
]

export const sampleFAQs = [
  {
    _type: 'faq',
    question: 'What is Verza?',
    answer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Verza is a comprehensive review platform for SaaS and AI tools. We provide in-depth reviews, comparisons, and recommendations to help you choose the right software for your needs.',
          },
        ],
        style: 'normal',
      },
    ],
    category: 'General',
    isPublished: true,
  },
  {
    _type: 'faq',
    question: 'How do you review tools?',
    answer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our expert team tests each tool extensively, evaluating features, pricing, usability, and performance. We provide honest, unbiased reviews based on real-world usage.',
          },
        ],
        style: 'normal',
      },
    ],
    category: 'Reviews',
    isPublished: true,
  },
  {
    _type: 'faq',
    question: 'Are your affiliate links clearly disclosed?',
    answer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Yes, we clearly disclose all affiliate relationships. When you purchase through our links, we may earn a commission at no extra cost to you. This helps us keep Verza free and independent.',
          },
        ],
        style: 'normal',
      },
    ],
    category: 'General',
    isPublished: true,
  },
]

/**
 * Instructions for importing this data into Sanity:
 * 
 * 1. Go to your Sanity Studio at /studio
 * 2. Use the Vision plugin to run GROQ queries
 * 3. Manually create content using the Studio interface
 * 4. OR use the Sanity CLI to import data programmatically
 * 
 * For programmatic import:
 * - Install @sanity/client
 * - Create a script that uses client.create() or client.createOrReplace()
 * - Run the script to populate your dataset
 */

import logo from './logo.svg'
import logo_icon from './logo_icon.svg'
import facebook_icon from './facebook_icon.svg'
import instagram_icon from './instagram_icon.svg'
import twitter_icon from './twitter_icon.svg'
import star_icon from './star_icon.svg'
import rating_star from './rating_star.svg'
import sample_img_1 from './sample_img_1.png'
import sample_img_2 from './sample_img_2.png'
import sample_img_3 from './sample_img_3.jpeg'
import profile_img_1 from './profile_img_1.png'
import profile_img_2 from './profile_img_2.png'
import step_icon_1 from './step_icon_1.svg'
import step_icon_2 from './step_icon_2.svg'
import step_icon_3 from './step_icon_3.svg'
import email_icon from './email_icon.svg'
import lock_icon from './lock_icon.svg'
import cross_icon from './cross_icon.svg'
import star_group from './star_group.png'
import credit_star from './credit_star.svg'
import profile_icon from './profile_icon.png'
import github_icon from './github_icon.svg'
import linkedin_icon from './linkedin_icon.svg'
import discord_icon from './discord_icon.svg'

export const assets = {
  // Brand & Logos
  logo,
  logo_icon,

  // Social Media
  facebook_icon,
  instagram_icon,
  twitter_icon,
  github_icon,
  linkedin_icon,
  discord_icon,

  // UI Elements
  star_icon,
  rating_star,
  star_group,
  credit_star,
  cross_icon,

  // Sample Images (only existing ones)
  sample_img_1,
  sample_img_2,
  sample_img_3,

  // Profile Images
  profile_img_1,
  profile_img_2,
  profile_icon,

  // Step Icons
  step_icon_1,
  step_icon_2,
  step_icon_3,

  // Form Icons
  email_icon,
  lock_icon,
}

// Fallback sample images array - reuse existing images
export const sampleImages = [
  sample_img_1,
  sample_img_2,
  sample_img_3,
  sample_img_1, // Reuse as fallback
  sample_img_2, // Reuse as fallback
];

export const stepsData = [
  {
    title: 'Describe Your Vision',
    description: 'Type a phrase, sentence, or paragraph that describes the image you want to create. Be as detailed or creative as you like!',
    icon: step_icon_1,
    color: 'from-blue-500 to-cyan-500',
    tips: [
      'Use descriptive adjectives',
      'Mention art style preferences',
      'Include colors and mood'
    ]
  },
  {
    title: 'Watch the Magic',
    description: 'Our advanced AI-powered engine will transform your text into a high-quality, unique image in seconds using state-of-the-art technology.',
    icon: step_icon_2,
    color: 'from-purple-500 to-pink-500',
    tips: [
      'Real-time progress tracking',
      'Multiple style options',
      'Quality optimization'
    ]
  },
  {
    title: 'Download & Share',
    description: 'Instantly download your creation in multiple formats or share it directly with the world from our platform. All images are saved to your gallery.',
    icon: step_icon_3,
    color: 'from-green-500 to-emerald-500',
    tips: [
      'Multiple format options',
      'One-click sharing',
      'Auto-save to gallery'
    ]
  },
];

export const testimonialsData = [
  {
    image: profile_img_1,
    name: 'Sarah Chen',
    role: 'Digital Artist',
    company: 'Creative Studio',
    stars: 5,
    text: "Text2Art has revolutionized my creative process. The AI understands artistic nuances and produces stunning results that align perfectly with my vision. A game-changer for digital artists!",
    featured: true,
    social: '@sarahchen_art'
  },
  {
    image: profile_img_2,
    name: 'Marcus Rodriguez',
    role: 'Marketing Director',
    company: 'TechCorp Inc',
    stars: 5,
    text: "We use Text2Art daily for our marketing campaigns. The speed and quality of generated images are exceptional, saving us countless hours on content creation. Highly recommended!",
    featured: false,
    social: '@marcus_rdz'
  },
  {
    image: profile_img_1,
    name: 'Emily Parker',
    role: 'UI/UX Designer',
    company: 'DesignHub',
    stars: 5,
    text: "The versatility of Text2Art is incredible. From mockups to concept art, it helps me visualize designs quickly. The intuitive interface makes it a joy to use in my design workflow.",
    featured: true,
    social: '@emilyp_designs'
  },
];

export const plans = [
  {
    id: 'Starter',
    price: 4.99,
    credits: 20,
    desc: 'Perfect for getting started with AI image generation',
    features: [
      '20 AI image generations',
      'Basic art styles included',
      'Standard resolution (1024x1024)',
      'Email support',
      '7-day free trial available',
      'Personal use license'
    ],
    popular: false,
    badge: 'Starter',
    color: 'blue',
    savings: null,
    bestFor: 'Hobbyists & Beginners'
  },
  {
    id: 'Pro',
    price: 19.99,
    credits: 100,
    desc: 'Best for regular creators and professionals',
    features: [
      '100 AI image generations',
      'All art styles unlocked',
      'High resolution (2048x2048)',
      'Priority email support',
      'Commercial license included',
      'Batch processing',
      'Advanced editing tools',
      'Faster generation times'
    ],
    popular: true,
    badge: 'Most Popular',
    color: 'purple',
    savings: 50,
    bestFor: 'Freelancers & Professionals'
  },
  {
    id: 'Enterprise',
    price: 49.99,
    credits: 300,
    desc: 'For power users, teams, and agencies',
    features: [
      '300 AI image generations',
      'All art styles + custom training',
      '4K resolution (4096x4096)',
      '24/7 dedicated support',
      'Extended commercial license',
      'Team collaboration tools',
      'API access',
      'Custom model training',
      'White-label solutions',
      'Priority queue access'
    ],
    popular: false,
    badge: 'Ultimate',
    color: 'green',
    savings: 67,
    bestFor: 'Teams & Agencies'
  }
];

// Additional pricing tiers for future use
export const additionalPlans = [
  {
    id: 'Free Trial',
    price: 0,
    credits: 5,
    desc: 'Try before you buy with limited access',
    features: [
      '5 free image generations',
      'Basic art styles',
      'Standard resolution',
      'Community support',
      'Watermarked downloads',
      '7-day access'
    ],
    popular: false,
    badge: 'Free',
    color: 'gray'
  },
  {
    id: 'Business',
    price: 99.99,
    credits: 1000,
    desc: 'For agencies and large teams',
    features: [
      '1000 AI image generations',
      'All features from Enterprise',
      'Custom art style development',
      'Dedicated account manager',
      'White-label solutions',
      'SLA guarantee',
      'Custom integrations',
      'Training sessions'
    ],
    popular: false,
    badge: 'Business',
    color: 'orange'
  }
];

// Plan features comparison
export const planFeatures = [
  {
    feature: 'AI Image Generations',
    starter: '20 per month',
    pro: '100 per month',
    enterprise: '300 per month',
    icon: '🖼️'
  },
  {
    feature: 'Maximum Resolution',
    starter: '1024x1024',
    pro: '2048x2048',
    enterprise: '4096x4096',
    icon: '📐'
  },
  {
    feature: 'Art Styles Available',
    starter: '10 Basic Styles',
    pro: '25+ Premium Styles',
    enterprise: 'All Styles + Custom',
    icon: '🎨'
  },
  {
    feature: 'Commercial License',
    starter: 'Personal Use',
    pro: 'Commercial',
    enterprise: 'Extended Commercial',
    icon: '💼'
  },
  {
    feature: 'Support',
    starter: 'Email',
    pro: 'Priority Email',
    enterprise: '24/7 Dedicated',
    icon: '🛟'
  },
  {
    feature: 'API Access',
    starter: 'No',
    pro: 'Limited',
    enterprise: 'Full Access',
    icon: '🔌'
  },
  {
    feature: 'Team Collaboration',
    starter: 'No',
    pro: 'Basic',
    enterprise: 'Advanced',
    icon: '👥'
  },
  {
    feature: 'Generation Speed',
    starter: 'Standard',
    pro: 'Fast',
    enterprise: 'Priority',
    icon: '⚡'
  }
];

// FAQ data for pricing page
export const pricingFAQ = [
  {
    question: "How do credits work?",
    answer: "Each credit allows you to generate one AI image. Credits don't expire and roll over to the next month if you don't use them all. Unused credits accumulate in your account.",
    category: "credits"
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features and pro-rated billing. When downgrading, changes take effect at the end of your billing cycle.",
    category: "billing"
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans include a 7-day free trial. You can cancel anytime during the trial period without being charged. No credit card required for the free trial.",
    category: "billing"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for enterprise customers.",
    category: "billing"
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service. Contact our support team for refund requests. Subscription cancellations are processed immediately.",
    category: "billing"
  },
  {
    question: "Can I use generated images commercially?",
    answer: "Yes! All images generated on Pro and Enterprise plans come with full commercial licenses. Starter plan images are for personal use only. You own the rights to all images you create.",
    category: "licensing"
  },
  {
    question: "How long does image generation take?",
    answer: "Most images are generated in 10-30 seconds depending on complexity and server load. Enterprise users get priority queue access for faster generation times.",
    category: "technical"
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to paid features until the end of your billing period.",
    category: "billing"
  }
];

// Social media links
export const socialLinks = {
  facebook: 'https://facebook.com/Text2Art',
  instagram: 'https://instagram.com/Text2Art',
  twitter: 'https://twitter.com/Text2Art',
  github: 'https://github.com/Text2Art',
  linkedin: 'https://linkedin.com/company/Text2Art'
};

// Contact information
export const contactInfo = {
  email: 'support@Text2Art.com',
  phone: '+1 (555) 123-4567',
  address: '123 AI Street, Tech City, TC 12345',
  businessHours: 'Mon-Fri: 9AM-6PM EST',
  supportEmail: 'help@Text2Art.com',
  salesEmail: 'sales@Text2Art.com'
};

// Company information
export const companyInfo = {
  name: 'Text2Art AI',
  description: 'Transforming ideas into stunning visual art through advanced artificial intelligence.',
  founded: 2024,
  mission: 'To make AI-powered image generation accessible to everyone, from individual creators to large enterprises.',
  vision: 'Democratizing creativity through artificial intelligence.',
  values: ['Innovation', 'Accessibility', 'Quality', 'Community']
};

// Feature categories for the upload page (using emojis as icons)
export const featureCategories = [
  {
    id: 'generation',
    name: 'Image Generation',
    features: [
      {
        id: 'generate',
        title: '🎨 Generate AI Image',
        description: 'Create new images from text prompts',
        icon: '🪄',
        color: 'pink',
        credits: 5
      }
    ]
  },
  {
    id: 'enhancement',
    name: 'Image Enhancement',
    features: [
      {
        id: 'enhance',
        title: '✨ Enhance Image',
        description: 'Improve quality, colors, and details with AI',
        icon: '⚡',
        color: 'purple',
        credits: 2
      },
      {
        id: 'upscale',
        title: '🔍 Upscale Image',
        description: 'Increase resolution up to 4x with AI',
        icon: '📈',
        color: 'blue',
        credits: 2
      }
    ]
  },
  {
    id: 'editing',
    name: 'Image Editing',
    features: [
      {
        id: 'remove-bg',
        title: '🎯 Remove Background',
        description: 'AI-powered automatic background removal',
        icon: '✂️',
        color: 'green',
        credits: 3
      },
      {
        id: 'optimize',
        title: '💫 Optimize Image',
        description: 'Compress and optimize for web performance',
        icon: '🚀',
        color: 'orange',
        credits: 1
      },
      
    ]
  }
];

// Quick prompts for image generation
export const quickPrompts = [
  "A majestic dragon flying over mountains at sunset",
  "Cyberpunk cityscape with neon lights and flying cars",
  "Peaceful forest with magical glowing mushrooms",
  "Astronaut exploring an alien planet with strange plants",
  "Steampunk mechanical owl with intricate gears",
  "Underwater castle with coral and sea creatures",
  "Fantasy warrior with glowing sword in ancient ruins",
  "Futuristic spaceship interior with holographic displays"
];

// Image formats for download
export const imageFormats = [
  { value: 'PNG', label: 'PNG (Best Quality)', description: 'Lossless format with transparency' },
  { value: 'JPEG', label: 'JPEG (Small Size)', description: 'Compressed format for web' },
  { value: 'WebP', label: 'WebP (Modern)', description: 'Next-gen format, smaller files' },
  { value: 'SVG', label: 'SVG (Vector)', description: 'Scalable vector format' }
];

export default {
  assets,
  sampleImages,
  stepsData,
  testimonialsData,
  plans,
  additionalPlans,
  planFeatures,
  pricingFAQ,
  socialLinks,
  contactInfo,
  companyInfo,
  featureCategories,
  quickPrompts,
  imageFormats
};
import logo from './logo.svg'
import logo_icon from './logo_icon.svg'
import facebook_icon from './facebook_icon.svg'
import instagram_icon from './instagram_icon.svg'
import twitter_icon from './twitter_icon.svg'
import star_icon from './star_icon.svg'
import rating_star from './rating_star.svg'
import sample_img_1 from './sample_img_1.png'
import sample_img_2 from './sample_img_2.png'
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

export const assets = {
  logo,
  logo_icon,
  facebook_icon,
  instagram_icon,
  twitter_icon,
  star_icon,
  rating_star,
  sample_img_1,
  sample_img_2,
  email_icon,
  lock_icon,
  cross_icon,
  star_group,
  credit_star,
  profile_icon,
  github_icon,
  linkedin_icon,
  // Removed user_icon since it doesn't exist
  step_icon_1,
  step_icon_2,
  step_icon_3,
  profile_img_1,
  profile_img_2
}

export const stepsData = [
  {
    title: 'Describe Your Vision',
    description: 'Type a phrase, sentence, or paragraph that describes the image you want to create.',
    icon: step_icon_1,
  },
  {
    title: 'Watch the Magic',
    description: 'Our AI-powered engine will transform your text into a high-quality, unique image in seconds.',
    icon: step_icon_2,
  },
  {
    title: 'Download & Share',
    description: 'Instantly download your creation or share it with the world directly from our platform.',
    icon: step_icon_3,
  },
];

export const testimonialsData = [
  {
    image: profile_img_1,
    name: 'Sarah Chen',
    role: 'Digital Artist',
    stars: 5,
    text: "Imagify has revolutionized my creative process. The AI understands artistic nuances and produces stunning results that align perfectly with my vision. A game-changer for digital artists!"
  },
  {
    image: profile_img_2,
    name: 'Marcus Rodriguez',
    role: 'Marketing Director',
    stars: 5,
    text: "We use Imagify daily for our marketing campaigns. The speed and quality of generated images are exceptional, saving us countless hours on content creation. Highly recommended!"
  },
  {
    image: profile_img_1,
    name: 'Emily Parker',
    role: 'UI/UX Designer',
    stars: 5,
    text: "The versatility of Imagify is incredible. From mockups to concept art, it helps me visualize designs quickly. The intuitive interface makes it a joy to use in my design workflow."
  },
];

export const plans = [
  {
    id: 'Starter',
    price: 4.99,
    credits: 10,
    desc: 'Perfect for getting started with AI image generation',
    features: [
      '10 AI image generations',
      'Basic art styles included',
      'Standard resolution (1024x1024)',
      'Email support',
      '7-day free trial available'
    ],
    popular: false,
    badge: 'Most Popular'
  },
  {
    id: 'Pro',
    price: 19.99,
    credits: 50,
    desc: 'Best for regular creators and professionals',
    features: [
      '50 AI image generations',
      'All art styles unlocked',
      'High resolution (2048x2048)',
      'Priority email support',
      'Commercial license included',
      'Batch processing'
    ],
    popular: true,
    badge: 'Best Value'
  },
  {
    id: 'Enterprise',
    price: 49.99,
    credits: 150,
    desc: 'For power users, teams, and agencies',
    features: [
      '150 AI image generations',
      'All art styles + custom training',
      '4K resolution (4096x4096)',
      '24/7 dedicated support',
      'Extended commercial license',
      'Team collaboration tools',
      'API access',
      'Custom model training'
    ],
    popular: false,
    badge: 'Ultimate'
  }
];

// Additional pricing tiers for future use
export const additionalPlans = [
  {
    id: 'Free Trial',
    price: 0,
    credits: 3,
    desc: 'Try before you buy with limited access',
    features: [
      '3 free image generations',
      'Basic art styles',
      'Standard resolution',
      'Community support',
      'Watermarked downloads'
    ],
    popular: false,
    badge: 'Free'
  },
  {
    id: 'Business',
    price: 99.99,
    credits: 500,
    desc: 'For agencies and large teams',
    features: [
      '500 AI image generations',
      'All features from Enterprise',
      'Custom art style development',
      'Dedicated account manager',
      'White-label solutions',
      'SLA guarantee'
    ],
    popular: false,
    badge: 'Custom'
  }
];

// Plan features comparison
export const planFeatures = [
  {
    feature: 'AI Image Generations',
    starter: '10 per month',
    pro: '50 per month',
    enterprise: '150 per month'
  },
  {
    feature: 'Maximum Resolution',
    starter: '1024x1024',
    pro: '2048x2048',
    enterprise: '4096x4096'
  },
  {
    feature: 'Art Styles Available',
    starter: '5 Basic Styles',
    pro: '15+ Styles',
    enterprise: 'All Styles + Custom'
  },
  {
    feature: 'Commercial License',
    starter: 'No',
    pro: 'Yes',
    enterprise: 'Extended License'
  },
  {
    feature: 'Support',
    starter: 'Email',
    pro: 'Priority Email',
    enterprise: '24/7 Dedicated'
  },
  {
    feature: 'API Access',
    starter: 'No',
    pro: 'No',
    enterprise: 'Yes'
  },
  {
    feature: 'Team Collaboration',
    starter: 'No',
    pro: 'No',
    enterprise: 'Yes'
  }
];

// FAQ data for pricing page
export const pricingFAQ = [
  {
    question: "How do credits work?",
    answer: "Each credit allows you to generate one AI image. Credits don't expire and roll over to the next month if you don't use them all."
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans include a 7-day free trial. You can cancel anytime during the trial period without being charged."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service. Contact our support team for refund requests."
  },
  {
    question: "Can I use generated images commercially?",
    answer: "Yes! All images generated on Pro and Enterprise plans come with commercial licenses. Starter plan images are for personal use only."
  }
];

// Social media links
export const socialLinks = {
  facebook: 'https://facebook.com/imagify',
  instagram: 'https://instagram.com/imagify',
  twitter: 'https://twitter.com/imagify',
  github: 'https://github.com/imagify',
  linkedin: 'https://linkedin.com/company/imagify'
};

// Contact information
export const contactInfo = {
  email: 'support@imagify.com',
  phone: '+1 (555) 123-4567',
  address: '123 AI Street, Tech City, TC 12345',
  businessHours: 'Mon-Fri: 9AM-6PM EST'
};

// Company information
export const companyInfo = {
  name: 'Imagify AI',
  description: 'Transforming ideas into stunning visual art through advanced artificial intelligence.',
  founded: 2024,
  mission: 'To make AI-powered image generation accessible to everyone, from individual creators to large enterprises.'
};
import type { Language } from './LanguageContext'

interface HowItWorksStep {
  step: string
  title: string
  description: string
}

interface HomeCopy {
  eyebrow: string
  heading: string
  subheading: string
  ctaLabel: string
  disclaimer: string
  discoverEyebrow: string
  discoverTitle: string
  discoverPoints: string[]
  howEyebrow: string
  howTitle: string
  howItWorks: HowItWorksStep[]
  noteTitle: string
  noteBody: string
}

interface QuestionCopy {
  loading: string
  questionOf: (current: number, total: number) => string
  back: string
  continue_: string
  seeResult: string
}

interface UiCopy {
  home: HomeCopy
  question: QuestionCopy
  languageToggle: string
  themeToggleToDark: string
  themeToggleToLight: string
}

export const uiText: Record<Language, UiCopy> = {
  en: {
    home: {
      eyebrow: 'Free · 5 minutes · No right or wrong answers',
      heading: 'Discover Your Relationship Pattern',
      subheading:
        'Understand the patterns that may be shaping the way you think, feel, and respond in relationships — with a free 5-minute assessment.',
      ctaLabel: 'Discover My Pattern',
      disclaimer: 'This is a self-awareness tool for reflection — not a clinical diagnosis.',
      discoverEyebrow: "What you'll discover",
      discoverTitle: 'What the assessment reflects on',
      discoverPoints: [
        'Your primary relationship pattern',
        'A secondary pattern that may also be at play',
        'Common triggers that tend to set it off',
        'The recurring thought → emotion → reaction cycle behind it',
        'Areas you may want to explore more deeply',
      ],
      howEyebrow: 'How it works',
      howTitle: 'Four simple steps',
      howItWorks: [
        {
          step: '1',
          title: 'Answer a few honest questions',
          description: 'One question at a time — there are no right or wrong answers.',
        },
        {
          step: '2',
          title: 'Enter your details',
          description: 'So we can save and send you your personalised result.',
        },
        {
          step: '3',
          title: 'Get your personalised pattern',
          description: 'See your primary and secondary relationship patterns.',
        },
        {
          step: '4',
          title: 'Explore what may be driving the cycle',
          description: 'Understand the trigger, thought, emotion, and reaction behind it.',
        },
      ],
      noteTitle: 'A note before you begin',
      noteBody:
        "This assessment is a self-awareness and self-reflection tool. It is designed to help you notice possible patterns in how you relate to others — it is not a clinical or medical diagnosis, and it doesn't label or define you. Your result is a starting point for reflection, not a conclusion.",
    },
    question: {
      loading: 'Loading your assessment…',
      questionOf: (current, total) => `Question ${current} of ${total}`,
      back: '← Back',
      continue_: 'Continue →',
      seeResult: 'See My Result →',
    },
    languageToggle: 'हिन्दी',
    themeToggleToDark: 'Dark',
    themeToggleToLight: 'Light',
  },
  hi: {
    home: {
      eyebrow: 'मुफ़्त · 5 मिनट · कोई सही या गलत उत्तर नहीं',
      heading: 'अपना Relationship Pattern जानें',
      subheading:
        'एक मुफ़्त 5-मिनट के assessment से उन patterns को समझें जो शायद तय करते हैं कि आप रिश्तों में कैसे सोचते, महसूस करते और react करते हैं।',
      ctaLabel: 'मेरा Pattern जानें',
      disclaimer: 'यह self-awareness और reflection के लिए एक tool है — कोई clinical diagnosis नहीं।',
      discoverEyebrow: 'आप क्या जानेंगे',
      discoverTitle: 'यह assessment किन बातों पर आधारित है',
      discoverPoints: [
        'आपका primary relationship pattern',
        'एक secondary pattern जो शायद साथ में active हो',
        'वे common triggers जो इसे शुरू करते हैं',
        'इसके पीछे का बार-बार दोहराने वाला thought → emotion → reaction cycle',
        'वे areas जिन्हें आप और गहराई से explore करना चाहें',
      ],
      howEyebrow: 'यह कैसे काम करता है',
      howTitle: 'चार आसान steps',
      howItWorks: [
        {
          step: '1',
          title: 'कुछ honest सवालों के जवाब दें',
          description: 'एक बार में एक सवाल — कोई सही या गलत जवाब नहीं है।',
        },
        {
          step: '2',
          title: 'अपनी details भरें',
          description: 'ताकि हम आपका personalised result save करके आपको भेज सकें।',
        },
        {
          step: '3',
          title: 'अपना personalised pattern पाएं',
          description: 'अपने primary और secondary relationship patterns देखें।',
        },
        {
          step: '4',
          title: 'जानें इस cycle के पीछे क्या है',
          description: 'इसके पीछे के trigger, thought, emotion और reaction को समझें।',
        },
      ],
      noteTitle: 'शुरू करने से पहले एक बात',
      noteBody:
        'यह assessment एक self-awareness और self-reflection tool है। यह आपको यह notice करने में मदद करता है कि आप दूसरों से कैसे जुड़ते हैं — यह कोई clinical या medical diagnosis नहीं है, और यह आपको label या define नहीं करता। आपका result सोचने की एक शुरुआत है, कोई अंतिम निष्कर्ष नहीं।',
    },
    question: {
      loading: 'आपका assessment load हो रहा है…',
      questionOf: (current, total) => `प्रश्न ${current} में से ${total}`,
      back: '← पीछे',
      continue_: 'आगे बढ़ें →',
      seeResult: 'मेरा Result देखें →',
    },
    languageToggle: 'English',
    themeToggleToDark: 'डार्क',
    themeToggleToLight: 'लाइट',
  },
}

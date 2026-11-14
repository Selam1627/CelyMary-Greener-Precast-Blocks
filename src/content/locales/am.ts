// DRAFT – awaiting review. Amharic translation of en.ts; it must say exactly
// the same as the English. Remove this note and set draft to false for "am"
// in src/content/languages.ts once the translation has been reviewed.
import type { SiteContent } from '../types.js'

export const am: SiteContent = {
  languageSwitcher: {
    label: 'ቋንቋ',
  },

  hero: {
    companyName: 'CelyMary Greener Precast Blocks',
    companyNameGeez: 'ሰሊሜሪ አረንጓዴ ብሎኬት',
    // The founder's wording: keep exactly as it is.
    tagline: 'ዝቅተኛ ካርቦን ያለው ብሎኬት ለአረንጓዴ ሕንፃዎች',
    actions: [
      { label: 'ከእኛ ጋር ይሥሩ', href: '#work-with-us' },
      { label: 'ያግኙን', href: '#contact' },
    ],
  },

  solution: {
    heading: 'የእኛ መፍትሔ',
    benefits: [
      {
        title: 'ዝቅተኛ ካርቦን',
        description: 'ከተለመዱት የኮንክሪት ብሎኬቶች እጅግ ያነሰ የካርቦን አሻራ እንዲኖራቸው ተደርገው የተነደፉ።',
      },
      {
        title: 'እንደገና ጥቅም ላይ የዋሉ የኢንዱስትሪ ቁሳቁሶች',
        description: 'እንደገና ጥቅም ላይ ከዋሉ የኢንዱስትሪ ቁሳቁሶች የተሠሩ፣ ለኢንዱስትሪ ተረፈ ምርቶች ሁለተኛ ሕይወት የሚሰጡ።',
      },
      {
        title: 'የአገር ውስጥ ምርት',
        description: 'ጥቅም ላይ በሚውሉበት አካባቢ አቅራቢያ በአገር ውስጥ እንዲመረቱ ተደርገው የተነደፉ።',
      },
    ],
  },

  products: {
    heading: 'ያቀድናቸው ምርቶች',
    statusLabel: 'በልማት ላይ',
    items: [
      {
        id: 'standard-building-blocks',
        name: 'መደበኛ የግንባታ ብሎኬቶች',
        description: 'በመኖሪያ እና በንግድ ፕሮጀክቶች ውስጥ ግድግዳዎችን ለመገንባት።',
        icon: 'building-block',
      },
      {
        id: 'solar-panel-ballast-blocks',
        name: 'የፀሐይ ፓነል ማረጋጊያ ብሎኬቶች',
        description: 'የፀሐይ ፓነል መግጠሚያ መዋቅሮችን በጠፍጣፋ ጣሪያዎች እና በክፍት መሬት ላይ፣ ጣሪያውን ሳይበሱ በቦታቸው ለማቆየት።',
        icon: 'solar-ballast',
      },
      {
        id: 'paving-blocks',
        name: 'የንጣፍ ብሎኬቶች',
        description: 'ለእግረኛ መንገዶች፣ ለግቢ ወለሎች፣ ለመኪና መግቢያዎች እና ለሕዝብ ቦታዎች።',
        icon: 'paving',
      },
      {
        id: 'retaining-wall-and-landscaping-blocks',
        name: 'የድጋፍ ግድግዳ እና የመሬት ገጽታ ብሎኬቶች',
        description: 'በተዳፋት ላይ አፈርን ለመያዝ እና የአትክልት ቦታዎችን፣ እርከኖችን እና የአበባ መትከያዎችን ለመቅረጽ።',
        icon: 'retaining-wall',
      },
      {
        id: 'kerbs-and-edging',
        name: 'የመንገድ ጠርዝ እና የዳር ብሎኬቶች',
        description: 'የመንገዶችን፣ የእግረኛ መንገዶችን፣ የሣር ሜዳዎችን እና የአበባ ማሳዎችን ጠርዝ ለማጠናቀቅ።',
        icon: 'kerb',
      },
    ],
  },

  audiences: {
    heading: 'ከእኛ ጋር ይሥሩ',
    items: [
      {
        id: 'customers',
        title: 'ለደንበኞች',
        description:
          'አርክቴክቶች፣ መሐንዲሶች፣ ገንቢዎች እና አልሚዎች፦ ያቀድናቸው ዝቅተኛ ካርቦን ያላቸው ብሎኬቶች ከፕሮጀክቶችዎ ጋር እንዴት ሊስማሙ እንደሚችሉ ያነጋግሩን።',
      },
      {
        id: 'investors',
        title: 'ለባለሀብቶች',
        description:
          'ዝቅተኛ ካርቦን ያላቸው ቀድመው የተሠሩ ብሎኬቶችን በማልማት ላይ ያለን በመጀመሪያ ደረጃ ላይ የሚገኝ ኩባንያ ነን፤ ምርምር እና የቤተ ሙከራ ልማት ለመጀመር የገንዘብ ድጋፍ እየፈለግን ነው። ውይይት ለመጀመር ያግኙን።',
      },
      {
        id: 'partners',
        title: 'ለአጋሮች',
        description:
          'ዝቅተኛ ካርቦን ባላቸው የግንባታ ምርቶች ላይ ለመተባበር ፍላጎት ካላቸው የኢንዱስትሪ ኩባንያዎች፣ የምርምር ተቋማት እና ሌሎች ድርጅቶች ጋር ለመወያየት ደስተኞች ነን።',
      },
    ],
  },

  roadmap: {
    heading: 'ደረጃ እና የወደፊት ዕቅድ',
    statement: 'በመጀመሪያ ደረጃ ላይ ያለ ኩባንያ ነን፤ በአሁኑ ጊዜ በጽንሰ-ሐሳብ ደረጃ ላይ እንገኛለን።',
    steps: [
      {
        id: 'concept-and-planning',
        title: 'ጽንሰ-ሐሳብ እና ዕቅድ',
        statusLabel: 'የአሁኑ ደረጃ',
      },
      {
        id: 'research-and-lab-development',
        title: 'ምርምር እና የቤተ ሙከራ ልማት',
        note: 'ይህንን ምዕራፍ ለመጀመር የገንዘብ ድጋፍ እየፈለግን ነው።',
      },
      {
        id: 'pilot-production',
        title: 'የሙከራ ምርት',
      },
    ],
  },

  team: {
    heading: 'ቡድን',
    members: [
      {
        name: 'Selam Berhe Beyene',
        role: 'መሥራች',
        // REVIEW: written without a gendered verb form; adjust if needed.
        bio: 'በUniversidad de Cantabria የሲሚንቶ ዘርፍን ካርቦን ልቀት በመቀነስ ላይ የፒኤችዲ ተመራማሪ፤ ዝቅተኛ ካርቦን ያላቸው የግንባታ ቁሳቁሶችን በማልማት ላይ።',
      },
      {
        name: 'Meron Gebreselassie Tadesse',
        role: 'ተባባሪ መሥራች',
        bio: 'በፕሮጀክት አስተዳደር ዘርፍ ሙያዊ ልምድ።',
      },
    ],
  },

  contact: {
    heading: 'ያግኙን',
    labels: {
      name: 'ስም',
      email: 'ኢሜይል',
      visitorType: 'ማን ነዎት?',
      product: 'የሚፈልጉት ምርት (አማራጭ)',
      message: 'መልዕክት',
    },
    visitorTypes: [
      { id: 'architect', label: 'አርክቴክት' },
      { id: 'engineer', label: 'መሐንዲስ' },
      { id: 'builder', label: 'ገንቢ' },
      { id: 'real-estate-developer', label: 'የሪል እስቴት አልሚ' },
      { id: 'investor', label: 'ባለሀብት' },
      { id: 'partner', label: 'አጋር' },
      { id: 'other', label: 'ሌላ' },
    ],
    visitorTypePrompt: 'አንዱን ይምረጡ',
    productPrompt: 'የተለየ ምርት የለም',
    submitLabel: 'መልዕክት ይላኩ',
    sendingLabel: 'በመላክ ላይ…',
    successMessage: 'እናመሰግናለን፣ መልዕክትዎ ተልኳል። በኢሜይል መልስ እንሰጥዎታለን።',
    failureMessage: 'ይቅርታ፣ መልዕክትዎ ሊላክ አልቻለም። እባክዎ ከጥቂት ደቂቃዎች በኋላ እንደገና ይሞክሩ፣ ወይም በቀጥታ ኢሜይል ይላኩልን።',
    directContactPrefix: 'ወይም በቀጥታ በዚህ አድራሻ ይጻፉልን፦',
    spamTrapLabel: 'ይህንን መስክ ባዶ ይተዉት',
    errors: {
      nameRequired: 'እባክዎ ስምዎን ያስገቡ።',
      nameTooLong: 'እባክዎ ስምዎ ከ100 ቁምፊዎች ያልበለጠ ይሁን።',
      emailRequired: 'እባክዎ የኢሜይል አድራሻዎን ያስገቡ።',
      emailInvalid: 'እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ፣ ለምሳሌ name@example.com።',
      visitorTypeRequired: 'እባክዎ ማን እንደሆኑ ይምረጡ።',
      messageRequired: 'እባክዎ መልዕክት ያስገቡ።',
      messageTooLong: 'እባክዎ መልዕክትዎ ከ5,000 ቁምፊዎች ያልበለጠ ይሁን።',
    },
  },
}

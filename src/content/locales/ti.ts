// DRAFT – awaiting review. Tigrinya translation of en.ts; it must say exactly
// the same as the English. Remove this note and set draft to false for "ti"
// in src/content/languages.ts once the translation has been reviewed.
import type { SiteContent } from '../types.js'

export const ti: SiteContent = {
  navigation: {
    skipLink: 'ናብ ቀንዲ ትሕዝቶ ሕለፉ',
    menuLabel: 'ቀንዲ ዝርዝር',
    menuButton: 'ዝርዝር',
    pages: {
      // The founder's wording: keep exactly as it is.
      home: 'መእተዊ',
      products: 'ፍርያት',
      about: 'ብዛዕባና',
      contact: 'ርኸቡና',
    },
  },

  notFound: {
    heading: 'እዚ ገፅ ኣይተረኸበን',
    message: 'ይቕሬታ፣ ዝደለኹምዎ ገፅ ክንረኽቦ ኣይከኣልናን።',
    homeLink: 'ናብ መእተዊ ገፅ ኪዱ',
  },

  languageSwitcher: {
    label: 'ቋንቋ',
  },

  hero: {
    companyName: 'CelyMary Greener Precast Blocks',
    companyShortName: 'ሰሊሜሪ',
    companyNameGeez: 'ሰሊሜሪ ሓምለዋይ ብሎኬት',
    // The founder's wording: keep exactly as it is.
    tagline: 'ዝተሓተ ካርቦን ዘለዎ ብሎኬት ንሓምለዋይ ህንፃታት',
    actions: [
      { label: 'ምሳና ስርሑ', href: '/about' },
      { label: 'ርኸቡና', href: '/contact' },
    ],
  },

  solution: {
    heading: 'ፍታሕና',
    benefits: [
      {
        title: 'ትሑት ካርቦን',
        description: 'ካብ ልሙዳት ናይ ኮንክሪት ብሎኬታት ብዙሕ ዝተሓተ ኣሰር ካርቦን ንክህልዎም ተባሂሎም ዝተሓንፀፁ።',
      },
      {
        title: 'ዳግማይ ዝተጠቕመሎም ኢንዱስትሪያዊ ኣቑሑት',
        description: 'ካብ ዳግማይ ዝተጠቕመሎም ኢንዱስትሪያዊ ኣቑሑት ዝተሰርሑ፣ ንተረፍ ኢንዱስትሪ ካልኣይ ህይወት ዝህቡ።',
      },
      {
        title: 'ናይ ከባቢ ምህርቲ',
        description: 'ኣብ ጥቕሚ ዝውዕሉሉ ቦታ ቀረባ፣ ኣብ ከባቢ ንክፍረዩ ተባሂሎም ዝተሓንፀፁ።',
      },
    ],
  },

  products: {
    heading: 'ዝተመደቡ ፍርያትና',
    statusLabel: 'ኣብ ምምዕባል ዘሎ',
    items: [
      {
        id: 'standard-building-blocks',
        name: 'ልሙዳት ብሎኬታት ህንፃ',
        description: 'ኣብ ናይ መንበሪን ንግድን ፕሮጀክትታት መናድቕ ንምህናፅ።',
        icon: 'building-block',
      },
      {
        id: 'solar-panel-ballast-blocks',
        name: 'ናይ ፀሓያዊ ፓነል መደገፊ ብሎኬታት',
        description: 'ናይ ፀሓያዊ ፓነል መትከሊ ስርዓታት ኣብ ፀፊሕ ናሕስታትን ክፉት መሬትን፣ ናሕሲ ከይተነኽዐ ኣብ ቦትኡ ንምሓዝ።',
        icon: 'solar-ballast',
      },
      {
        id: 'paving-blocks',
        name: 'ናይ ንጣፍ ብሎኬታት',
        description: 'ንመንገዲ እግሪ፣ ንቐፅሪ ገዛ፣ ንመእተዊ መካይንን ንህዝባዊ ቦታታትን።',
        icon: 'paving',
      },
      {
        id: 'retaining-wall-and-landscaping-blocks',
        name: 'ናይ ደጋፊ መንደቕን ምውዳብ ከባብን ብሎኬታት',
        description: 'ኣብ ፀድፊ ሓመድ ንምዕጋትን ንጀርዲናት፣ ደረጃታትን መትከሊ ዕምባባታትን ቅርፂ ንምሃብን።',
        icon: 'retaining-wall',
      },
      {
        id: 'kerbs-and-edging',
        name: 'ናይ ፅርግያ ደረትን ወሰንን',
        description: 'ንወሰናት ፅርግያታት፣ መንገድታት፣ ሳዕሪን ናይ ዕምባባ መትከሊ ቦታታትን ንምዝዛም።',
        icon: 'kerb',
      },
    ],
  },

  audiences: {
    heading: 'ምሳና ስርሑ',
    items: [
      {
        id: 'customers',
        title: 'ንዓማዊል',
        description:
          'ኣርክቴክትታት፣ መሃንድሳት፣ ሃነፅትን ኣልማዕትን፦ እቶም ዝተመደቡ ትሑት ካርቦን ዘለዎም ብሎኬታትና ምስ ፕሮጀክትታትኩም ብኸመይ ክሰማምዑ ከም ዝኽእሉ ተዘራረቡና።',
      },
      {
        id: 'investors',
        title: 'ንወፍረይቲ',
        description:
          'ትሑት ካርቦን ዘለዎም ኣቐዲሞም ዝተሰርሑ ብሎኬታት እነማዕብል ኣብ መጀመርታ ደረጃ ዘሎ ኩባንያ ኢና፣ ምርምርን ናይ ቤት ፈተነ ምምዕባልን ንምጅማር ድማ ገንዘባዊ ደገፍ ንደሊ ኣለና። ዘተ ንምጅማር ርኸቡና።',
      },
      {
        id: 'partners',
        title: 'ንመሻርኽቲ',
        description:
          'ምስ ኢንዱስትሪያዊ ኩባንያታት፣ ትካላት ምርምርን ኣብ ትሑት ካርቦን ዘለዎም ፍርያት ህንፃ ክተሓባበሩ ዝደልዩ ካልኦት ውድባትን ንምዝርራብ ፍቓደኛታት ኢና።',
      },
    ],
  },

  roadmap: {
    heading: 'ደረጃን መደብ ጉዕዞን',
    statement: 'ኣብ መጀመርታ ደረጃ ዘሎ ኩባንያ ኢና፣ ሕጂ ኣብ ደረጃ ሓሳብ ኢና ዘለና።',
    steps: [
      {
        id: 'concept-and-planning',
        title: 'ሓሳብን መደብን',
        statusLabel: 'ናይ ሕጂ ደረጃ',
      },
      {
        id: 'research-and-lab-development',
        title: 'ምርምርን ናይ ቤት ፈተነ ምምዕባልን',
        note: 'ነዚ ምዕራፍ ንምጅማር ገንዘባዊ ደገፍ ንደሊ ኣለና።',
      },
      {
        id: 'pilot-production',
        title: 'ናይ ፈተነ ምህርቲ',
      },
    ],
  },

  team: {
    heading: 'ጉጅለ',
    members: [
      {
        name: 'Selam Berhe Beyene',
        role: 'መስራቲ',
        // REVIEW: written without a gendered verb form; adjust if needed.
        bio: 'ኣብ Universidad de Cantabria ብዛዕባ ምንካይ ካርቦን ኣብ ዘርፊ ሲሚንቶ ናይ ፒኤችዲ ተመራማሪ፤ ኣብ ምምዕባል ትሑት ካርቦን ዘለዎም ኣቑሑት ህንፃ።',
      },
      {
        name: 'Meron Gebreselassie Tadesse',
        role: 'ተሓባባሪ መስራቲ',
        bio: 'ኣብ ምምሕዳር ፕሮጀክት ሞያዊ ተመኩሮ።',
      },
    ],
  },

  contact: {
    heading: 'ርኸቡና',
    labels: {
      name: 'ስም',
      email: 'ኢመይል',
      visitorType: 'መን ኢኹም?',
      product: 'ዝደለኹምዎ ፍርያት (ኣማራፂ)',
      message: 'መልእኽቲ',
    },
    visitorTypes: [
      { id: 'architect', label: 'ኣርክቴክት' },
      { id: 'engineer', label: 'መሃንድስ' },
      { id: 'builder', label: 'ሃናፂ' },
      { id: 'real-estate-developer', label: 'ኣልማዒ ሪል ስቴት' },
      { id: 'investor', label: 'ወፍራዪ' },
      { id: 'partner', label: 'መሻርኽቲ' },
      { id: 'other', label: 'ካልእ' },
    ],
    visitorTypePrompt: 'ሓደ ምረፁ',
    productPrompt: 'ፍሉይ ፍርያት የለን',
    submitLabel: 'መልእኽቲ ስደዱ',
    sendingLabel: 'ይልኣኽ ኣሎ…',
    successMessage: 'የቐንየልና፣ መልእኽትኹም ተላኢኹ ኣሎ። ብኢመይል መልሲ ክንህበኩም ኢና።',
    failureMessage: 'ይቕሬታ፣ መልእኽትኹም ክለኣኽ ኣይከኣለን። በጃኹም ድሕሪ ቁሩብ ደቓይቕ እንደገና ፈትኑ፣ ወይ ብቐጥታ ኢመይል ስደዱልና።',
    directContactPrefix: 'ወይ ብቐጥታ ናብዚ ኣድራሻ ፅሓፉልና፦',
    spamTrapLabel: 'ነዚ ቦታ ባዶ ግደፍዎ',
    errors: {
      nameRequired: 'በጃኹም ስምኩም ኣእትዉ።',
      nameTooLong: 'በጃኹም ስምኩም ካብ 100 ፊደላት ከይበዝሐ።',
      emailRequired: 'በጃኹም ናይ ኢመይል ኣድራሻኹም ኣእትዉ።',
      emailInvalid: 'በጃኹም ቅኑዕ ናይ ኢመይል ኣድራሻ ኣእትዉ፣ ንኣብነት name@example.com።',
      visitorTypeRequired: 'በጃኹም መን ምዃንኩም ምረፁ።',
      messageRequired: 'በጃኹም መልእኽቲ ኣእትዉ።',
      messageTooLong: 'በጃኹም መልእኽትኹም ካብ 5,000 ፊደላት ከይበዝሐ።',
    },
  },
}

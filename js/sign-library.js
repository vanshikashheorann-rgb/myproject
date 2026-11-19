/**
 * SIGNIFY - Indian Sign Language (ISL) Lexicon & Grammar Engine
 * Verifiable, expandable database of ISL signs, phrases, Hindi translations,
 * and linguistic grammar parser.
 */

const ISL_CATEGORIES = {
  greetings: { id: 'greetings', name: 'Greetings & Social', icon: 'sparkles' },
  conversation: { id: 'conversation', name: 'Daily Conversation', icon: 'hand' },
  emergency: { id: 'emergency', name: 'Health & Emergency', icon: 'info' },
  education: { id: 'education', name: 'Education & Work', icon: 'book' },
  family: { id: 'family', name: 'Family & Relations', icon: 'hand' },
  alphabet: { id: 'alphabet', name: 'Two-Handed Alphabet', icon: 'book' },
  numbers: { id: 'numbers', name: 'Numbers & Counting', icon: 'speed' }
};

const ISL_LEXICON = {
  // --- GREETINGS & SOCIAL ---
  'namaste': {
    id: 'namaste',
    label: 'Namaste / Hello',
    hindi: ['नमस्ते', 'नमस्कार', 'प्रणाम', 'हेलो'],
    category: 'greetings',
    type: 'phrase',
    assetUrl: 'assets/signs/namaste.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Both palms pressed together at chest level with fingers pointing upwards; gentle forward head nod showing respect.',
    grammarNotes: 'Universal Indian Sign Language greeting used for both hello and goodbye with reverent demeanor.'
  },
  'thank-you': {
    id: 'thank-you',
    label: 'Thank You',
    hindi: ['धन्यवाद', 'शुक्रिया', 'आभार'],
    category: 'greetings',
    type: 'phrase',
    assetUrl: 'assets/signs/thank-you.svg',
    duration: 1800,
    twoHanded: false,
    description: 'Flat open dominant hand touching chin or lower lip, extending forward and slightly downward towards the person.',
    grammarNotes: 'Expression of gratitude. Can be performed with both hands for deep emphasis.'
  },
  'please': {
    id: 'please',
    label: 'Please',
    hindi: ['कृपया', 'मेहरबानी'],
    category: 'greetings',
    type: 'word',
    assetUrl: 'assets/signs/please.svg',
    duration: 1800,
    twoHanded: false,
    description: 'Flat open dominant hand placed against center of chest, rubbing gently in a clockwise circular motion.',
    grammarNotes: 'Polite modifier placed adjacent to the verb or request.'
  },
  'welcome': {
    id: 'welcome',
    label: 'Welcome',
    hindi: ['स्वागत', 'अभिनंदन'],
    category: 'greetings',
    type: 'phrase',
    assetUrl: 'assets/signs/welcome.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Both open hands with palms turned upwards moving inward towards the body in an embracing gesture.',
    grammarNotes: 'Used for greeting visitors or responding to "Thank You".'
  },
  'good-morning': {
    id: 'good-morning',
    label: 'Good Morning',
    hindi: ['सुप्रभात', 'शुभ सवेरा'],
    category: 'greetings',
    type: 'phrase',
    assetUrl: 'assets/signs/good-morning.svg',
    duration: 2000,
    twoHanded: true,
    description: 'Non-dominant forearm held horizontally (representing horizon); dominant hand rises from below with fingers spreading like sun rays.',
    grammarNotes: 'Compound sign: GOOD + SUNRISE.'
  },
  'good-night': {
    id: 'good-night',
    label: 'Good Night',
    hindi: ['शुभ रात्रि', 'शब-ब-खैर'],
    category: 'greetings',
    type: 'phrase',
    assetUrl: 'assets/signs/good-night.svg',
    duration: 2000,
    twoHanded: true,
    description: 'Non-dominant forearm horizontal; dominant hand moves downward over it like a cover/sunset.',
    grammarNotes: 'Compound sign: GOOD + SUNSET.'
  },
  'sorry': {
    id: 'sorry',
    label: 'Sorry / Apology',
    hindi: ['माफ़ कीजिये', 'क्षमा करें', 'माफी'],
    category: 'greetings',
    type: 'word',
    assetUrl: 'assets/signs/sorry.svg',
    duration: 1800,
    twoHanded: false,
    description: 'Dominant hand closed into a fist, rubbing in a circular motion directly over the heart with an apologetic facial expression.',
    grammarNotes: 'Facial expression (non-manual marker) conveys sincerity of apology.'
  },

  // --- DAILY CONVERSATION ---
  'how-are-you': {
    id: 'how-are-you',
    label: 'How Are You?',
    hindi: ['आप कैसे हैं', 'तुम कैसे हो', 'क्या हाल है'],
    category: 'conversation',
    type: 'phrase',
    assetUrl: 'assets/signs/how-are-you.svg',
    duration: 2200,
    twoHanded: true,
    description: 'Both hands cupped facing chest roll outwards and turn palms up in an inquiring motion.',
    grammarNotes: 'ISL inquiry phrase with furrowed eyebrows (wh-question facial marker).'
  },
  'what-is-your-name': {
    id: 'what-is-your-name',
    label: 'What is your name?',
    hindi: ['आपका नाम क्या है', 'तुम्हारा नाम क्या है'],
    category: 'conversation',
    type: 'phrase',
    assetUrl: 'assets/signs/what-is-your-name.svg',
    duration: 2400,
    twoHanded: true,
    description: 'Dominant hand points to interlocutor (YOUR), taps two fingers across non-dominant palm (NAME), then wiggles index (WHAT).',
    grammarNotes: 'Authentic ISL syntax: [YOUR] + [NAME] + [WHAT].'
  },
  'help': {
    id: 'help',
    label: 'Help',
    hindi: ['मदद', 'सहायता', 'मदद करो'],
    category: 'emergency',
    type: 'word',
    assetUrl: 'assets/signs/help.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Non-dominant hand held flat with palm up; dominant fist with thumb upright rests on palm; both hands lift upward together.',
    grammarNotes: 'Directional verb: moving towards interlocutor means "I help you"; moving towards self means "Help me".'
  },
  'yes': {
    id: 'yes',
    label: 'Yes',
    hindi: ['हाँ', 'बिल्कुल', 'सही'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/yes.svg',
    duration: 1500,
    twoHanded: false,
    description: 'Dominant hand closed into a fist, nodding up and down from the wrist mimicking a nodding head.',
    grammarNotes: 'Accompanied by affirmative head nod.'
  },
  'no': {
    id: 'no',
    label: 'No',
    hindi: ['नहीं', 'ना'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/no.svg',
    duration: 1500,
    twoHanded: false,
    description: 'Dominant index and middle finger snap shut against the thumb, or extended index finger waves side to side.',
    grammarNotes: 'Accompanied by head shake.'
  },
  'water': {
    id: 'water',
    label: 'Water',
    hindi: ['पानी', 'जल', 'नीर'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/water.svg',
    duration: 1600,
    twoHanded: false,
    description: 'Dominant hand forms "W" shape (index, middle, ring finger upright) and taps chin/mouth twice.',
    grammarNotes: 'Basic necessity noun.'
  },
  'food': {
    id: 'food',
    label: 'Food / Eat',
    hindi: ['खाना', 'भोजन', 'आहार'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/food.svg',
    duration: 1600,
    twoHanded: false,
    description: 'Dominant hand with fingertips bunched together touching the thumb brought to the mouth twice.',
    grammarNotes: 'Functions as both verb (to eat) and noun (food).'
  },
  'good': {
    id: 'good',
    label: 'Good / Well',
    hindi: ['अच्छा', 'बढ़िया', 'उत्तम'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/good.svg',
    duration: 1500,
    twoHanded: false,
    description: 'Dominant hand closed into a fist with thumb held straight up in an affirmative gesture.',
    grammarNotes: 'Standard affirmative descriptor.'
  },
  'need': {
    id: 'need',
    label: 'Need / Want',
    hindi: ['चाहिए', 'जरूरत', 'आवश्यकता'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/need.svg',
    duration: 1600,
    twoHanded: false,
    description: 'Dominant curved index finger pulls inward towards the chest.',
    grammarNotes: 'Modal verb indicating necessity.'
  },
  'where': {
    id: 'where',
    label: 'Where',
    hindi: ['कहाँ', 'किधर'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/where.svg',
    duration: 1600,
    twoHanded: true,
    description: 'Both hands with open palms facing upward moving gently side to side in an inquiring gesture.',
    grammarNotes: 'Question word placed at the end of the sentence in ISL.'
  },
  'why': {
    id: 'why',
    label: 'Why',
    hindi: ['क्यों', 'किसलिए'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/why.svg',
    duration: 1600,
    twoHanded: false,
    description: 'Dominant hand touching side of forehead, pulling away into a "Y" handshape.',
    grammarNotes: 'Inquiry sign with furrowed eyebrows.'
  },
  'stop': {
    id: 'stop',
    label: 'Stop',
    hindi: ['रुकिए', 'रुको', 'ठहरो', 'बंद'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/stop.svg',
    duration: 1600,
    twoHanded: true,
    description: 'Dominant flat hand comes down with a decisive chopping motion onto the flat palm of the non-dominant hand.',
    grammarNotes: 'Imperative directive.'
  },
  'time': {
    id: 'time',
    label: 'Time',
    hindi: ['समय', 'वक़्त', 'कितने बजे'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/time.svg',
    duration: 1600,
    twoHanded: true,
    description: 'Dominant index finger taps the back of non-dominant wrist twice, where a wristwatch is worn.',
    grammarNotes: 'Temporal noun.'
  },
  'today': {
    id: 'today',
    label: 'Today / Now',
    hindi: ['आज', 'अभी'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/today.svg',
    duration: 1600,
    twoHanded: true,
    description: 'Both hands with palms up move downward simultaneously in front of the body twice.',
    grammarNotes: 'Temporal marker.'
  },
  'tomorrow': {
    id: 'tomorrow',
    label: 'Tomorrow',
    hindi: ['कल', 'आने वाला कल'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/tomorrow.svg',
    duration: 1600,
    twoHanded: false,
    description: 'Dominant hand with thumb touching cheek moving forward in an arc.',
    grammarNotes: 'Future temporal sign.'
  },
  'understand': {
    id: 'understand',
    label: 'Understand',
    hindi: ['समझना', 'समझ आया'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/understand.svg',
    duration: 1600,
    twoHanded: false,
    description: 'Dominant fist near temple with index finger flicking up sharply, like a lightbulb turning on.',
    grammarNotes: 'Cognitive verb.'
  },
  'sign-language': {
    id: 'sign-language',
    label: 'Sign Language (ISL)',
    hindi: ['सांकेतिक भाषा', 'संकेत भाषा'],
    category: 'conversation',
    type: 'phrase',
    assetUrl: 'assets/signs/sign-language.svg',
    duration: 2200,
    twoHanded: true,
    description: 'Both open hands circling each other smoothly in front of chest in alternating revolutions.',
    grammarNotes: 'Name of the visual-spatial language.'
  },
  'deaf': {
    id: 'deaf',
    label: 'Deaf',
    hindi: ['बधिर', 'मूक-बधिर', 'सुनने में असमर्थ'],
    category: 'conversation',
    type: 'word',
    assetUrl: 'assets/signs/deaf.svg',
    duration: 1800,
    twoHanded: false,
    description: 'Dominant index finger touches near ear, then moves forward to touch near mouth.',
    grammarNotes: 'Cultural identity sign representing the visual linguistic community.'
  },

  // --- HEALTH & EMERGENCY ---
  'doctor': {
    id: 'doctor',
    label: 'Doctor',
    hindi: ['डॉक्टर', 'चिकित्सक'],
    category: 'emergency',
    type: 'word',
    assetUrl: 'assets/signs/doctor.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Dominant index and middle finger tap the pulse on the inside wrist of the non-dominant arm.',
    grammarNotes: 'Medical professional noun.'
  },
  'hospital': {
    id: 'hospital',
    label: 'Hospital',
    hindi: ['अस्पताल', 'दवाखाना'],
    category: 'emergency',
    type: 'word',
    assetUrl: 'assets/signs/hospital.svg',
    duration: 2000,
    twoHanded: true,
    description: 'Dominant fingers draw a medical cross "+" on the upper shoulder/arm of non-dominant side.',
    grammarNotes: 'Location noun.'
  },
  'emergency': {
    id: 'emergency',
    label: 'Emergency',
    hindi: ['आपातकाल', 'संकट', 'खतरा'],
    category: 'emergency',
    type: 'word',
    assetUrl: 'assets/signs/emergency.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Both hands in fists shaking with urgency in front of the chest.',
    grammarNotes: 'Urgent indicator.'
  },
  'medicine': {
    id: 'medicine',
    label: 'Medicine',
    hindi: ['दवा', 'औषधि', 'दवाई'],
    category: 'emergency',
    type: 'word',
    assetUrl: 'assets/signs/medicine.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Dominant middle finger twists inside non-dominant upward palm (representing grinding mortar and pestle).',
    grammarNotes: 'Medical noun.'
  },
  'police': {
    id: 'police',
    label: 'Police',
    hindi: ['पुलिस', 'आरक्षक'],
    category: 'emergency',
    type: 'word',
    assetUrl: 'assets/signs/police.svg',
    duration: 1800,
    twoHanded: false,
    description: 'Dominant "C" handshape touches the upper left chest representing an official police badge.',
    grammarNotes: 'Emergency service noun.'
  },
  'ambulance': {
    id: 'ambulance',
    label: 'Ambulance',
    hindi: ['एम्बुलेंस', 'रोगी वाहन'],
    category: 'emergency',
    type: 'word',
    assetUrl: 'assets/signs/ambulance.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Both hands held above head alternatingly open and close, mimicking flashing emergency lights.',
    grammarNotes: 'Emergency transport noun.'
  },
  'pain': {
    id: 'pain',
    label: 'Pain / Hurt',
    hindi: ['दर्द', 'तकलीफ', 'चोट'],
    category: 'emergency',
    type: 'word',
    assetUrl: 'assets/signs/pain.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Both index fingers pointing towards each other twisting sharply near the location of pain.',
    grammarNotes: 'Directional: moved to chest for chest pain, head for headache.'
  },
  'danger': {
    id: 'danger',
    label: 'Danger',
    hindi: ['खतरा', 'जोखिम'],
    category: 'emergency',
    type: 'word',
    assetUrl: 'assets/signs/danger.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Both open hands shaking with wide spacing and alarmed facial expression.',
    grammarNotes: 'Safety alert modifier.'
  },

  // --- EDUCATION & WORK ---
  'teacher': {
    id: 'teacher',
    label: 'Teacher',
    hindi: ['अध्यापक', 'शिक्षक', 'गुरु'],
    category: 'education',
    type: 'word',
    assetUrl: 'assets/signs/teacher.svg',
    duration: 2000,
    twoHanded: true,
    description: 'Both hands near temples move forward with flattening fingers, followed by downward person marker.',
    grammarNotes: 'Compound sign: TEACH + PERSON.'
  },
  'student': {
    id: 'student',
    label: 'Student',
    hindi: ['विद्यार्थी', 'छात्र', 'छात्रा'],
    category: 'education',
    type: 'word',
    assetUrl: 'assets/signs/student.svg',
    duration: 2000,
    twoHanded: true,
    description: 'Non-dominant flat palm acts as book; dominant hand lifts knowledge to forehead, followed by person marker.',
    grammarNotes: 'Compound sign: LEARN + PERSON.'
  },
  'school': {
    id: 'school',
    label: 'School',
    hindi: ['विद्यालय', 'स्कूल', 'पाठशाला'],
    category: 'education',
    type: 'word',
    assetUrl: 'assets/signs/school.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Dominant flat hand claps down onto horizontal non-dominant palm twice.',
    grammarNotes: 'Institution noun.'
  },
  'book': {
    id: 'book',
    label: 'Book',
    hindi: ['किताब', 'पुस्तक'],
    category: 'education',
    type: 'word',
    assetUrl: 'assets/signs/book.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Both hands with palms joined together opening up like opening a book.',
    grammarNotes: 'Iconic noun.'
  },
  'work': {
    id: 'work',
    label: 'Work / Job',
    hindi: ['काम', 'कार्य', 'नौकरी'],
    category: 'education',
    type: 'word',
    assetUrl: 'assets/signs/work.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Dominant fist taps the wrist of non-dominant fist twice.',
    grammarNotes: 'Activity noun / verb.'
  },
  'home': {
    id: 'home',
    label: 'Home / House',
    hindi: ['घर', 'मकान', 'गृह'],
    category: 'education',
    type: 'word',
    assetUrl: 'assets/signs/home.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Both open flat hands meet at fingertips forming a triangular roof shape.',
    grammarNotes: 'Location noun.'
  },

  // --- FAMILY & RELATIONS ---
  'family': {
    id: 'family',
    label: 'Family',
    hindi: ['परिवार', 'कुटुंब'],
    category: 'family',
    type: 'word',
    assetUrl: 'assets/signs/family.svg',
    duration: 2000,
    twoHanded: true,
    description: 'Both hands form "F" shape touching at thumbs/index, circling outward until pinkies meet.',
    grammarNotes: 'Collective relation noun.'
  },
  'friend': {
    id: 'friend',
    label: 'Friend',
    hindi: ['दोस्त', 'मित्र', 'सखा'],
    category: 'family',
    type: 'word',
    assetUrl: 'assets/signs/friend.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Index fingers of both hands hooked into each other, linked together.',
    grammarNotes: 'Relation noun.'
  },
  'happy': {
    id: 'happy',
    label: 'Happy / Joy',
    hindi: ['खुश', 'प्रसन्न', 'आनंद'],
    category: 'family',
    type: 'word',
    assetUrl: 'assets/signs/happy.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Open flat hands brushing upward against chest repeatedly with cheerful smiling expression.',
    grammarNotes: 'Emotion descriptor.'
  },
  'sad': {
    id: 'sad',
    label: 'Sad / Sorrow',
    hindi: ['दुखी', 'उदास', 'शोक'],
    category: 'family',
    type: 'word',
    assetUrl: 'assets/signs/sad.svg',
    duration: 1800,
    twoHanded: true,
    description: 'Open hands in front of face slowly dropping downward as fingers curl slightly.',
    grammarNotes: 'Emotion descriptor.'
  },
  'love': {
    id: 'love',
    label: 'Love / Affection',
    hindi: ['प्यार', 'प्रेम', 'स्नेह'],
    category: 'family',
    type: 'word',
    assetUrl: 'assets/signs/love.svg',
    duration: 2000,
    twoHanded: true,
    description: 'Both arms crossed over chest with fists, hugging oneself with gentle facial expression.',
    grammarNotes: 'Emotion / relational verb.'
  }
};

// Add Two-Handed Fingerspelling Alphabet A-Z
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
ALPHABET.forEach(letter => {
  const upper = letter.toUpperCase();
  ISL_LEXICON[`letter-${letter}`] = {
    id: `letter-${letter}`,
    label: `Letter ${upper}`,
    hindi: [`अक्षर ${upper}`],
    category: 'alphabet',
    type: 'letter',
    assetUrl: `assets/signs/letter-${letter}.svg`,
    duration: 1100,
    twoHanded: true,
    description: `Authentic two-handed ISL manual alphabet sign for letter '${upper}'. Dominant hand interacts with non-dominant reference hand.`,
    grammarNotes: 'Used for fingerspelling proper nouns, names, and loanwords not in standard sign lexicon.'
  };
});

// Add Numeral signs 0-9
for (let n = 0; n <= 9; n++) {
  ISL_LEXICON[`number-${n}`] = {
    id: `number-${n}`,
    label: `Number ${n}`,
    hindi: [`संख्या ${n}`],
    category: 'numbers',
    type: 'number',
    assetUrl: `assets/signs/number-${n}.svg`,
    duration: 1100,
    twoHanded: false,
    description: `Indian Sign Language numeral representation for '${n}'.`,
    grammarNotes: 'Used for expressing quantities, time, and figures.'
  };
}

/**
 * Multi-word phrase mapping table for high-level idiomatic ISL translation.
 * Matches common English and Hindi conversational sentences directly to verified ISL phrase sequences.
 */
const ISL_PHRASE_MAPPINGS = [
  // Greetings & Social
  {
    triggers: [
      'hello how are you', 'how are you', 'how are you doing', 'how do you do',
      'आप कैसे हैं', 'तुम कैसे हो', 'क्या हाल है', 'नमस्ते आप कैसे हैं'
    ],
    sequence: ['namaste', 'how-are-you'],
    islGrammarSummary: 'ISL Greeting Order: [NAMASTE] -> [HOW-ARE-YOU]'
  },
  {
    triggers: [
      'what is your name', 'whats your name', 'tell me your name',
      'आपका नाम क्या है', 'तुम्हारा नाम क्या है', 'अपना नाम बताओ'
    ],
    sequence: ['what-is-your-name'],
    islGrammarSummary: 'ISL Wh-Question Syntax: [YOUR] + [NAME] + [WHAT]'
  },
  {
    triggers: [
      'thank you very much', 'thank you so much', 'thank you', 'thanks',
      'धन्यवाद', 'बहुत धन्यवाद', 'शुक्रिया', 'बहुत शुक्रिया'
    ],
    sequence: ['thank-you'],
    islGrammarSummary: 'ISL Politeness Marker: [THANK-YOU]'
  },
  {
    triggers: [
      'good morning teacher', 'good morning mam', 'good morning sir',
      'सुप्रभात शिक्षक', 'सुप्रभात सर'
    ],
    sequence: ['good-morning', 'teacher'],
    islGrammarSummary: 'ISL Topic-First: [GOOD-MORNING] -> [TEACHER]'
  },
  {
    triggers: [
      'good morning', 'सुप्रभात', 'शुभ प्रभात'
    ],
    sequence: ['good-morning'],
    islGrammarSummary: 'Compound Greeting: [GOOD] + [SUNRISE]'
  },
  {
    triggers: [
      'good night', 'शुभ रात्रि'
    ],
    sequence: ['good-night'],
    islGrammarSummary: 'Compound Greeting: [GOOD] + [SUNSET]'
  },
  {
    triggers: [
      'nice to meet you', 'pleased to meet you', 'happy to meet you',
      'आपसे मिलकर खुशी हुई', 'मिलकर अच्छा लगा'
    ],
    sequence: ['welcome', 'happy', 'friend'],
    islGrammarSummary: 'ISL Idiomatic Construction: [WELCOME] -> [HAPPY] -> [FRIEND]'
  },
  {
    triggers: [
      'welcome to signify', 'welcome', 'स्वागत है', 'आपका स्वागत है'
    ],
    sequence: ['welcome'],
    islGrammarSummary: 'ISL Welcoming Marker: [WELCOME]'
  },

  // Emergency & Medical
  {
    triggers: [
      'i need help', 'help me', 'please help me', 'help please', 'help',
      'मुझे मदद चाहिए', 'मेरी मदद करो', 'सहायता करो', 'मदद'
    ],
    sequence: ['help', 'please'],
    islGrammarSummary: 'ISL Urgent Request: [HELP] -> [PLEASE]'
  },
  {
    triggers: [
      'where is the hospital', 'where is hospital', 'hospital where',
      'अस्पताल कहाँ है', 'हॉस्पिटल कहाँ है', 'दवाखाना कहाँ है'
    ],
    sequence: ['hospital', 'where'],
    islGrammarSummary: 'ISL SOV Question: [HOSPITAL] (Topic) -> [WHERE] (Question Marker)'
  },
  {
    triggers: [
      'i need a doctor', 'call doctor', 'where is doctor', 'doctor need',
      'डॉक्टर की जरूरत है', 'डॉक्टर को बुलाओ', 'डॉक्टर कहाँ है'
    ],
    sequence: ['doctor', 'need'],
    islGrammarSummary: 'ISL Topic-Predicate: [DOCTOR] -> [NEED]'
  },
  {
    triggers: [
      'call an ambulance', 'call ambulance', 'ambulance emergency',
      'एम्बुलेंस बुलाओ', 'रोगी वाहन बुलाओ'
    ],
    sequence: ['ambulance', 'emergency'],
    islGrammarSummary: 'ISL Urgency Pairing: [AMBULANCE] -> [EMERGENCY]'
  },
  {
    triggers: [
      'this is an emergency', 'emergency help', 'आपातकाल है', 'संकट'
    ],
    sequence: ['emergency', 'help'],
    islGrammarSummary: 'ISL Alert Syntax: [EMERGENCY] -> [HELP]'
  },

  // Daily Needs
  {
    triggers: [
      'i want water', 'water please', 'give me water', 'need water', 'water',
      'मुझे पानी चाहिए', 'पानी दो', 'पानी पीना है', 'पानी'
    ],
    sequence: ['water', 'please'],
    islGrammarSummary: 'ISL Need Construction: [WATER] -> [PLEASE]'
  },
  {
    triggers: [
      'i am hungry', 'i want food', 'need food', 'food please', 'food',
      'मुझे खाना चाहिए', 'भूख लगी है', 'भोजन चाहिए', 'खाना'
    ],
    sequence: ['food', 'need'],
    islGrammarSummary: 'ISL Need Construction: [FOOD] -> [NEED]'
  },
  {
    triggers: [
      'what is the time', 'what time is it', 'time please',
      'समय क्या हुआ है', 'कितने बजे हैं', 'समय क्या है'
    ],
    sequence: ['time', 'where'],
    islGrammarSummary: 'ISL Inquiry: [TIME] -> [WHERE/WHAT]'
  },
  {
    triggers: [
      'i love my family', 'family love', 'मेरा परिवार', 'परिवार से प्यार'
    ],
    sequence: ['family', 'love'],
    islGrammarSummary: 'ISL Topic-Affect: [FAMILY] -> [LOVE]'
  },
  {
    triggers: [
      'you are my friend', 'good friend', 'मेरा दोस्त', 'मित्र'
    ],
    sequence: ['friend', 'good'],
    islGrammarSummary: 'ISL Descriptor Follows Noun: [FRIEND] -> [GOOD]'
  },
  {
    triggers: [
      'learn sign language', 'sign language', 'indian sign language',
      'सांकेतिक भाषा सीखें', 'संकेत भाषा'
    ],
    sequence: ['sign-language', 'understand'],
    islGrammarSummary: 'ISL Sequence: [SIGN-LANGUAGE] -> [UNDERSTAND]'
  }
];

// Single-word synonyms & Hindi vocabulary map
const WORD_SYNONYMS = {
  // English words
  'hello': 'namaste',
  'hi': 'namaste',
  'namaste': 'namaste',
  'namaskar': 'namaste',
  'pranam': 'namaste',
  'thanks': 'thank-you',
  'thank': 'thank-you',
  'gratitude': 'thank-you',
  'please': 'please',
  'kindly': 'please',
  'welcome': 'welcome',
  'help': 'help',
  'assist': 'help',
  'aid': 'help',
  'doctor': 'doctor',
  'physician': 'doctor',
  'hospital': 'hospital',
  'clinic': 'hospital',
  'water': 'water',
  'drink': 'water',
  'food': 'food',
  'eat': 'food',
  'meal': 'food',
  'yes': 'yes',
  'yeah': 'yes',
  'yep': 'yes',
  'true': 'yes',
  'correct': 'yes',
  'no': 'no',
  'nope': 'no',
  'not': 'no',
  'stop': 'stop',
  'halt': 'stop',
  'wait': 'stop',
  'sorry': 'sorry',
  'apology': 'sorry',
  'forgive': 'sorry',
  'happy': 'happy',
  'glad': 'happy',
  'joy': 'happy',
  'sad': 'sad',
  'unhappy': 'sad',
  'love': 'love',
  'care': 'love',
  'like': 'love',
  'friend': 'friend',
  'buddy': 'friend',
  'family': 'family',
  'relatives': 'family',
  'teacher': 'teacher',
  'sir': 'teacher',
  'madam': 'teacher',
  'student': 'student',
  'pupil': 'student',
  'school': 'school',
  'college': 'school',
  'book': 'book',
  'read': 'book',
  'work': 'work',
  'job': 'work',
  'office': 'work',
  'time': 'time',
  'clock': 'time',
  'watch': 'time',
  'today': 'today',
  'now': 'today',
  'tomorrow': 'tomorrow',
  'where': 'where',
  'why': 'why',
  'understand': 'understand',
  'know': 'understand',
  'emergency': 'emergency',
  'danger': 'danger',
  'urgent': 'emergency',
  'medicine': 'medicine',
  'tablet': 'medicine',
  'police': 'police',
  'cop': 'police',
  'ambulance': 'ambulance',
  'pain': 'pain',
  'hurt': 'pain',
  'deaf': 'deaf',
  'sign': 'sign-language',

  // Hindi words
  'नमस्ते': 'namaste',
  'नमस्कार': 'namaste',
  'प्रणाम': 'namaste',
  'धन्यवाद': 'thank-you',
  'शुक्रिया': 'thank-you',
  'कृपया': 'please',
  'स्वागत': 'welcome',
  'मदद': 'help',
  'सहायता': 'help',
  'डॉक्टर': 'doctor',
  'अस्पताल': 'hospital',
  'पानी': 'water',
  'जल': 'water',
  'खाना': 'food',
  'भोजन': 'food',
  'हाँ': 'yes',
  'नहीं': 'no',
  'माफ़': 'sorry',
  'क्षमा': 'sorry',
  'खुश': 'happy',
  'प्रसन्न': 'happy',
  'दुखी': 'sad',
  'उदास': 'sad',
  'प्यार': 'love',
  'प्रेम': 'love',
  'दोस्त': 'friend',
  'मित्र': 'friend',
  'परिवार': 'family',
  'शिक्षक': 'teacher',
  'अध्यापक': 'teacher',
  'छात्र': 'student',
  'विद्यार्थी': 'student',
  'स्कूल': 'school',
  'किताब': 'book',
  'पुस्तक': 'book',
  'काम': 'work',
  'समय': 'time',
  'आज': 'today',
  'कल': 'tomorrow',
  'कहाँ': 'where',
  'क्यों': 'why',
  'रुकिए': 'stop',
  'रुको': 'stop',
  'समझना': 'understand',
  'आपातकाल': 'emergency',
  'खतरा': 'danger',
  'दवा': 'medicine',
  'दवाई': 'medicine',
  'पुलिस': 'police',
  'एम्बुलेंस': 'ambulance',
  'दर्द': 'pain',
  'बधिर': 'deaf'
};

/**
 * Normalizes input text by removing excessive punctuation and whitespace.
 */
function normalizeInput(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[?,.!;:'"()\[\]{}\-_\/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Main ISL Translation Parser:
 * 1. Checks for greedy multi-word phrase matches.
 * 2. If not matched as a full phrase, tokenizes and maps supported words.
 * 3. Applies ISL syntax reordering (e.g. WH-words moved to end, Topic-Comment structure).
 * 4. For unknown words, provides fingerspelling or informative fallback.
 */
function translateToISL(inputRaw) {
  const normalized = normalizeInput(inputRaw);
  if (!normalized) {
    return {
      success: false,
      error: 'Please enter or speak a message to translate.',
      signs: [],
      grammarSummary: ''
    };
  }

  // 1. Check Phrase Mappings (Greedy match)
  for (const phrase of ISL_PHRASE_MAPPINGS) {
    for (const trigger of phrase.triggers) {
      const normTrigger = normalizeInput(trigger);
      if (normalized === normTrigger || normalized.includes(normTrigger)) {
        const signObjects = phrase.sequence
          .map(id => ISL_LEXICON[id])
          .filter(Boolean);

        return {
          success: true,
          matchType: 'phrase',
          matchedRule: trigger,
          grammarSummary: phrase.islGrammarSummary,
          signs: signObjects,
          totalDuration: signObjects.reduce((acc, s) => acc + s.duration, 0)
        };
      }
    }
  }

  // 2. Tokenize into words
  const words = normalized.split(' ').filter(w => w.length > 0);
  const resolvedSignIds = [];
  const unrecognizedWords = [];
  const whQuestionWords = [];

  for (const word of words) {
    // Check if it's a number
    if (/^\d+$/.test(word)) {
      for (const digit of word) {
        if (ISL_LEXICON[`number-${digit}`]) {
          resolvedSignIds.push(`number-${digit}`);
        }
      }
      continue;
    }

    // Check direct lexicon ID or synonym map
    const mappedId = WORD_SYNONYMS[word] || (ISL_LEXICON[word] ? word : null);

    if (mappedId) {
      // In ISL, WH-question words (where, why, what, who) are placed at the end of the clause
      if (mappedId === 'where' || mappedId === 'why') {
        whQuestionWords.push(mappedId);
      } else {
        resolvedSignIds.push(mappedId);
      }
    } else {
      // Stop words to politely ignore (English & Hindi)
      const stopWords = ['is', 'are', 'am', 'the', 'a', 'an', 'to', 'in', 'on', 'at', 'of', 'for', 'it', 'की', 'के', 'का', 'में', 'पर', 'से', 'को', 'है', 'हैं', 'था', 'थी'];
      if (!stopWords.includes(word)) {
        unrecognizedWords.push(word);
      }
    }
  }

  // Append WH-words at the end per ISL syntax
  resolvedSignIds.push(...whQuestionWords);

  // If words were resolved, build sign objects
  const signObjects = resolvedSignIds
    .map(id => ISL_LEXICON[id])
    .filter(Boolean);

  // If no words matched, try fingerspelling short words or return guidance
  let fingerspellingUsed = false;
  if (signObjects.length === 0 && unrecognizedWords.length > 0) {
    const singleWord = unrecognizedWords[0];
    // If it's a single short word / name (<= 8 letters), fingerspell it in ISL
    if (singleWord.length <= 8 && /^[a-z]+$/.test(singleWord)) {
      fingerspellingUsed = true;
      for (const char of singleWord) {
        const letterSign = ISL_LEXICON[`letter-${char}`];
        if (letterSign) {
          signObjects.push(letterSign);
        }
      }
    }
  }

  if (signObjects.length === 0) {
    return {
      success: false,
      error: `No verified ISL signs found for "${inputRaw}". Try phrases like "Hello, how are you?", "Thank you", "Where is the hospital?", "I need help", or single words like "Water", "Doctor", "Teacher".`,
      signs: [],
      grammarSummary: 'Sign vocabulary not yet available in current verified dictionary.'
    };
  }

  let grammarSummary = 'ISL Grammatical Ordering: ' + signObjects.map(s => `[${s.label.toUpperCase()}]`).join(' -> ');
  if (fingerspellingUsed) {
    grammarSummary = `Fingerspelled in ISL Two-Handed Manual Alphabet: [${unrecognizedWords[0].toUpperCase()}]`;
  } else if (unrecognizedWords.length > 0) {
    grammarSummary += ` (Note: ${unrecognizedWords.length} filler/unsupported token${unrecognizedWords.length > 1 ? 's' : ''} skipped for clarity)`;
  }

  return {
    success: true,
    matchType: fingerspellingUsed ? 'fingerspelling' : 'sentence',
    grammarSummary: grammarSummary,
    signs: signObjects,
    unrecognizedWords: unrecognizedWords,
    totalDuration: signObjects.reduce((acc, s) => acc + s.duration, 0)
  };
}

// Export for browser window
window.ISL_CATEGORIES = ISL_CATEGORIES;
window.ISL_LEXICON = ISL_LEXICON;
window.ISL_PHRASE_MAPPINGS = ISL_PHRASE_MAPPINGS;
window.translateToISL = translateToISL;

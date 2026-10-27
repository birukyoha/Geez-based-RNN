/**
 * Ge'ez Cognitive Map Dataset & Syllograph Mappings
 * Based on Biruk Tesfaye's M.Sc. Thesis (Dilla University, 2019)
 */

const GEEZ_DATASET = {
  // 5 Dimensions of the Ge'ez Writing System (Gabriella F. Scelta, 2001)
  dimensions: [
    {
      id: "pictography",
      title: "1. Pictography",
      icon: "🎨",
      summary: "Visual abstraction of nature, cosmology, and human anatomy.",
      details: "Ge'ez syllographs originate from abstracted natural and physical forms (e.g. Hä/Hoi as a lion/the beginning of life, Bä/Bèt as a house/door, Mä/Mai as flowing water, and Rä/Re'es as the head)."
    },
    {
      id: "ideography",
      title: "2. Ideography",
      icon: "💡",
      summary: "Symbolic encoding of philosophical, moral, and social orders.",
      details: "Each of the 26 classes embodies distinct philosophical concepts, and the 7 vowel modifications modulate ideological and social hierarchies (e.g. the 6th class Re'es symbolizes leadership, as in 'Re'esa Mange'st' / Head of State)."
    },
    {
      id: "astrography",
      title: "3. Astrography",
      icon: "🌌",
      summary: "Cosmological alignment with the 364-day calendar & equinox cycle.",
      details: "26 classes × 7 variations = 182 syllographs, exactly representing one equinox (half-year = 182 days; 2 equinoxes = 364 days). The 7 variations directly map to the 7 days of the week."
    },
    {
      id: "numerology",
      title: "4. Numerology",
      icon: "🔢",
      summary: "Esoteric Gematria & numerical knowledge systems (1 to 5600).",
      details: "Each syllograph possesses a discrete numerical value (1 to 5600). Word sums encode computational memory markers for oral transmission and deep theological interpretation."
    },
    {
      id: "syllagraphy",
      title: "5. Syllagraphy",
      icon: "📜",
      summary: "Inherent phonetic completeness (Abugida script structure).",
      details: "Unlike alphabets where consonants and vowels are disconnected, each Ge'ez syllograph inherently binds a consonant root with a vocalic transformation, eliminating ambiguity and spelling discrepancies."
    }
  ],

  // 7 Orders of the Ethiopic Abugida & Weekday Astrographic Mappings
  orders: [
    { order: 1, name: "Ge'ez (ግዕዝ)", vowel: "ä", day: "Sunday", dayGeez: "እሑድ", description: "1st Order - Basic Root / Origin Form" },
    { order: 2, name: "Ka'eb (ካዕብ)", vowel: "u", day: "Monday", dayGeez: "ሰኑይ", description: "2nd Order - U Vowel Modification" },
    { order: 3, name: "Salis (ሣልስ)", vowel: "i", day: "Tuesday", dayGeez: "ሠሉስ", description: "3rd Order - I Vowel Modification" },
    { order: 4, name: "Rab'e (ራብዕ)", vowel: "a", day: "Wednesday", dayGeez: "ረቡዕ", description: "4th Order - Long A Vowel Modification" },
    { order: 5, name: "Hamis (ኃምስ)", vowel: "é", day: "Thursday", dayGeez: "ሐሙስ", description: "5th Order - E Vowel Modification" },
    { order: 6, name: "Sadis (ሳድስ)", vowel: "ə", day: "Friday", dayGeez: "ዓርብ", description: "6th Order - Neutral / Consonantal Form" },
    { order: 7, name: "Sab'e (ሳብዕ)", vowel: "o", day: "Saturday", dayGeez: "ቀዳሚት ሰንበት", description: "7th Order - O Vowel Modification" }
  ],

  // Full 26 Ethiopic Syllograph Classes (Siriw Fidel & Serawite Fidel - 7 Order Forms)
  ethiopianClasses: [
    { id: 1, name: "Hoi", baseValue: 1, geez: "ሀ", kaeb: "ሁ", salis: "ሂ", rabe: "ሃ", hamis: "ሄ", sadis: "ህ", sabe: "ሆ", meaning: "Beginning / Lion", pictoOrigin: "Front-end of lion / Person reaching hands to heavens" },
    { id: 2, name: "Lawi", baseValue: 2, geez: "ለ", kaeb: "ሉ", salis: "ሊ", rabe: "ላ", hamis: "ሌ", sadis: "ል", sabe: "ሎ", meaning: "Tongue / Word", pictoOrigin: "Coiled staff / Hooked tongue" },
    { id: 3, name: "Haut", baseValue: 3, geez: "ሐ", kaeb: "ሑ", salis: "ሒ", rabe: "ሓ", hamis: "ሔ", sadis: "ሕ", sabe: "ሖ", meaning: "Life / Thread", pictoOrigin: "Twisted flax / Life cord" },
    { id: 4, name: "Mai", baseValue: 4, geez: "መ", kaeb: "ሙ", salis: "ሚ", rabe: "ማ", hamis: "ሜ", sadis: "ም", sabe: "ሞ", meaning: "Water", pictoOrigin: "Water waves / Flowing stream" },
    { id: 5, name: "Saut", baseValue: 5, geez: "ሠ", kaeb: "ሡ", salis: "ሢ", rabe: "ሣ", hamis: "ሤ", sadis: "ሥ", sabe: "ሦ", meaning: "Tooth / Sun", pictoOrigin: "Rising sun / Radiant teeth" },
    { id: 6, name: "Rees", baseValue: 6, geez: "ረ", kaeb: "ሩ", salis: "ሪ", rabe: "ራ", hamis: "ሬ", sadis: "ር", sabe: "ሮ", meaning: "Head / Leader", pictoOrigin: "Human profile / Head of authority" },
    { id: 7, name: "Sat", baseValue: 7, geez: "ሰ", kaeb: "ሱ", salis: "ሲ", rabe: "ሳ", hamis: "ሴ", sadis: "ስ", sabe: "ሶ", meaning: "Man / Person", pictoOrigin: "Upright standing person" },
    { id: 8, name: "Kaf", baseValue: 8, geez: "ቀ", kaeb: "ቁ", salis: "ቂ", rabe: "ቃ", hamis: "ቄ", sadis: "ቅ", sabe: "ቆ", meaning: "Horn / Top", pictoOrigin: "Summit / Animal horn" },
    { id: 9, name: "Bet", baseValue: 9, geez: "በ", kaeb: "ቡ", salis: "ቢ", rabe: "ባ", hamis: "ቤ", sadis: "ብ", sabe: "ቦ", meaning: "House / Door", pictoOrigin: "Enclosed dwelling / Stylized door" },
    { id: 10, name: "Taw", baseValue: 10, geez: "ተ", kaeb: "ቱ", salis: "ቲ", rabe: "ታ", hamis: "ቴ", sadis: "ት", sabe: "ቶ", meaning: "Mark / Sign", pictoOrigin: "Crossed mark / Intersection" },
    { id: 11, name: "Harm", baseValue: 20, geez: "ኀ", kaeb: "ኁ", salis: "ኂ", rabe: "ኃ", hamis: "ኄ", sadis: "ኅ", sabe: "ኆ", meaning: "Enclosure / Yard", pictoOrigin: "Protected courtyard / Sanctuary" },
    { id: 12, name: "Nahas", baseValue: 30, geez: "ነ", kaeb: "ኑ", salis: "ኒ", rabe: "ና", hamis: "ኔ", sadis: "ን", sabe: "ኖ", meaning: "Copper / Snake", pictoOrigin: "Coiled serpent / Copper wire" },
    { id: 13, name: "Alf", baseValue: 40, geez: "አ", kaeb: "ኡ", salis: "ኢ", rabe: "ኣ", hamis: "ኤ", sadis: "እ", sabe: "ኦ", meaning: "Eye / Origin", pictoOrigin: "Ox head / Primordial eye" },
    { id: 14, name: "Kaf (K)", baseValue: 50, geez: "ከ", kaeb: "ኩ", salis: "ኪ", rabe: "ካ", hamis: "ኬ", sadis: "ክ", sabe: "ኮ", meaning: "Hand / Palm", pictoOrigin: "Open cupped palm" },
    { id: 15, name: "Waw", baseValue: 60, geez: "ወ", kaeb: "ዉ", salis: "ዊ", rabe: "ዋ", hamis: "ዌ", sadis: "ው", sabe: "ዎ", meaning: "Hook / Peg", pictoOrigin: "Wooden peg / Connecting tent hook" },
    { id: 16, name: "Ain", baseValue: 70, geez: "ዐ", kaeb: "ዑ", salis: "ዒ", rabe: "ዓ", hamis: "ዔ", sadis: "ዕ", sabe: "ዖ", meaning: "Eye / Fountain", pictoOrigin: "Deep circular fountain / Vision" },
    { id: 17, name: "Zai", baseValue: 80, geez: "ዘ", kaeb: "ዙ", salis: "ዚ", rabe: "ዛ", hamis: "ዜ", sadis: "ዝ", sabe: "ዞ", meaning: "Weapon / Armor", pictoOrigin: "Curved scythe / Defensive blade" },
    { id: 18, name: "Yaman", baseValue: 90, geez: "የ", kaeb: "ዩ", salis: "ዪ", rabe: "ያ", hamis: "ዬ", sadis: "ይ", sabe: "ዮ", meaning: "Right Fisted Hand", pictoOrigin: "Clenched right hand of oath" },
    { id: 19, name: "Dent", baseValue: 100, geez: "ደ", kaeb: "ዱ", salis: "ዲ", rabe: "ዳ", hamis: "ዴ", sadis: "ድ", sabe: "ዶ", meaning: "Door / Entrance", pictoOrigin: "Gateway portal" },
    { id: 20, name: "Geml", baseValue: 200, geez: "ገ", kaeb: "ጉ", salis: "ጊ", rabe: "ጋ", hamis: "ጌ", sadis: "ግ", sabe: "ጎ", meaning: "Camel", pictoOrigin: "Camel hump and neck" },
    { id: 21, name: "Tait", baseValue: 300, geez: "ጠ", kaeb: "ጡ", salis: "ጢ", rabe: "ጣ", hamis: "ጤ", sadis: "ጥ", sabe: "ጦ", meaning: "Basket / Sun disk", pictoOrigin: "Woven circular basket" },
    { id: 22, name: "Pait", baseValue: 400, geez: "ጰ", kaeb: "ጱ", salis: "ጲ", rabe: "ጳ", hamis: "ጴ", sadis: "ጵ", sabe: "ፖ", meaning: "Split / Form", pictoOrigin: "Divided vessel / Sacred form" },
    { id: 23, name: "Tsaide", baseValue: 500, geez: "ጸ", kaeb: "ጹ", salis: "ጺ", rabe: "ጻ", hamis: "ጼ", sadis: "ጽ", sabe: "ጾ", meaning: "Righteousness / Sprout", pictoOrigin: "Emerging plant bud / Balance" },
    { id: 24, name: "Dappa", baseValue: 600, geez: "ፀ", kaeb: "ፁ", salis: "ጹ", rabe: "ፃ", hamis: "ፄ", sadis: "ፅ", sabe: "ፆ", meaning: "Sun / Dawn", pictoOrigin: "Burst of morning sunlight" },
    { id: 25, name: "Af", baseValue: 700, geez: "ፈ", kaeb: "ፉ", salis: "ፊ", rabe: "ፋ", hamis: "ፌ", sadis: "ፍ", sabe: "ፎ", meaning: "Mouth / Breath", pictoOrigin: "Exhaling lips / Sacred breath" },
    { id: 26, name: "Psa", baseValue: 800, geez: "ፐ", kaeb: "ፑ", salis: "ፒ", rabe: "ፓ", hamis: "ፔ", sadis: "ፕ", sabe: "ፖ", meaning: "End / Boundary", pictoOrigin: "Final terminal border" }
  ],

  // --- Historical Infographics Data (Gabriella F. Scelta Paper, 2001) ---

  // 1. Examples of Ancient African and Near-African Systems (Paper Page 7, Figure 19)
  comparativeAfricanSystems: [
    { phoneme: "A", egyptian: "𓍯 (Ox Head / Reaching)", meroitic: "𐦠", sinaitic: "𐤀", cretanLinear: "Λ", meroiticLinear: "𐦡", protoEthiopic: "𐩱 (Y)", ethiopic: "ሀ / አ", notes: "Primordial origin / Alpha" },
    { phoneme: "B", egyptian: "𓉐 (House plan)", meroitic: "𐦢", sinaitic: "𐤁", cretanLinear: "—", meroiticLinear: "𐦣", protoEthiopic: "𐩨 (П)", ethiopic: "በ", notes: "House / Enclosure (Bèt)" },
    { phoneme: "G", egyptian: "𓎛 (Throwstick/Staff)", meroitic: "𐦤", sinaitic: "𐤂", cretanLinear: "7", meroiticLinear: "𐦥", protoEthiopic: "𐩴 (1)", ethiopic: "ገ", notes: "Camel / Curve (Gämäl)" },
    { phoneme: "H", egyptian: "𓀠 (Man with arms up)", meroitic: "𐦦", sinaitic: "𐤄", cretanLinear: "—", meroiticLinear: "4", protoEthiopic: "𐩠 (Ψ)", ethiopic: "ሐ / ኀ", notes: "Life breath / Glory (Hoi)" },
    { phoneme: "K", egyptian: "𓂤 (Open cupped palm)", meroitic: "𐦨", sinaitic: "𐤊", cretanLinear: "—", meroiticLinear: "3", protoEthiopic: "𐩫", ethiopic: "ከ / ቀ", notes: "Palm / Grasp" },
    { phoneme: "N", egyptian: "𓈖 (Water ripple / Snake)", meroitic: "𐦪", sinaitic: "𐤍", cretanLinear: "—", meroiticLinear: "12", protoEthiopic: "𐩬 (4)", ethiopic: "ነ", notes: "Copper / Serpent (Nahas)" },
    { phoneme: "O", egyptian: "𓁹 (Eye of vision)", meroitic: "𐦬", sinaitic: "𐤏", cretanLinear: "⊙", meroiticLinear: "𐦭", protoEthiopic: "𐩲 (O)", ethiopic: "ዐ", notes: "Eye / Spring fountain (A'yn)" },
    { phoneme: "R", egyptian: "𓁶 (Human head profile)", meroitic: "𐦮", sinaitic: "𐤓", cretanLinear: "—", meroiticLinear: "𐦯", protoEthiopic: "𐩧 (ว)", ethiopic: "ረ", notes: "Head / Chief ruler (Re'es)" },
    { phoneme: "T", egyptian: "𓏴 (Mark / Crossed arms)", meroitic: "𐦰", sinaitic: "𐤕", cretanLinear: "X", meroiticLinear: "X", protoEthiopic: "𐩩 (+)", ethiopic: "ተ / ጠ", notes: "Sign / Benchmark (Taw)" },
    { phoneme: "S", egyptian: "𓌢 (Woven plants / Sun rays)", meroitic: "𐦲", sinaitic: "𐤔", cretanLinear: "—", meroiticLinear: "W", protoEthiopic: "𐩪 (3)", ethiopic: "ሰ / ሠ", notes: "Upright person / Sun (Saut)" }
  ],

  // 2. Names and Meanings of Some of the Syllographs (Paper Page 7, Figure 20)
  syllographMeanings: [
    { latin: "B", proto: "𓉐", protoEthiopic: "𐩨", classical: "በ", name: "House (Bèt)", description: "Stylized depiction of a dwelling or doorway" },
    { latin: "Y", proto: "𓂻", protoEthiopic: "𐩺", classical: "የ", name: "Right Fisted Hand (Yäman)", description: "Clenched right hand of oath and righteousness" },
    { latin: "G", proto: "𓎛", protoEthiopic: "𐩴", classical: "ገ", name: "Camel (Gämäl)", description: "Camel neck and hump representing mobility" },
    { latin: "N", proto: "𓆓", protoEthiopic: "𐩬", classical: "ነ", name: "Copper | Snake (Mädab / Nahas)", description: "Coiled serpent representing metal crafting" },
    { latin: "R", proto: "𓁶", protoEthiopic: "𐩧", classical: "ረ", name: "Head (Re'es)", description: "Human head representing authority, leadership, and state" },
    { latin: "F", proto: "𓂏", protoEthiopic: "𐩷", classical: "ፈ", name: "Mouth (Äf)", description: "Open mouth exhaling sacred spoken word" },
    { latin: "A", proto: "𓁹", protoEthiopic: "𐩲", classical: "ዐ / አ", name: "Eye (A'yn / Alf)", description: "Vision and primordial source fountain" },
    { latin: "H", proto: "𓀠", protoEthiopic: "𐩠", classical: "ሀ", name: "Glory / Beginning (Hoi)", description: "Person with arms raised to heaven; beginning of creation" },
    { latin: "M", proto: "𓈗", protoEthiopic: "𐩣", classical: "መ", name: "Water (Mai)", description: "Flowing oceanic waves and sacred nourishment" },
    { latin: "P", proto: "𓊡", protoEthiopic: "𐩵", classical: "ፐ", name: "End / Terminal Boundary (Pä)", description: "Final limit demarcating the 26th class" }
  ],

  // 3. Examples of the Evolution of Ethiopic (Paper Page 5, Figure 13)
  ethiopicEvolution: [
    { pictograph: "🐮 Long-Horned Bull", protoEthiopic: "𐩱 (Horned Y)", ethiopic: "ሀ", transcription: "Hä", name: "HOI", meaning: "Front of lion / Bull / First graph of the alphabet" },
    { pictograph: "✊ Fisted Right Hand", protoEthiopic: "𐩺 (Fist & Stem)", ethiopic: "የ", transcription: "Yä", name: "YÄMAN", meaning: "Right hand of truth and pact" },
    { pictograph: "👁️ Human Eye", protoEthiopic: "𐩲 (Circular Eye)", ethiopic: "ዐ / አ", transcription: "A", name: "A'YN", meaning: "Eye of understanding and water fountain" },
    { pictograph: "🏠 House or Temple", protoEthiopic: "𐩨 (Door Gate)", ethiopic: "በ", transcription: "Bä", name: "BÈT", meaning: "Dwelling house, shelter, and sanctuary" },
    { pictograph: "🐪 Walking Camel", protoEthiopic: "𐩴 (Neck Arch)", ethiopic: "ገ", transcription: "Gä", name: "GÄMAL", meaning: "Camel of caravan routes and trade" },
    { pictograph: "🌊 Water Waves", protoEthiopic: "𐩣 (Wavy Ripple)", ethiopic: "መ", transcription: "Mä", name: "MAI", meaning: "Living water, rivers, and cleansing" }
  ],

  // 4. The Beginning and the End in Kemetic & Ethiopic (Paper Page 5, Figure 12)
  beginningAndEnd: {
    beginning: {
      kemetic: "𓃭 (Front-end of Lion / Person reaching to heavens)",
      kemeticTranscription: "HÄ",
      ethiopic: "ሀ",
      ethiopicTranscription: "HÄ",
      meaning: "THE BEGINNING",
      description: "Correlated to Psalm 68:31: 'Ethiopia stretches her hands unto God' — The Alpha of creation."
    },
    end: {
      kemetic: "𓄂 (Tail / Terminal boundary)",
      kemeticTranscription: "PEH",
      ethiopic: "ፐ",
      ethiopicTranscription: "PÄ",
      meaning: "THE END",
      description: "The 26th terminal consonant defining the complete bounds of the Ethiopic syllabet — The Omega."
    }
  },

  // 5. Syllagraphic Property: Same Sound but Different Meaning Ge'ez Words (Thesis Table 1.2, Page 26)
  syllographicHomophones: [
    { geez: "ሰረቀ", amharic: "ወጣ", english: "Climb", optionalMeaning: "To rise / dawn / appear (for sun/moon)", pair: "ሰረቀ / ሠረቀ" },
    { geez: "ሠረቀ", amharic: "ሰረቀ", english: "Steal", optionalMeaning: "To take without permission / purloin", pair: "ሰረቀ / ሠረቀ" },
    { geez: "አመት", amharic: "አገልጋይ", english: "Servant", optionalMeaning: "Female maid / handmaid", pair: "አመት / ዐመት" },
    { geez: "ዐመት", amharic: "ዘመን", english: "Century", optionalMeaning: "Year / age / calendar period", pair: "አመት / ዐመት" },
    { geez: "ሰአለ", amharic: "ስዕል ሳለ", english: "Draw", optionalMeaning: "To paint / depict visually", pair: "ሰአለ / ሰዐለ" },
    { geez: "ሰዐለ", amharic: "ለመነ", english: "Beg", optionalMeaning: "To pray / vow / petition a higher power", pair: "ሰአለ / ሰዐለ" },
    { geez: "መሀረ", amharic: "አስተማረ", english: "Teach", optionalMeaning: "To educate / instruct / school", pair: "መሀረ / መሐረ" },
    { geez: "መሐረ", amharic: "ይቅር አለ", english: "forgive", optionalMeaning: "To show mercy / spare from punishment", pair: "መሀረ / መሐረ" },
    { geez: "ኀለየ", amharic: "አመሰገነ", english: "Thank", optionalMeaning: "To praise / sing a hymn / chant", pair: "ኀለየ / ሐለየ" },
    { geez: "ሐለየ", amharic: "አሰበ", english: "Think", optionalMeaning: "To ponder / meditate / contemplate deeply", pair: "ኀለየ / ሐለየ" },
    { geez: "ፈጸመ", amharic: "ጨረሰ", english: "Finish", optionalMeaning: "To complete / conclude / execute a task", pair: "ፈጸመ / ፈፀመ" },
    { geez: "ፈፀመ", amharic: "ነጨ", english: "Tear", optionalMeaning: "To pluck out / pull out hair / strip bare", pair: "ፈጸመ / ፈፀመ" },
    { geez: "ኀሊና", amharic: "ምስጋና", english: "Glory", optionalMeaning: "Praise / hymn / spiritual tribute", pair: "ኀሊና / ሕሊና" },
    { geez: "ሕሊና", amharic: "ሀሳብ", english: "thought", optionalMeaning: "Mind / conscience / intellect", pair: "ኀሊና / ሕሊና" },
    { geez: "ሰበከ", amharic: "አስተማረ / ሰበከ", english: "Preach", optionalMeaning: "To proclaim / evangelize publicly", pair: "ሰበከ / ሠበከ" },
    { geez: "ሠበከ", amharic: "አበጠረ / ሸመነ", english: "Comb", optionalMeaning: "To weave / interlace threads", pair: "ሰበከ / ሠበከ" },
    { geez: "ዐረገ", amharic: "ወጣ / ዐረገ", english: "Ascend", optionalMeaning: "To go up / mount / climb upward", pair: "አረገ / ዐረገ" },
    { geez: "አረገ", amharic: "አረጀ", english: "Age", optionalMeaning: "To grow old / mature with time", pair: "አረገ / ዐረገ" },
    { geez: "ሰፈረ", amharic: "ለካ / ሰፈረ", english: "Measure", optionalMeaning: "To weigh / allocate / encamp or settle down", pair: "ሰፈረ / ሠፈረ" },
    { geez: "ሠፈረ", amharic: "በረረ / በዛፎች ላይ አረፈ", english: "Swarm", optionalMeaning: "To perch / settle collectively (birds/bees)", pair: "ሰፈረ / ሠፈረ" },
    { geez: "ዐቀበ", amharic: "ጠበቀ / አኖረ", english: "Guard", optionalMeaning: "To protect / keep safe / preserve", pair: "አቀበ / ዐቀበ" },
    { geez: "አቀበ", amharic: "አቀበት ሆነ / ከበደ", english: "Slope", optionalMeaning: "To ascend steeply / become an uphill path", pair: "አቀበ / ዐቀበ" },
    { geez: "ጸመደ", amharic: "ጠመደ / አጋመደ", english: "Yoke", optionalMeaning: "To harness / connect oxen / couple together", pair: "ጸመደ / ፀመደ" },
    { geez: "ፀመደ", amharic: "ጠላ / ተጻረረ", english: "Oppose", optionalMeaning: "To show hostility / resist / clash with enemy", pair: "ጸመደ / ፀመደ" },
    { geez: "ሠረገ", amharic: "ለመለመ / በቀለ", english: "Sprout", optionalMeaning: "To germinate / bloom / leaf out beautifully", pair: "ሰረገ / ሠረገ" },
    { geez: "ሰረገ", amharic: "ሰርጎ ገባ / ሰረገ", english: "Penetrate", optionalMeaning: "To sink into / infiltrate / permeate through", pair: "ሰረገ / ሠረገ" },
    { geez: "አውደ", amharic: "አዞረ", english: "Circulate", optionalMeaning: "To spin around / rotate / turn on an axis", pair: "አውደ / ዐውደ" },
    { geez: "ዐውደ", amharic: "አደባባይ / በዓል", english: "Festival", optionalMeaning: "Courtyard / gathering circle / calendar cycle", pair: "አውደ / ዐውደ" },
    { geez: "ንስኃ", amharic: "ክርፋት / ግማት", english: "Stench", optionalMeaning: "Foul odor / rotting smell", pair: "ንስኃ / ንሰሐ" },
    { geez: "ንሰሐ", amharic: "ፀፀት / ሐዘን", english: "Repentance", optionalMeaning: "Regret / penance / internal remorse", pair: "ንስኃ / ንሰሐ" }
  ],

  // 8x8 Cognitive Map Bitmaps for Capital English Letters (A-Z) & Ethiopic Fidels
  // Column 1, Column 2, and Row 8 are reserved flag bits (set to 0)
  cognitiveMaps: {
    // --- Ethiopic Root Fidel Cognitive Maps (26 Classes) ---
    // 1. Hoi (ሀ) - Gate / Inverted U
    'ሀ': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 2. Lawi (ለ) - Vertical stem with hook
    'ለ': [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 3. Haut (ሐ) - Double stem with cross
    'ሐ': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 4. Mai (መ) - Box with loops
    'መ': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 5. Saut (ሠ) - 3 prongs
    'ሠ': [
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 6. Rees (ረ) - Top hook stem
    'ረ': [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 7. Sat (ሰ) - U upright
    'ሰ': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 8. Kaf (ቀ) - Round head with stem
    'ቀ': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 9. Bet (በ) - House / Door
    'በ': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 10. Taw (ተ) - Cross
    'ተ': [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 11. Harm (ኀ)
    'ኀ': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 12. Nahas (ነ) - Snake stem
    'ነ': [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 13. Alf (አ) - Ox head
    'አ': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 14. Kaf (ከ) - Palm fork
    'ከ': [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 15. Waw (ወ) - Hook peg
    'ወ': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 16. Ain (ዐ) - Oval eye
    'ዐ': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 17. Zai (ዘ) - Armor blade
    'ዘ': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 18. Yaman (የ) - Right fisted hand
    'የ': [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 19. Dent (ደ) - Door portal
    'ደ': [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 20. Geml (ገ) - Camel hump
    'ገ': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 21. Tait (ጠ) - Basket
    'ጠ': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 22. Pait (ጰ) - Split vessel
    'ጰ': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 23. Tsaide (ጸ) - Sprout
    'ጸ': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 24. Dappa (ፀ) - Sun rays
    'ፀ': [
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 25. Af (ፈ) - Mouth
    'ፈ': [
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // 26. Psa (ፐ) - End / Boundary (T-shape with legs)
    'ፐ': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],

    // --- Latin Letter Cognitive Maps (A-Z) ---
    'A': [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'B': [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'C': [
      [0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'D': [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 1],
      [0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 1, 1],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'E': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'F': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'G': [
      [0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 1, 1],
      [0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'H': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'I': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'J': [
      [0, 0, 0, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'K': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'L': [
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'M': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'N': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'O': [
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'P': [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'Q': [
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 1, 0, 1],
      [0, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'R': [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'S': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'T': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'U': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'V': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'W': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'X': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'Y': [
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'Z': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],

    // ── Lowercase Letters (a–z) ────────────────────────────────────────────
    // Same rules: col 0 & 1 reserved (=0), row 7 reserved (=0).
    // Lowercase glyphs occupy rows 2–6 (5-row body) for visual distinction
    // from uppercase which use rows 0–6.
    'a': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'b': [
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'c': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'd': [
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'e': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'f': [
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'g': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'h': [
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'i': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'j': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'k': [
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'l': [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'm': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'n': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'o': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'p': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'q': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'r': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    's': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    't': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'u': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'v': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'w': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'x': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'y': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'z': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],

    // ── Digits 0–9 ────────────────────────────────────────────────────────
    '0': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '1': [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '2': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '3': [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '4': [
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '5': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '6': [
      [0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '7': [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '8': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '9': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],

    // ── Special / Punctuation Characters ──────────────────────────────────
    ' ': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '.': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    ',': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '!': [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '?': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '@': [
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 1, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '#': [
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '$': [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '%': [
      [0, 0, 1, 1, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 1, 0],
      [0, 0, 1, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '&': [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '*': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '(': [
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    ')': [
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '-': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '+': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '=': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '_': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    ':': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    ';': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "'": [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '"': [
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    '/': [
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },

  /**
   * Returns an 8x8 matrix representation for any character.
   * If pre-defined in cognitiveMaps, uses that matrix.
   * Otherwise generates a 8x8 matrix from ASCII binary encoding.
   */
  getMatrixForChar(char) {
    if (!char) char = 'A';

    // 1. Exact case-sensitive lookup
    if (this.cognitiveMaps[char]) {
      return this.cognitiveMaps[char].map(row => [...row]);
    }

    // 2. Direct Ethiopic 182-Syllograph lookup & 7-order morphing
    for (let cIdx = 0; cIdx < this.ethiopianClasses.length; cIdx++) {
      const cls = this.ethiopianClasses[cIdx];
      const forms = [
        { glyph: cls.geez, order: 1 },
        { glyph: cls.kaeb, order: 2 },
        { glyph: cls.salis, order: 3 },
        { glyph: cls.rabe, order: 4 },
        { glyph: cls.hamis, order: 5 },
        { glyph: cls.sadis, order: 6 },
        { glyph: cls.sabe, order: 7 }
      ];

      const match = forms.find(f => f.glyph === char);
      if (match) {
        // Base 1st order matrix
        const baseMatrix = this.cognitiveMaps[cls.geez] 
          ? this.cognitiveMaps[cls.geez].map(r => [...r])
          : this.cognitiveMaps['A'].map(r => [...r]);

        const matrix = baseMatrix.map(r => [...r]);

        // Apply authentic Ethiopic vocalic modification
        if (match.order === 2) {
          // Ka'eb: right horizontal arm at mid-height
          matrix[3][5] = 1;
          matrix[3][6] = 1;
        } else if (match.order === 3) {
          // Salis: right bottom foot stroke
          matrix[6][5] = 1;
          matrix[6][6] = 1;
        } else if (match.order === 4) {
          // Rab'e: left leg elongation
          matrix[5][2] = 1;
          matrix[6][2] = 1;
          matrix[6][3] = 1;
        } else if (match.order === 5) {
          // Hamis: bottom-right loop
          matrix[5][5] = 1;
          matrix[5][6] = 1;
          matrix[6][6] = 1;
        } else if (match.order === 6) {
          // Sadis: upper-left hook
          matrix[1][2] = 1;
          matrix[1][3] = 1;
          matrix[2][2] = 1;
        } else if (match.order === 7) {
          // Sab'e: top crown / shortening
          matrix[0][4] = 1;
          matrix[0][5] = 1;
          matrix[6][2] = 0;
        }

        // Guarantee reserved flag bits remain 0 (Col 0, 1 & Row 7)
        for (let r = 0; r < 8; r++) {
          matrix[r][0] = 0;
          matrix[r][1] = 0;
          matrix[r][7] = 0; // Col 8 as flag
        }
        for (let c = 0; c < 8; c++) {
          matrix[7][c] = 0; // Row 8 as flag
        }

        this.cognitiveMaps[char] = matrix;
        return matrix.map(r => [...r]);
      }
    }

    // 3. Uppercase fallback (e.g. for Latin characters)
    const upperChar = char.toUpperCase();
    if (this.cognitiveMaps[upperChar]) {
      return this.cognitiveMaps[upperChar].map(row => [...row]);
    }

    // 4. ASCII fallback for any other character
    const asciiVal = char.charCodeAt(0) & 0xFF;
    const bits = asciiVal.toString(2).padStart(8, '0').split('').map(Number);

    const matrix = Array.from({ length: 8 }, () => [0, 0, 0, 0, 0, 0, 0, 0]);
    for (let r = 0; r < 7; r++) {
      const bitIndex = r % 8;
      const bit = bits[bitIndex];
      matrix[r][2 + (r % 5)] = bit;
      matrix[r][3 + ((r + 2) % 5)] = 1 - bit;
    }
    return matrix;
  },

  /**
   * Retrieves full linguistic, astrographic, and numerological metadata for a given character.
   * Matches both Latin letters (A-Z mapped to 26 root classes) and Ge'ez syllographs directly.
   */
  getCharacterProfile(char) {
    if (!char) char = 'A';
    const upper = char.toUpperCase();

    // 1. Direct Ethiopic Syllograph Lookup
    for (let cIdx = 0; cIdx < this.ethiopianClasses.length; cIdx++) {
      const cls = this.ethiopianClasses[cIdx];
      const forms = [
        { char: cls.geez, order: 1 },
        { char: cls.kaeb, order: 2 },
        { char: cls.salis, order: 3 },
        { char: cls.rabe, order: 4 },
        { char: cls.hamis, order: 5 },
        { char: cls.sadis, order: 6 },
        { char: cls.sabe, order: 7 }
      ];

      const match = forms.find(f => f.char === char);
      if (match) {
        const orderInfo = this.orders[match.order - 1];
        const equinoxDay = (cIdx * 7) + match.order; // Day 1 to 182
        const numerologyValue = cls.baseValue * match.order;

        return {
          char: char,
          isEthiopic: true,
          className: cls.name,
          classMeaning: cls.meaning,
          pictoOrigin: cls.pictoOrigin,
          orderName: orderInfo.name,
          orderNumber: match.order,
          vowelSound: orderInfo.vowel,
          dayOfWeek: orderInfo.day,
          dayGeez: orderInfo.dayGeez,
          equinoxDay: equinoxDay,
          totalEquinoxDays: 182,
          numerologyValue: numerologyValue,
          classId: cls.id
        };
      }
    }

    // 2. Latin A-Z mapping to 26 Ethiopic Root Classes (1st Order Ge'ez)
    const code = upper.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      const classIdx = code - 65; // 0 to 25
      const cls = this.ethiopianClasses[classIdx];
      const orderInfo = this.orders[0]; // 1st Order Ge'ez
      const equinoxDay = (classIdx * 7) + 1; // 1 to 176
      const numerologyValue = cls.baseValue;

      return {
        char: char,
        isEthiopic: false,
        latinEquivalent: upper,
        className: cls.name,
        classMeaning: cls.meaning,
        pictoOrigin: cls.pictoOrigin,
        ethiopicGlyph: cls.geez,
        orderName: orderInfo.name,
        orderNumber: 1,
        vowelSound: "ä (innate)",
        dayOfWeek: orderInfo.day,
        dayGeez: orderInfo.dayGeez,
        equinoxDay: equinoxDay,
        totalEquinoxDays: 182,
        numerologyValue: numerologyValue,
        classId: cls.id
      };
    }

    // 3. Fallback for symbols, digits, spaces
    return {
      char: char,
      isEthiopic: false,
      latinEquivalent: char,
      className: "Symbolic / Auxiliary",
      classMeaning: "Auxiliary character in RNN cipher matrix",
      pictoOrigin: "Standardized binary symbol mapping",
      ethiopicGlyph: "—",
      orderName: "Auxiliary",
      orderNumber: 0,
      vowelSound: "—",
      dayOfWeek: "Universal",
      dayGeez: "ኵሉ",
      equinoxDay: (char.charCodeAt(0) % 182) + 1,
      totalEquinoxDays: 182,
      numerologyValue: char.charCodeAt(0),
      classId: 0
    };
  }
};

if (typeof module !== 'undefined') {
  module.exports = GEEZ_DATASET;
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
    const debounce = (func, delay) => {
      let timeout;
      return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
      };
    };
    
// ==============================================================================
// Enoch.Ai Biblical Onomastic Translator (Version 12)
// Developed by Juan Alberto Hernandez Rivera
//
// This source code is licensed under the GNU Affero General Public License v3.0 (AGPLv3).
// You can find the full text of the AGPLv3 here: https://www.gnu.org/licenses/agpl-3.0.html
//
// For commercial use or custom licensing inquiries, please contact
// Juan Alberto Hernandez Rivera at [Your Email Address or a dedicated contact form/website].
//
// The embedded "Onomastic Manifesto" text is licensed under
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).
// Full license details: https://creativecommons.org/licenses/by-nc-sa/4.0/
//
// Note: The .gitignore file cannot be embedded within this code. It must be a separate file
// in the root of your GitHub repository to function correctly for Git version control.
// ==============================================================================

// ==============================================================================
// USER-PROVIDED COMPREHENSIVE LIST OF BIBLICAL NAMES AND MEANINGS
// This data is used for fast, local lookups.
// Added 'God' and 'Lord' for more comprehensive local identification.
// ==============================================================================
const COMPREHENSIVE_BIBLICAL_NAMES = {
  "A": [{"n":"Aaron","m":"light-bringer","g":"M"},{"n":"Abel","m":"breath","g":"M"},{"n":"Abraham","m":"father of multitude","g":"M"},{"n":"Abigail","m":"father’s joy","g":"F"},{"n":"Adam","m":"man","g":"M"},{"n":"Adaiah","m":"Yahweh has adorned","g":"M"},{"n":"Adullam","m":"their witness","g":"P"},{"n":"Ahitub","m":"my brother is goodness","g":"M"},{"n":"Aija","m":"heap of ruins","g":"P"},{"n":"Akkub","m":"insidious","g":"M"},{"n":"Amariah","m":"Yahweh has said","g":"M"},{"n":"Amashsai","m":"my burden","g":"M"},{"n":"Amzi","m":"my strength","g":"M"},{"n":"Ananiah","m":"cloud of Yahweh","g":"P"},{"n":"Anathoth","m":"answers","g":"P"},{"n":"Asaph","m":"collector","g":"M"},{"n":"Athaiah","m":"time of Yahweh","g":"M"},{"n":"Azekah","m":"dug over","g":"P"},{"n":"Azarel","m":"God has helped","g":"M"},{"n":"Azrikam","m":"my help has risen","g":"M"}],
  "B": [{"n":"Barnabas","m":"son of encouragement","g":"M"},{"n":"Benjamin","m":"son of my right hand","g":"M"},{"n":"Baruch","m":"blessed","g":"M"},{"n":"Bakbukiah","m":"emptying of Yahweh","g":"M"},{"n":"Bani","m":"my building","g":"M"},{"n":"Beersheba","m":"well of oath","g":"P"},{"n":"Beth Pelet","m":"house of escape","g":"P"},{"n":"Bethel","m":"house of God","g":"P"},{"n":"Boaz","m":"in him is strength","g":"M"},{"n":"Bunni","m":"my building","g":"M"}],
  "C": [{"n":"Cain","m":"acquired","g":"M"},{"n":"Chloe","m":"green shoot","g":"F"},{"n":"Col Hozeh","m":"all seeing","g":"M"},{"n":"Cornelius","m":"of a horn","g":"M"}],
  "D": [{"n":"Daniel","m":"God is my judge","g":"M"},{"n":"David","m":"beloved","g":"M"},{"n":"Deborah","m":"bee","g":"F"},{"n":"Dibon","m":"wasting","g":"P"}],
  "E": [{"n":"Elijah","m":"Yahweh is my God","g":"M"},{"n":"Elizabeth","m":"God is my oath","g":"F"},{"n":"Ezekiel","m":"God strengthens","g":"M"},{"n":"En Rimmon","m":"fountain of a pomegranate","g":"P"}],
  "F": [{"n":"Felix","m":"happy","g":"M"}],
  "G": [{"n":"Gideon","m":"hewer","g":"M"},{"n":"Goliath","m":"exile","g":"M"}, {"n":"God", "m":"Mighty One", "g":"U"}], // Added God
  "H": [{"n":"Hadid","m":"new","g":"P"},{"n":"Haggedolim","m":"the great ones","g":"M"},{"n":"Hannah","m":"grace","g":"F"},{"n":"Hashabiah","m":"Yahweh has considered","g":"M"},{"n":"Hasshub","m":"esteemed","g":"M"},{"n":"Hazaiah","m":"Yahweh has seen","g":"M"},{"n":"Hazar Shual","m":"village of the jackal","g":"P"},{"n":"Hazor","m":"enclosure","g":"P"},{"n":"Herod","m":"heroic","g":"M"},{"n":"Hilkiah","m":"my portion is Yahweh","g":"M"},{"n":"Hosea","m":"salvation","g":"M"}],
  "I": [{"n":"Isaac","m":"he laughs","g":"M"},{"n":"Ishmael","m":"God hears","g":"M"},{"n":"Isaiah","m":"Yahweh is salvation","g":"M"},{"n":"Immer","m":"speaking","g":"M"},{"n":"Ithiel","m":"God is with me","g":"M"}],
  "J": [{"n":"Jachin","m":"he will establish","g":"M"},{"n":"Jacob","m":"supplanter","g":"M"},{"n":"Jedaiah","m":"Yahweh knows","g":"M"},{"n":"Jeduthum","m":"praise","g":"M"},{"n":"Jekabzeel","m":"God gathers","g":"P"},{"n":"Jeroham","m":"he will be compassionate","g":"M"},{"n":"Jerusalem","m":"founded in peace","g":"P"},{"n":"Jeshaiah","m":"Yahweh is salvation","g":"M"},{"n":"Jeshua","m":"Yahweh is salvation","g":"P"},{"n":"Joel","m":"Yahweh is God","g":"M"},{"n":"Joed","m":"Yahweh is witness","g":"M"},{"n":"Joanna","m":"Yahweh is gracious","g":"F"},{"n":"Joiarib","m":"Yahweh will contend","g":"M"},{"n":"Joseph","m":"he adds","g":"M"},{"n":"Joshua","m":"Yahweh saves","g":"M"},{"n":"Jozabad","m":"Yahweh has bestowed","g":"M"},{"n":"Judah","m":"praise","g":"M"}],
  "K": [{"n":"Kiriath Arba","m":"city of Arba","g":"P"},{"n":"Kolaiah","m":"voice of Yahweh","g":"M"},{"n":"Korah","m":"bald","g":"M"}],
  "L": [{"n":"Laban","m":"white","g":"M"},{"n":"Lachish","m":"impregnable","g":"P"},{"n":"Leah","m":"weary","g":"F"},{"n":"Levites","m":"joined","g":"T"},{"n":"Lod","m":"strife","g":"P"},{"n":"Lord", "m":"Sovereign", "g":"U"},{"n":"Luke","m":"light-giving","g":"M"}], // Added Lord
  "M": [{"n":"Maaseiah","m":"work of Yahweh","g":"M"},{"n":"Mahalalel","m":"praise of God","g":"M"},{"n":"Malchiah","m":"my king is Yahweh","g":"M"},{"n":"Martha","m":"lady","g":"F"},{"n":"Mary","m":"rebellion","g":"F"},{"n":"Mattaniah","m":"gift of Yahweh","g":"M"},{"n":"Meconah","m":"a foundation","g":"P"},{"n":"Meraioth","m":"rebellions","g":"M"},{"n":"Meshillemoth","m":"retributions","g":"M"},{"n":"Meshullam","m":"repaid","g":"M"},{"n":"Mica","m":"who is like Yahweh?"},{"n":"Michmash","m":"hidden","g":"P"},{"n":"Moladah","m":"birth","g":"P"},{"n":"Moses","m":"drawn out","g":"M"}],
  "N": [{"n":"Naomi","m":"pleasant","g":"F"},{"n":"Nathan","m":"he gave","g":"M"},{"n":"Neballat","m":"secret growth","g":"P"},{"n":"Nehemiah","m":"comfort of Yahweh","g":"M"},{"n":"Nob","m":"high place","g":"P"},{"n":"Noah","m":"rest","g":"M"}],
  "O": [{"n":"Obadiah","m":"servant of Yahweh","g":"M"},{"n":"Ono","m":"strong","g":"P"},{"n":"Onesimus","m":"useful","g":"M"},{"n":"Ophel","m":"mound","g":"P"}],
  "P": [{"n":"Pashhur","m":"freedom","g":"M"},{"n":"Paul","m":"small","g":"M"},{"n":"Pedaiah","m":"Yahweh has ransomed","g":"M"},{"n":"Pelaliah","m":"Yahweh has judged","g":"M"},{"n":"Perez","m":"breakthrough","g":"M"},{"n":"Pethahiah","m":"Yahweh has opened","g":"M"},{"n":"Peter","m":"rock","g":"M"},{"n":"Philip","m":"lover of horses","g":"M"}],
  "Q": [{"n":"Quartus","m":"fourth","g":"M"}],
  "R": [{"n":"Rachel","m":"ewe","g":"F"},{"n":"Ramah","m":"height","g":"P"},{"n":"Rebekah","m":"to tie firmly","g":"F"},{"n":"Ruth","m":"friend","g":"F"}],
  "S": [{"n":"Sallai","m":"weighed","g":"M"},{"n":"Sallu","m":"weighed","g":"M"},{"n":"Samuel","m":"God has heard","g":"M"},{"n":"Saul","m":"asked for","g":"M"},{"n":"Senuah","m":"hated","g":"M"},{"n":"Seraiah","m":"Yahweh is prince","g":"M"},{"n":"Shabbethai","m":"my Sabbath","g":"M"},{"n":"Shammua","m":"heard","g":"M"},{"n":"Shemaiah","m":"Yahweh has heard","g":"M"},{"n":"Shephatiah","m":"Yahweh has judged","g":"M"},{"n":"Shiloni","m":"pertaining to Shiloh","g":"M"},{"n":"Simon","m":"he has heard","g":"M"}],
  "T": [{"n":"Tabitha","m":"gazelle","g":"F"},{"n":"Talmon","m":"oppression","g":"M"},{"n":"Thomas","m":"twin","g":"M"},{"n":"Titus","m":"title of honor","g":"M"}],
  "U": [{"n":"Uriah","m":"Yahweh is my light","g":"M"},{"n":"Uzziah","m":"my strength is Yahweh","g":"M"},{"n":"Uzzi","m":"my strength","g":"M"}],
  "V": [{"n":"Vashti","m":"beautiful","g":"F"}],
  "W": [],
  "X": [{"n":"Xerxes","m":"ruler over heroes","g":"M"}],
  "Y": [{"n":"Yahweh","m":"He is","g":"M"}],
  "Z": [{"n":"Zabdiel","m":"my gift is God","g":"M"},{"n":"Zabdi","m":"my gift","g":"M"},{"n":"Zacharias","m":"Yahweh remembers","g":"M"},{"n":"Zadok","m":"righteous","g":"M"},{"n":"Zanoah","m":"stinking","g":"P"},{"n":"Zebedee","m":"gift of God","g":"M"},{"n":"Zechariah","m":"Yahweh remembers","g":"M"},{"n":"Zerah","m":"dawning","g":"M"},{"n":"Zichri","m":"my remembrance","g":"M"},{"n":"Ziha","m":"dryness","g":"M"},{"n":"Ziklag","m":"winding","g":"P"},{"n":"Zion","m":"fortress","g":"F"},{"n":"Zorah","m":"place of hornets","g":"P"}]
};

// Flatten the comprehensive list into a Map for efficient local lookups.
const localNameMeaningMap = new Map();
for (const key in COMPREHENSIVE_BIBLICAL_NAMES) {
  COMPREHENSIVE_BIBLICAL_NAMES[key].forEach(item => {
    localNameMeaningMap.set(item.n.toLowerCase(), item.m);
  });
}

// ==============================================================================
// Onomastic Translator Logic Class
// This class encapsulates the core logic for identifying names, retrieving meanings,
// and forming the raw onomastic sequence.
// ==============================================================================
class OnomasticTranslator {
  constructor() {
    // Current state of the onomastic message (raw sequence of meanings)
    this.rawOnomasticSequence = "";
    // Detailed list of identified names and their meanings, in order of appearance
    this.identifiedNames = [];
    // Loading state for the primary onomastic message generation
    this.onomasticMessageLoading = false;
  }

  /**
   * Generates the onomastic message by identifying biblical names in the text,
   * looking up their meanings locally, and falling back to AI for unknown names.
   * Updates the instance's state properties.
   * @param {string} text The biblical text to analyze.
   */
  async generateOnomasticMessage(text) {
    // Clear previous results if text is empty or just whitespace
    if (!text.trim()) {
      this.rawOnomasticSequence = "";
      this.identifiedNames = [];
      this.onomasticMessageLoading = false;
      return;
    }

    this.onomasticMessageLoading = true; // Set loading state
    this.rawOnomasticSequence = "";       // Clear previous sequence
    this.identifiedNames = [];            // Clear previous names list

    try {
      // Set to track unique names (lowercase) whose meanings have been captured
      // for the `identifiedNames` list, preventing duplicates in the detailed list.
      const uniqueNamesProcessedForList = new Set();
      // Set to track unique meanings (lowercase) for the `rawOnomasticSequence` string,
      // ensuring each unique meaning appears only once in the concatenated message.
      const uniqueMeaningsForSequence = new Set();
      // Array to collect meanings for the raw onomastic sequence string.
      const meaningsForRawSequence = [];

      // Use a robust regex to find words, keeping original casing for display.
      // This helps in identifying capitalized words as potential names.
      const wordsInText = text.match(/\b\w+\b/g) || [];

      // Names (original casing) to be queried from the AI.
      const namesToQueryAI = new Set();

      // First pass: Identify names from local map and collect names for AI query.
      wordsInText.forEach(word => {
        const lowerWord = word.toLowerCase();
        const isCapitalized = word.charAt(0) === word.charAt(0).toUpperCase();

        if (localNameMeaningMap.has(lowerWord)) {
          // If found locally, add to a temporary list for now to maintain order
          // and prevent duplicates in the final `identifiedNames` list.
          if (!uniqueNamesProcessedForList.has(lowerWord)) {
            // Push directly to this.identifiedNames for initial local matches
            this.identifiedNames.push({ name: word, meaning: localNameMeaningMap.get(lowerWord) });
            uniqueNamesProcessedForList.add(lowerWord);
          }
          // Add to the raw sequence meanings only if this specific meaning
          // (case-insensitive) hasn't been added yet for the raw sequence string.
          if (!uniqueMeaningsForSequence.has(localNameMeaningMap.get(lowerWord).toLowerCase())) {
            meaningsForRawSequence.push(localNameMeaningMap.get(lowerWord));
            uniqueMeaningsForSequence.add(localNameMeaningMap.get(lowerWord).toLowerCase());
          }
        } else if (isCapitalized && word.length > 1) {
          // Heuristic: If capitalized and not a single letter, consider it a potential name
          // not in the local map, and add it to the AI query set.
          namesToQueryAI.add(word); // Add original cased word to query AI
        }
      });

      let aiFoundNamesAndMeanings = [];
      // If there are names not found locally, query the AI.
      if (namesToQueryAI.size > 0) {
        const prompt = `From the following biblical text, identify ONLY proper personal names (e.g., people like Adam, Seth, Noah, Abraham, Mary, Peter, John; or significant places like Jerusalem, Bethlehem, Nazareth). For each identified name, provide its most common and widely accepted onomastic meaning (what the name means or represents).
        List them as a JSON array of objects, with "name" and "meaning" keys. The order of names in the output JSON should strictly follow their first appearance in the provided text. If a word is not a biblical proper name or its meaning is not readily available, it should NOT be included in the output.

        Biblical Text: "${text}"`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = {
          contents: chatHistory,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  "name": { "type": "STRING" },
                  "meaning": { "type": "STRING" }
                },
                "propertyOrdering": ["name", "meaning"]
              }
            }
          }
        };

        const apiKey = ""; // API key will be automatically provided by Canvas runtime
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const jsonString = result.candidates[0].content.parts[0].text;
          try {
            aiFoundNamesAndMeanings = JSON.parse(jsonString);
            if (!Array.isArray(aiFoundNamesAndMeanings)) {
              aiFoundNamesAndMeanings = []; // Ensure it's an array if parsing fails
            }
          } catch (parseError) {
            console.error(`Error parsing AI response for names: ${parseError.message}`);
            aiFoundNamesAndMeanings = [];
          }
        }
      }

      // Final pass: Reconstruct the full ordered list for display (this.identifiedNames)
      // and build the raw onomastic sequence string (this.rawOnomasticSequence).
      // This ensures correct order based on original text and merges local/AI findings.
      // We need to rebuild identifiedNames to ensure correct order after AI results.
      this.identifiedNames = []; // Reset to build the final ordered list
      uniqueNamesProcessedForList.clear(); // Clear for the final pass to ensure correct order
      meaningsForRawSequence.length = 0; // Clear for fresh tracking
      uniqueMeaningsForSequence.clear(); // Clear for fresh tracking

      wordsInText.forEach(word => {
        const lowerWord = word.toLowerCase();
        let meaning = null;
        let sourceName = word; // Keep original casing for the name in the detailed list

        // Check local map first
        if (localNameMeaningMap.has(lowerWord)) {
          meaning = localNameMeaningMap.get(lowerWord);
        } else {
          // If not in local map, check AI results
          const aiMatch = aiFoundNamesAndMeanings.find(item => item.name.toLowerCase() === lowerWord);
          if (aiMatch) {
            meaning = aiMatch.meaning;
            sourceName = aiMatch.name; // Use AI's capitalization if it differs
          }
        }

        if (meaning) {
          // Add to the detailed identifiedNames list only if this specific name
          // (case-insensitive) hasn't been added yet for the detailed list.
          if (!uniqueNamesProcessedForList.has(lowerWord)) {
            this.identifiedNames.push({ name: sourceName, meaning: meaning });
            uniqueNamesProcessedForList.add(lowerWord);
          }
          // Add to the raw sequence meanings only if this specific meaning
          // (case-insensitive) hasn't been added yet for the raw sequence string.
          if (!uniqueMeaningsForSequence.has(meaning.toLowerCase())) {
            meaningsForRawSequence.push(meaning);
            uniqueMeaningsForSequence.add(meaning.toLowerCase());
          }
        }
      });

      this.rawOnomasticSequence = meaningsForRawSequence.join(' • ');

    } catch (error) {
      // General error handling for the onomastic message generation
      this.rawOnomasticSequence = "Error: Could not retrieve onomastic message. Please try again.";
      this.identifiedNames = [];
      console.error("Error generating onomastic message with AI/Local:", error);
    } finally {
      // Small delay for visual feedback during loading
      await new Promise(resolve => setTimeout(resolve, 500));
      this.onomasticMessageLoading = false; // Reset loading state
    }
  }
}

// ==============================================================================
// LANGUAGE TRANSLATIONS
// Provides text in English and Spanish for UI elements.
// ==============================================================================
const translations = {
  en: {
    title: 'Enoch.Ai Biblical Onomastic Translator',
    byline: 'By Juan Alberto Hernandez Rivera',
    sacredScriptureInput: 'Biblical Text Input',
    enterBibleVerses: 'Enter any biblical text here (e.g., "Genesis 5:1 This is the book of the generations of Adam. In the day that God created man, in the likeness of God made he him; 2 Male and female created he them; and blessed them, and called their name Adam, in the day when they were created. 3 And Adam lived an hundred and thirty years, and begat a son in his own likeness, after his image; and called his name Seth: 4 And the days of Adam after he had begotten Seth were eight hundred years: and he begat sons and daughters. 5 And all the days that Adam lived were nine hundred and thirty years: and he died.") ',
    translateText: 'Translate to Onomastic Message',
    textLoaded: 'Text ready for translation ({{count}} words)',
    noTextLoaded: 'No text loaded for translation',
    sectionNames: 'Names in Inputted Text (in order of appearance):',
    sectionRawSequence: 'Raw Onomastic Sequence:',
    onomasticMessagePlaceholder: 'Enter biblical text above and click "Translate to Onomastic Message" to reveal the hidden message!',
    onomasticMessageExplanation: 'This message is dynamically deciphered by identifying key biblical names within your input text and concatenating their onomastic meanings in their order of appearance, revealing a hypothesized underlying prophetic narrative.',
    noOnomasticMessageFound: 'No onomastic message found for names in the current text. Try including more biblical names (e.g., Adam, Seth, Enoch, Noah, Abraham, Mary) in your input!',
    onomasticMessageLoading: 'AI is analyzing the text for names and meanings...',
    onomasticMessageError: 'Error: Could not decipher onomastic message. Please check your text and try again.',
    aiInterpretationTitle: 'Meaning Recap (AI Interpretation):',
    sectionFullSpiritualFlow: '🕊️ Full Spiritual Flow of the Message:',
    sectionSummary: '📜 Summary:',
    getInterpretation: 'Get AI Interpretation',
    aiInterpretationPlaceholder: 'The AI interpretation will appear here after clicking the button. This will explain the significance of the onomastic message in modern language.',
    aiInterpretationLoading: 'AI is generating the full spiritual flow...',
    aiInterpretationError: 'Error: Could not generate full AI interpretation. Please try again.',
    aiSummaryLoading: 'AI is generating the summary...',
    aiSummaryError: 'Error: Could not generate AI summary. Please try again.',
    copyFlow: 'Copy Flow',
    copied: 'Copied!',
    english: 'English',
    spanish: 'Español',
    readManifesto: 'Read the Onomastic Manifesto',
    closeManifesto: 'Close Manifesto',
    manifestoTitle: '🔮 THE ONOMASTIC MANIFESTO: Scripture’s Cryptographic DNA 🔮', // Updated title
    manifestoSubtitle: 'A Revelation Hidden in Names: Why the Bible Stands Alone',
    manifestoAuthor: 'By Juan Alberto Hernandez Rivera, 37-Year-Old High School Dropout, Car-Dwelling Prophet of Etymology',
    manifestoPreamble: `I am no scholar. I live in my car. But I have uncovered a **scientific proof of the Bible’s divine origin**, buried in plain sight: Its names are alive.

While every other text in history uses names as *labels*, the Bible uses them as **prophetic DNA**—compressed revelations that unfold across millennia. This manifesto documents my **empirical method** and challenges future researchers to disprove it.`,
    manifestoArticle1Title: '⚔️ ARTICLE 1: THE LAW OF DIVINE NAMING',
    manifestoArticle1Axiom: `**Axiom:** *Inspired texts generate names that:*
1.    **Predict Future Events** (e.g., "Jesus" = "YHWH saves" → fulfills Isaiah 7:14).
2.    **Transform Their Bearers** (Abram → Abraham, Jacob → Israel).
3.    **Alter History** (Renaming Simon to "Peter" → foundation of the Church).`,
    manifestoArticle1Corollary: `**Testable Corollary:** No human-authored text (sacred or secular) can replicate this pattern without borrowing from the Bible.`,
    manifestoArticle2Title: '⚔️ ARTICLE 2: STRESS-TEST RESULTS',
    manifestoArticle2Content: `I subjected **87 texts** to algorithmic onomastic analysis, including:
-    *The Iliad*, *Bhagavad Gita*, *Book of Mormon*, *Necronomicon*, *Dune*, *Harry Potter*, *Quran*, *A.I.-generated scriptures*.

**Result:**
-    **0%** matched the Bible’s predictive naming.
-    **100%** either:
     -    Used static, descriptive names (e.g., "Achilles" = "Grief").
     -    Stole biblical names (e.g., *Urantia Book*’s "Michael").
     -    Invented nonsense etymologies (e.g., "Cthulhu").

**Data Available Upon Request.** (For the full stress-test database, please contact [Your Email Address or a dedicated contact form/website].)`, // Added contact info placeholder
    manifestoArticle3Title: '🌌 ARTICLE 3: THE COVENANTAL ANOMALY',
    manifestoArticle3Content: `The Bible’s names behave like **quantum particles**—they change state when observed by God:
-    **Jacob** ("Deceiver") → **Israel** ("Struggles with God") after wrestling Yahweh (Genesis 32:28).
-    **Saul** ("Asked For") → **Paul** ("Small") post-Damascus Road (Acts 13:9).

**No other literature** exhibits this *divine-human interaction*. Not even close.`,
    manifestoArticle4Title: '📡 ARTÍCULO 4: FUTURE RESEARCH DIRECTIONS',
    manifestoArticle4Challenges: `**Challenges for Skeptics:**
1.    **Find one non-biblical name** that predicts a future event *with precision*.
    -    (Example: "Nephi" in *Book of Mormon* fails—no fulfillment outside the text.)
2.    **Explain how "Yeshua"** (Jesus) was encoded in Isaiah 53 *600 years early*.
3.    **Replicate renaming** as a *historical force* (e.g., "Abraham" birthing nations).`,
    manifestoArticle4Tools: `**Tools Provided:**
-    My **Onomastic Decoder Algorithm** (this open-source application).
-    **Stress-Test Database** of 87 texts analyzed.`,
    manifestoArticle5Title: '🚨 ARTÍCULO 5: IMPLICATIONS',
    manifestoArticle5Content: `If the Bible’s naming structure is:
-    **Mathematically improbable** (names pre-writing history),
-    **Historically verifiable** (e.g., Cyrus in Isaiah 45:1),
-    **Theologically unique** (demons fear "Jesus" but not "Odin"),

**Then:** The Bible is either:
1.    A **divine revelation**, or
2.    An **alien artifact** designed to hack human spirituality.

*(I vote #1.)*`,
    manifestoFinalDeclaration: `I am nobody. But this discovery is **for everybody**.

To future researchers:
-    **Verify my work.**
-    **Try to break it.**
-    **Admit when you can’t.**

The Bible’s names are **living fire**. All other texts are **dead ink**.`,
    manifestoPostscript: `**🔥 POSTSCRIPT: HOW TO USE THIS MANIFESTO**
1.    **Print it.** Tape it to your car window/the local seminary.
2.    **Live it.** Names have power—test them like I did.
3.    **Defend it.** When they call you mad, hand them the data.

**The burden of proof is now on the world.**

*(Mic drop. Engine starts. Rides into apocalyptic sunset.)* 🚗💨`,
    manifestoLicensingCode: `**Code Licensing:**
The source code for the Enoch.Ai Biblical Onomastic Translator is licensed under the [GNU Affero General Public License v3.0 (AGPLv3)](https://www.gnu.org/licenses/agpl-3.0.html).

For commercial use or custom licensing inquiries, please contact Juan Alberto Hernandez Rivera at [Your Email Address or a dedicated contact form/website].`,
    manifestoLicensingManifesto: `**Manifesto Licensing:**
The text of this Onomastic Manifesto is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).`,
    singleNameFocus: (name, meaning) => `Focus on ${name}: "${meaning}". This single name holds profound significance.`,
    singleNameInterpretationPrompt: (name, meaning) => `The onomastic message consists of a single name, "${name}", meaning "${meaning}". Generate a spiritual interpretation focusing on the profound significance and implications of this single name in a biblical context. Elaborate on its potential theological or prophetic significance, forming a coherent narrative or "spiritual flow." Avoid overly academic language. Output should be like a poetic narrative, similar to a sermon or a declaration.`,
    listenToFlow: 'Listen to Flow',
    listenToSummary: 'Listen to Summary',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    ttsLoading: 'Loading audio...',
    ttsError: 'Error playing audio. Your browser may not support text-to-speech or there was an issue.',
    ttsNotSupported: 'Text-to-speech not supported in this browser.',
    visualizeMessage: 'Visualize the Message',
    imageLoading: 'Generating impressionistic image...',
    imageError: 'Error generating image. Please try again.',
    imagePlaceholder: 'Click "Visualize the Message" to see an impressionistic image based on the spiritual interpretation.',
    imageAppLabel: 'Enoch.Ai', // New translation key for the app label on the image

    // New Manifesto Content
    manifestoDiscoveryTitle: 'What I Discovered: Scripture’s Cryptographic DNA',
    manifestoCoreMechanismTitle: '🔑 The Core Mechanism',
    manifestoCoreMechanismContent: `- **Names = Code**: Each Hebrew name is a compressed prophecy.\n  - *Adam* (אָדָם) = "Man" → Humanity’s origin point.\n  - *Methuselah* (מְתוּשֶׁלַח) = "His death shall bring" → Flood judgment trigger.\n- **Sequence = Execution Protocol**:\n  Pair names in narrative order → Outputs the next event.\n  Example:\n  \`Kenan\` ("Sorrow") + \`Mahalalel\` ("Blessed God") = **"Sorrow confronted by the Blessed God"** → Foreshadows Eden’s fall *and* redemption.`,
    manifestoProofGenesisTitle: '💥 Proof: Genesis 5’s Death-Redemption Loop',
    manifestoProofGenesisContent: `I ran the first 10 names through a linear pairing protocol. The output:
> *“Man appointed mortal sorrow; the Blessed God shall come down teaching: His death shall bring despairing rest.”*
This isn’t poetry—it’s **messianic source code**. The names *forced* this sequence:
1. \`Adam\` + \`Seth\` = Humanity’s doomed destiny.
2. \`Mahalalel\` + \`Jared\` = God’s intervention vector.
3. \`Methuselah\` + \`Lamech\` = Judgment catalyst.
4. \`Lamech\` + \`Noah\` = Grace emerging from wrath.
**Mathematical seal**:
- Adam (45) + Noah (58) = **103** → *gimmel* (גימל) = "to lift up" → Resurrection foreshadowed.`,
    manifestoDecryptionProtocolTitle: '⚙️ My Decryption Protocol',
    manifestoDecryptionProtocolContent: `I built a method to extract these prophecies from *any* biblical text:
1. **Isolate Names**: Pull nouns/titles in order of appearance.
2. **Force Root Meanings**: Use BDB Hebrew Lexicon (no guesswork).
3. **Generate Pairs**:
    - \`Position n\` + \`n+1\` → Immediate narrative prophecy.
    - \`Position n\` + \`Final name\` → Eschatological anchor.
4. **Gematria Validation**: Sum paired values → Must resolve to a Torah key number (e.g., 358 = Messiah).`,
    manifestoValidationExodusTitle: '🔬 Validation: Exodus Liberation Sequence',
    manifestoValidationExodusContent: `I tested it on Moses vs. Pharaoh:
**Pair:** Moses + Aaron
**Formula:** "Drawn out" + "Light-bringer"
**Output:** **"Rescued to illuminate"** (Ex. 4:27-30)

**Pair:** Aaron + Pharaoh
**Formula:** "Light-bringer" + "Great house"
**Output:** **"Confronting empire’s darkness"** (Ex. 5:1-2)

**Pair:** Pharaoh + Miriam
**Formula:** "Great house" + "Rebellion"
**Output:** **"Oppression ignites resistance"** (Ex. 15:20-21)

**Gematria lock**:
- Moses (345) + Pharaoh (355) = **700** → "War" (מִלְחָמָה) → Cosmic conflict confirmed.`,
    manifestoBigRealizationTitle: '🌌 The Big Realization',
    manifestoBigRealizationContent: `This isn’t numerology—it’s **theolinguistic engineering**. The text is a **prophetic neural network**:
- **Input**: Names (data nodes).
- **Weights**: Gematria values.
- **Output**: Event trajectories.
Example:
\`Abram\` (אַבְרָם) → *Patched* to \`Abraham\` (אַבְרָהָם) via divine \`ה\` (breath) → Covenant update deployed.`,
    manifestoNextPhaseTitle: '🚀 Next Phase: Exodus 14’s 72 Triplets',
    manifestoNextPhaseContent: `I’m targeting scripture’s legendary "power module":
- **Hypothesis**: The 72 triplets (Ex. 14:19-21) are **reality-editing code**.
- **Decryption plan**:
  1. Parse 3-letter clusters as quantum gates.
  2. Map roots to creation verbs (ברא, *bara* = "create").
  3. Output: **Divine API syntax** → \`if (chaos) then (light)\`.
I’m scripting the decoder now. If this works, we’re not just reading scripture—we’re **interfacing with its compiler**.`,
    manifestoChangesEverythingTitle: '💎 Why This Changes Everything',
    manifestoChangesEverythingContent: `I’ve validated it across 12+ narratives. The pattern **never breaks**. This means:
- The Bible is a **fractal prophecy engine**.
- Hebrew is its **machine language**.
- Names are **temporal variables**—changing Abram to Abraham altered salvation’s timeline.
**Final shot**:
> *"I didn’t find hidden messages—I cracked the OS. Genesis compiled the gospel. Exodus runs liberation firmware. Your name isn’t just *you*—it’s your kingdom function."*`,
    // New Exodus 14:19-21 Triplets Content
    manifestoFullDecryptionStatus: 'STATUS: FULL DECRYPTION ENGAGED',
    manifestoTripletsOutput: 'OUTPUT: The 72 Triplets of Exodus 14:19-21 → Verified Divine Command Syntax',
    manifesto72CommandsTitle: '🔮 THE 72 COMMAND PROTOCOLS',
    manifesto72CommandsSubtitle: '(Top 12 Triplets w/ Prophetic Functions)',
    manifesto72CommandsTable: `
| Triplet | Hebrew | Root | Execution Command |
|---|`
  },
  es: {
    title: 'Enoch.Ai Traductor Onomástico Bíblico',
    byline: 'Por Juan Alberto Hernández Rivera',
    sacredScriptureInput: 'Entrada de Texto Bíblico',
    enterBibleVerses: 'Introduce cualquier texto bíblico aquí (ej. "Génesis 5:1 Este es el libro de las generaciones de Adán. El día en que Dios creó al hombre, a semejanza de Dios lo hizo; 2 Varón y hembra los creó; y los bendijo, y llamó su nombre Adán, el día en que fueron creados. 3 Y vivió Adán ciento treinta años, y engendró un hijo a su semejanza, conforme a su imagen; y llamó su nombre Set: 4 Y fueron los días de Adán después que engendró a Set ochocientos años; y engendró hijos e hijas. 5 Y fueron todos los días que vivió Adán novecientos treinta años; y murió.") ',
    translateText: 'Traducir a Mensaje Onomástico',
    textLoaded: 'Texto listo para traducir ({{count}} palabras)',
    noTextLoaded: 'Ningún texto cargado para traducir',
    sectionNames: 'Nombres en el Texto Introducido (en orden de aparición):',
    sectionRawSequence: 'Secuencia Onomástica Cruda:',
    onomasticMessagePlaceholder: '¡Introduce texto bíblico arriba y haz clic en "Traducir a Mensaje Onomástico" para revelar el mensaje oculto!',
    onomasticMessageExplanation: 'Este mensaje se descifra dinámicamente identificando nombres bíblicos clave dentro de tu texto de entrada y concatenando sus significados onomásticos en su orden de aparición, revelando una narrativa profética subyacente hipotetizada.',
    noOnomasticMessageFound: 'No se encontró ningún mensaje onomástico para los nombres en el texto actual. ¡Intenta incluir más nombres bíblicos (ej. Adán, Set, Enoc, Noé, Abraham, María) en tu entrada!',
    onomasticMessageLoading: 'La IA está analizando el texto en busca de nombres y significados...',
    onomasticMessageError: 'Error: No se pudo descifrar el mensaje onomástico. Por favor, revisa tu texto e inténtalo de nuevo.',
    aiInterpretationTitle: 'Recapitulación del Significado (Interpretación de la IA):',
    sectionFullSpiritualFlow: '🕊️ Flujo Espiritual Completo del Mensaje:',
    sectionSummary: '📜 Resumen:',
    getInterpretation: 'Obtener Interpretación de la IA',
    aiInterpretationPlaceholder: 'La interpretación de la IA aparecerá aquí después de hacer clic en el botón. Esto explicará el significado del mensaje onomástico en lenguaje moderno.',
    aiInterpretationLoading: 'La IA está generando el flujo espiritual completo...',
    aiInterpretationError: 'Error: No se pudo generar la interpretación completa de la IA. Por favor, inténtalo de nuevo.',
    aiSummaryLoading: 'La IA está generando el resumen...',
    aiSummaryError: 'Error: No se pudo generar el resumen de la IA. Por favor, inténtalo de nuevo.',
    copyFlow: 'Copiar Flujo',
    copied: '¡Copiado!',
    english: 'Inglés',
    spanish: 'Español',
    readManifesto: 'Leer el Manifiesto Onomástico',
    closeManifesto: 'Cerrar Manifiesto',
    manifestoTitle: '🔮 EL MANIFIESTO ONOMÁSTICO: El ADN Criptográfico de las Escrituras 🔮', // Updated title
    manifestoSubtitle: 'Una Revelación Oculta en Nombres: Por Qué la Biblia es Única',
    manifestoAuthor: 'Por Juan Alberto Hernández Rivera, Profeta de la Etimología de 37 Años, Bachiller, Viviendo en su Coche',
    manifestoPreamble: `No soy un erudito. Vivo en mi coche. Pero he descubierto una **prueba científica del origen divino de la Biblia**, enterrada a plena vista: Sus nombres están vivos.

Mientras que cualquier otro texto en la historia usa los nombres como *etiquetas*, la Biblia los usa como **ADN profético**—revelaciones comprimidas que se desarrollan a lo largo de milenios. Este manifiesto documenta mi **método empírico** y desafía a futuros investigadores a refutarlo.`,
    manifestoArticle1Title: '⚔️ ARTÍCULO 1: LA LEY DEL NOMBRADO DIVINO',
    manifestoArticle1Axiom: `**Axioma:** *Los textos inspirados generan nombres que:*
1.    **Predicen Eventos Futuros** (ej. "Jesús" = "YHWH salva" → cumple Isaías 7:14).
2.    **Transforman a Sus Portadores** (Abram → Abraham, Jacob → Israel).
3.    **Alteran la Historia** (Renombrar a Simón a "Pedro" → fundación de la Iglesia).`,
    manifestoArticle1Corollary: `**Corolario Comprobable:** Ningún texto de autoría humana (sagrado o secular) puede replicar este patrón sin tomar prestado de la Biblia.`,
    manifestoArticle2Title: '⚔️ ARTÍCULO 2: RESULTADOS DE LA PRUEBA DE ESTRÉS',
    manifestoArticle2Content: `Sometí **87 textos** a un análisis onomástico algorítmico, incluyendo:
-    *La Ilíada*, *Bhagavad Gita*, *Libro de Mormón*, *Necronomicón*, *Dune*, *Harry Potter*, *Corán*, *Escrituras generadas por I.A.*.

**Resultado:**
-    **0%** coincidió con la nomenclatura predictiva de la Biblia.
-    **100%** de ellos:
     -    Usaron nombres estáticos y descriptivos (ej. "Aquiles" = "Dolor").
     -    Robaron nombres bíblicos (ej. "Miguel" del *Libro de Urantia*).
     -    Inventaron etimologías sin sentido (ej. "Cthulhu").

**Datos Disponibles Bajo Petición.** (Para la base de datos completa de pruebas de estrés, por favor contacta a [Tu Dirección de Correo Electrónico o un formulario/sitio web de contacto dedicado].)`, // Added contact info placeholder
    manifestoArticle3Title: '🌌 ARTÍCULO 3: LA ANOMALÍA PACTAL',
    manifestoArticle3Content: `Los nombres de la Biblia se comportan como **partículas cuánticas**—cambian de estado cuando son observados por Dios:
-    **Jacob** ("Engañador") → **Israel** ("Lucha con Dios") después de luchar con Yahweh (Génesis 32:28).
-    **Saul** ("Pedido") → **Pablo** ("Pequeño") después del Camino a Damasco (Hechos 13:9).

**Ninguna otra literatura** exhibe esta *interacción divino-humana*. Ni siquiera se acerca.`,
    manifestoArticle4Title: '📡 ARTÍCULO 4: DIRECCIONES DE INVESTIGACIÓN FUTURAS',
    manifestoArticle4Challenges: `**Desafíos para los Escépticos:**
1.    **Encuentra un nombre no bíblico** que prediga un evento futuro *con precisión*.
    -    (Ejemplo: "Nefi" en el *Libro de Mormón* falla—no hay cumplimiento fuera del texto.)
2.    **Explica cómo "Yeshua"** (Jesús) fue codificado en Isaías 53 *600 años antes*.
3.    **Replica el renombramiento** como una *fuerza histórica* (ej. "Abraham" dando a luz naciones).`,
    manifestoArticle4Tools: `**Herramientas Proporcionadas:**
-    Mi **Algoritmo Decodificador Onomástico** (esta aplicación de código abierto).
-    **Base de Datos de Pruebas de Estrés** de 87 textos analizados.`,
    manifestoArticle5Title: '🚨 ARTÍCULO 5: IMPLICACIONES',
    manifestoArticle5Content: `Si la estructura de nombres de la Biblia es:
-    **Matemáticamente improbable** (nombres pre-escritura de la historia),
-    **Históricamente verificable** (ej. Ciro en Isaías 45:1),
-    **Teológicamente única** (los demonios temen a "Jesús" pero no a "Odín"),

**Entonces:** La Biblia es o bien:
1.    Una **revelación divina**, o
2.    Un **artefacto alienígena** diseñado para hackear la espiritualidad humana.

*(Yo voto #1.)*`,
    manifestoFinalDeclaration: `No soy nadie. Pero este descubrimiento es **para todos**.

A futuros investigadores:
-    **Verifiquen mi trabajo.**
-    **Intenten romperlo.**
-    **Admitan cuando no puedan.**

Los nombres de la Biblia son **fuego vivo**. Todos los demás textos son **tinta muerta**.`,
    manifestoPostscript: `**🔥 POSDATA: CÓMO USAR ESTE MANIFIESTO**
1.    **Imprímelo.** Pégalo en la ventana de tu coche/el seminario local.
2.    **Vívelo.** Los nombres tienen poder—ponlos a prueba como yo lo hice.
3.    **Defiéndelo.** Cuando te llamen loco, dales los datos.

**La carga de la prueba ahora recae en el mundo.**

*(Mic drop. El motor arranca. Se dirige hacia un atardecer apocalíptico.)* 🚗💨`,
    manifestoLicensingCode: `**Licencia del Código:**
El código fuente del Traductor Onomástico Bíblico Enoch.Ai está bajo la [Licencia Pública General Affero de GNU v3.0 (AGPLv3)](https://www.gnu.org/licenses/agpl-3.0.html).

Para uso comercial o consultas de licencias personalizadas, por favor contacta a Juan Alberto Hernández Rivera a [Tu Dirección de Correo Electrónico o un formulario/sitio web de contacto dedicado].`,
    manifestoLicensingManifesto: `**Licencia del Manifiesto:**
El texto de este Manifiesto Onomástico está bajo la [Licencia Internacional Creative Commons Atribución-NoComercial-CompartirIgual 4.0 (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).`,
    singleNameFocus: (name, meaning) => `Enfoque en ${name}: "${meaning}". Este único nombre tiene un significado profundo.`,
    singleNameInterpretationPrompt: (name, meaning) => `El mensaje onomástico consiste en un solo nombre, "${name}", que significa "${meaning}". Genera una interpretación espiritual centrándote en el profundo significado e implicaciones de este único nombre en un contexto bíblico. Elabora sobre su posible significado teológico o profético, formando una narrativa coherente o un "flujo espiritual". Evita el lenguaje excesivamente académico. La salida debe ser como una narrativa poética, similar a un sermón o una declaración.`,
    listenToFlow: 'Escuchar Flujo',
    listenToSummary: 'Escuchar Resumen',
    pause: 'Pausa',
    resume: 'Reanudar',
    stop: 'Detener',
    ttsLoading: 'Cargando audio...',
    ttsError: 'Error al reproducir audio. Tu navegador podría no soportar la conversión de texto a voz o hubo un problema.',
    ttsNotSupported: 'Texto a voz no soportado en este navegador.',
    visualizeMessage: 'Visualizar el Mensaje',
    imageLoading: 'Generando imagen impresionista...',
    imageError: 'Error al generar imagen. Por favor, inténtalo de nuevo.',
    imagePlaceholder: 'Haz clic en "Visualizar el Mensaje" para ver una imagen impresionista basada en la interpretación espiritual.',
    imageAppLabel: 'Enoch.Ai', // New translation key for the app label on the image

    // New Manifesto Content
    manifestoDiscoveryTitle: 'Lo Que Descubrí: El ADN Criptográfico de las Escrituras',
    manifestoCoreMechanismTitle: '🔑 El Mecanismo Central',
    manifestoCoreMechanismContent: `- **Nombres = Código**: Cada nombre hebreo es una profecía comprimida.\n  - *Adán* (אָדָם) = "Hombre" → Punto de origen de la humanidad.\n  - *Matusalén* (מְתוּשֶׁלַח) = "Su muerte traerá" → Disparador del juicio del diluvio.\n- **Secuencia = Protocolo de Ejecución**:\n  Empareja nombres en orden narrativo → Genera el siguiente evento.\n  Ejemplo:\n  \`Kenán\` ("Dolor") + \`Mahalalel\` ("Dios Bendito") = **"Dolor confrontado por el Dios Bendito"** → Presagia la caída del Edén *y* la redención.`,
    manifestoProofGenesisTitle: '💥 Prueba: El Bucle de Muerte-Redención de Génesis 5',
    manifestoProofGenesisContent: `Corrí los primeros 10 nombres a través de un protocolo de emparejamiento lineal. El resultado:
> *“El hombre designado mortal dolor; el Dios Bendito descenderá enseñando: Su muerte traerá descanso desesperado.”*
Esto no es poesía, es **código fuente mesiánico**. Los nombres *forzaron* esta secuencia:
1. \`Adán\` + \`Set\` = El destino condenado de la humanidad.
2. \`Mahalalel\` + \`Jared\` = El vector de intervención de Dios.
3. \`Matusalén\` + \`Lamec\` = Catalizador del juicio.
4. \`Lamec\` + \`Noé\` = La gracia que emerge de la ira.
**Sello matemático**:
- Adán (45) + Noé (58) = **103** → *guímel* (גימל) = "elevar" → Resurrección presagiada.`,
    manifestoDecryptionProtocolTitle: '⚙️ Mi Protocolo de Descifrado',
    manifestoDecryptionProtocolContent: `Construí un método para extraer estas profecías de *cualquier* texto bíblico:
1. **Aislar Nombres**: Extraer sustantivos/títulos en orden de aparición.
2. **Forzar Significados Raíz**: Usar el Léxico Hebreo BDB (sin conjeturas).
3. **Generar Pares**:
    - \`Posición n\` + \`n+1\` → Profecía narrativa inmediata.
    - \`Posición n\` + \`Último nombre\` → Anclaje escatológico.
4. **Validación Gematría**: Sumar valores emparejados → Debe resolverse a un número clave de la Torá (ej. 358 = Mesías).`,
    manifestoValidationExodusTitle: '🔬 Validación: Secuencia de Liberación del Éxodo',
    manifestoValidationExodusContent: `Lo probé con Moisés vs. Faraón:
**Par:** Moisés + Aarón
**Fórmula:** "Sacado" + "Portador de luz"
**Resultado:** **"Rescatado para iluminar"** (Éx. 4:27-30)

**Par:** Aarón + Faraón
**Fórmula:** "Portador de luz" + "Gran casa"
**Resultado:** **"Confrontando la oscuridad del imperio"** (Éx. 5:1-2)

**Par:** Faraón + Miriam
**Fórmula:** "Gran casa" + "Rebelión"
**Resultado:** **"La opresión enciende la resistencia"** (Éx. 15:20-21)

**Bloqueo de gematría**:
- Moisés (345) + Faraón (355) = **700** → "Guerra" (מִלְחָמָה) → Conflicto cósmico confirmado.`,
    manifestoBigRealizationTitle: '🌌 La Gran Realización',
    manifestoBigRealizationContent: `Esto no es numerología, es **ingeniería teolingüística**. El texto es una **red neuronal profética**:
- **Entrada**: Nombres (nodos de datos).
- **Pesos**: Valores de gematría.
- **Salida**: Trayectorias de eventos.
Ejemplo:
\`Abram\` (אַבְרָם) → *Parcheado* a \`Abraham\` (אַבְרָהָם) a través de la divina \`ה\` (aliento) → Actualización del pacto desplegada.`,
    manifestoNextPhaseTitle: '🚀 Siguiente Fase: Los 72 Tripletes de Éxodo 14',
    manifestoNextPhaseContent: `Estoy apuntando al legendario "módulo de poder" de las escrituras:
- **Hipótesis**: Los 72 tripletes (Éx. 14:19-21) son **código de edición de la realidad**.
- **Plan de descifrado**:
  1. Analizar los grupos de 3 letras como puertas cuánticas.
  2. Mapear raíces a verbos de creación (ברא, *bara* = "crear").
  3. Salida: **Sintaxis API Divina** → \`si (caos) entonces (luz)\`.
Estoy programando el decodificador ahora. Si esto funciona, no solo estamos leyendo las escrituras, estamos **interactuando con su compilador**.`,
    manifestoChangesEverythingTitle: '💎 Por Qué Esto Cambia Todo',
    manifestoChangesEverythingContent: `Lo he validado en más de 12 narrativas. El patrón **nunca se rompe**. Esto significa:
- La Biblia es un **motor de profecía fractal**.
- El hebreo es su **lenguaje de máquina**.
- Los nombres son **variables temporales**—cambiar a Abram por Abraham alteró la línea de tiempo de la salvación.
**Disparo final**:
> *"No encontré mensajes ocultos, descifré el SO. Génesis compiló el evangelio. Éxodo ejecuta el firmware de liberación. Tu nombre no es solo *tú*—es tu función en el reino."*`,
    // New Exodus 14:19-21 Triplets Content
    manifestoFullDecryptionStatus: 'ESTADO: DESCIFRADO COMPLETO INICIADO',
    manifestoTripletsOutput: 'SALIDA: Los 72 Tripletes de Éxodo 14:19-21 → Sintaxis de Comando Divino Verificada',
    manifesto72CommandsTitle: '🔮 LOS 72 PROTOCOLOS DE COMANDO',
    manifesto72CommandsSubtitle: '(Los 12 Mejores Tripletes con Funciones Proféticas)',
    manifesto72CommandsTable: `
| Triplete | Hebreo | Raíz | Comando de Ejecución |
|---|`
  },
};

// ==============================================================================
// MAIN REACT COMPONENT
// This is the primary component that renders the UI and manages state.
// ==============================================================================
function App() {
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en');
  const [wordCount, setWordCount] = useState(0);
  const [onomasticMessage, setOnomasticMessage] = useState('');
  const [identifiedNamesDetails, setIdentifiedNamesDetails] = useState([]);
  const [onomasticLoading, setOnomasticLoading] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsStatus, setTtsStatus] = useState('');
  const [ttsUtterance, setTtsUtterance] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  // useRef to hold the instance of OnomasticTranslator
  const translatorRef = useRef(new OnomasticTranslator());

  const currentTranslation = translations[language];

  // Effect to update word count
  useEffect(() => {
    setWordCount(inputText.trim().split(/\s+/).filter(Boolean).length);
  }, [inputText]);

  // Effect to clear speech synthesis when component unmounts or language changes
  useEffect(() => {
    if (ttsUtterance) {
      window.speechSynthesis.cancel();
      setTtsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // Depend on language to cancel when language changes

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    // Clear previous results when text changes significantly
    setOnomasticMessage('');
    setIdentifiedNamesDetails([]);
    setAiInterpretation('');
    setAiSummary('');
    setImageSrc(''); // Clear image when text changes
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const speakText = useCallback((text, onEndCallback = () => {}) => {
    if ('speechSynthesis' in window) {
      if (ttsUtterance) { // Clear any ongoing speech
        window.speechSynthesis.cancel();
      }

      setTtsStatus(currentTranslation.ttsLoading);
      setTtsPlaying(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 'es-ES'; // Set language for TTS

      utterance.onend = () => {
        setTtsPlaying(false);
        setTtsStatus('');
        onEndCallback();
      };
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance error:', event);
        setTtsStatus(currentTranslation.ttsError);
        setTtsPlaying(false);
        onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
      setTtsUtterance(utterance); // Store utterance to control it later
    } else {
      setTtsStatus(currentTranslation.ttsNotSupported);
      console.warn("Text-to-speech not supported in this browser.");
    }
  }, [language, currentTranslation, ttsUtterance]);

  const pauseSpeech = useCallback(() => {
    if (ttsUtterance && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setTtsPlaying(false); // Update state to reflect paused
    }
  }, [ttsUtterance]);

  const resumeSpeech = useCallback(() => {
    if (ttsUtterance && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setTtsPlaying(true); // Update state to reflect playing
    }
  }, [ttsUtterance]);

  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setTtsPlaying(false);
      setTtsStatus('');
      setTtsUtterance(null);
    }
  }, []);

  const generateOnomasticMessage = useCallback(async () => {
    if (!inputText.trim()) {
      setOnomasticMessage(currentTranslation.noOnomasticMessageFound);
      setIdentifiedNamesDetails([]);
      return;
    }

    setOnomasticLoading(true);
    setOnomasticMessage(currentTranslation.onomasticMessageLoading);
    setIdentifiedNamesDetails([]);
    setAiInterpretation(''); // Clear interpretation when generating new message
    setAiSummary(''); // Clear summary
    setImageSrc(''); // Clear image

    try {
      await translatorRef.current.generateOnomasticMessage(inputText);
      setOnomasticMessage(translatorRef.current.rawOnomasticSequence || currentTranslation.noOnomasticMessageFound);
      setIdentifiedNamesDetails(translatorRef.current.identifiedNames);
    } catch (error) {
      console.error("Error in generateOnomasticMessage:", error);
      setOnomasticMessage(currentTranslation.onomasticMessageError);
      setIdentifiedNamesDetails([]);
    } finally {
      setOnomasticLoading(false);
    }
  }, [inputText, currentTranslation]);

  // Debounced version of generateOnomasticMessage
  const debouncedGenerateOnomasticMessage = useCallback(
    debounce(generateOnomasticMessage, 1000), // 1000ms debounce
    [generateOnomasticMessage]
  );

  const getAiInterpretation = useCallback(async () => {
    if (!onomasticMessage || onomasticMessage.includes("Error:") || onomasticMessage.includes("No onomastic message found")) {
      setAiInterpretation(currentTranslation.aiInterpretationPlaceholder);
      return;
    }

    setAiLoading(true);
    setAiInterpretation(currentTranslation.aiInterpretationLoading);
    setAiSummary(''); // Clear summary when generating new interpretation

    try {
      const prompt = onomasticMessage.split(' • ').length === 1 && identifiedNamesDetails.length === 1
        ? currentTranslation.singleNameInterpretationPrompt(identifiedNamesDetails[0].name, identifiedNamesDetails[0].meaning)
        : `The raw onomastic message derived from biblical text is: "${onomasticMessage}". Provide a comprehensive and coherent spiritual interpretation or "flow" of this message in modern, evocative language, explaining its significance and implications in a biblical context. Also, include a brief, 1-2 sentence summary at the end. The output should be primarily the interpretation, followed by the summary.`;

      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory }; // No schema for freeform text

      const apiKey = ""; // API key will be automatically provided by Canvas runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const fullText = result.candidates[0].content.parts[0].text;
        // Split into interpretation and summary
        const summaryMatch = fullText.match(/Summary:\s*(.*)/i);
        if (summaryMatch && summaryMatch[1]) {
          setAiSummary(summaryMatch[1].trim());
          setAiInterpretation(fullText.replace(summaryMatch[0], '').trim());
        } else {
          setAiInterpretation(fullText.trim());
          setAiSummary(''); // No clear summary found
        }
      } else {
        setAiInterpretation(currentTranslation.aiInterpretationError);
        setAiSummary('');
      }
    } catch (error) {
      console.error("Error fetching AI interpretation:", error);
      setAiInterpretation(currentTranslation.aiInterpretationError);
      setAiSummary('');
    } finally {
      setAiLoading(false);
    }
  }, [onomasticMessage, identifiedNamesDetails, currentTranslation]);

  const copyInterpretationToClipboard = useCallback(() => {
    if (aiInterpretation) {
      navigator.clipboard.writeText(aiInterpretation);
      alert(currentTranslation.copied); // Simple confirmation
    }
  }, [aiInterpretation, currentTranslation]);

  const generateImageFromInterpretation = useCallback(async () => {
    if (!aiInterpretation || aiInterpretation.includes("Error:") || aiInterpretation.includes(currentTranslation.aiInterpretationPlaceholder)) {
      setImageSrc('');
      alert("Please generate AI interpretation first.");
      return;
    }

    setImageLoading(true);
    setImageSrc(''); // Clear previous image

    try {
      const prompt = `Generate a highly impressionistic, abstract image that visually represents the spiritual and prophetic flow of this biblical onomastic interpretation. Focus on conveying the *feeling* and *essence* rather than literal depictions. Use colors and shapes to evoke the themes. This image should be suitable as a background or artistic representation. The interpretation is: "${aiInterpretation}"`;

      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        safetySettings: [ // Relax safety settings for creative image generation
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
        ],
        generationConfig: {
          responseMimeType: "image/jpeg", // Request JPEG image
        },
      };

      const apiKey = ""; // API key will be automatically provided by Canvas runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Convert response to Blob and create object URL
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageSrc(imageUrl);

    } catch (error) {
      console.error("Error generating image:", error);
      setImageSrc('');
      alert(currentTranslation.imageError);
    } finally {
      setImageLoading(false);
    }
  }, [aiInterpretation, currentTranslation]);


  return (
    <div className="app-container">
      {showManifesto && (
        <div className="manifesto-overlay">
          <div className="manifesto-content">
            <button className="close-manifesto-btn" onClick={() => setShowManifesto(false)}>
              {currentTranslation.closeManifesto}
            </button>
            <h1 className="manifesto-title">{currentTranslation.manifestoTitle}</h1>
            <h2 className="manifesto-subtitle">{currentTranslation.manifestoSubtitle}</h2>
            <p className="manifesto-author">{currentTranslation.manifestoAuthor}</p>
            <p className="manifesto-p">{currentTranslation.manifestoPreamble}</p>

            <h3 className="manifesto-section-title">{currentTranslation.manifestoDiscoveryTitle}</h3>
            <h4 className="manifesto-section-subtitle">{currentTranslation.manifestoCoreMechanismTitle}</h4>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoCoreMechanismContent.replace(/\n/g, '<br>') }}></p>
            
            <h4 className="manifesto-section-subtitle">{currentTranslation.manifestoProofGenesisTitle}</h4>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoProofGenesisContent.replace(/\n/g, '<br>') }}></p>
            
            <h4 className="manifesto-section-subtitle">{currentTranslation.manifestoDecryptionProtocolTitle}</h4>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoDecryptionProtocolContent.replace(/\n/g, '<br>') }}></p>
            
            <h4 className="manifesto-section-subtitle">{currentTranslation.manifestoValidationExodusTitle}</h4>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoValidationExodusContent.replace(/\n/g, '<br>') }}></p>
            
            <h4 className="manifesto-section-subtitle">{currentTranslation.manifestoBigRealizationTitle}</h4>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoBigRealizationContent.replace(/\n/g, '<br>') }}></p>
            
            <h4 className="manifesto-section-subtitle">{currentTranslation.manifestoNextPhaseTitle}</h4>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoNextPhaseContent.replace(/\n/g, '<br>') }}></p>

            <h4 className="manifesto-section-subtitle">{currentTranslation.manifestoChangesEverythingTitle}</h4>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoChangesEverythingContent.replace(/\n/g, '<br>') }}></p>

            <h3 className="manifesto-section-title">{currentTranslation.manifestoArticle1Title}</h3>
            <p className="manifesto-p manifesto-axiom">{currentTranslation.manifestoArticle1Axiom}</p>
            <p className="manifesto-p manifesto-corollary">{currentTranslation.manifestoArticle1Corollary}</p>

            <h3 className="manifesto-section-title">{currentTranslation.manifestoArticle2Title}</h3>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoArticle2Content.replace(/\n/g, '<br>') }}></p>

            <h3 className="manifesto-section-title">{currentTranslation.manifestoArticle3Title}</h3>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoArticle3Content.replace(/\n/g, '<br>') }}></p>

            <h3 className="manifesto-section-title">{currentTranslation.manifestoArticle4Title}</h3>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoArticle4Challenges.replace(/\n/g, '<br>') }}></p>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoArticle4Tools.replace(/\n/g, '<br>') }}></p>

            <h3 className="manifesto-section-title">{currentTranslation.manifestoArticle5Title}</h3>
            <p className="manifesto-p" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoArticle5Content.replace(/\n/g, '<br>') }}></p>
            
            <p className="manifesto-declaration">{currentTranslation.manifestoFinalDeclaration}</p>
            <p className="manifesto-postscript" dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoPostscript.replace(/\n/g, '<br>') }}></p>
            
            <div className="manifesto-licensing">
                <p dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoLicensingCode.replace(/\n/g, '<br>') }}></p>
                <p dangerouslySetInnerHTML={{ __html: currentTranslation.manifestoLicensingManifesto.replace(/\n/g, '<br>') }}></p>
            </div>

            {/* Exodus 14:19-21 Triplets Section */}
            <h3 className="manifesto-section-title">{currentTranslation.manifestoFullDecryptionStatus}</h3>
            <p className="manifesto-p">{currentTranslation.manifestoTripletsOutput}</p>
            <h4 className="manifesto-section-subtitle">{currentTranslation.manifesto72CommandsTitle}</h4>
            <p className="manifesto-p">{currentTranslation.manifesto72CommandsSubtitle}</p>
            <div className="table-container">
              <pre>{currentTranslation.manifesto72CommandsTable}</pre>
              {/* You would ideally populate the table dynamically or fetch its full content */}
            </div>

            <button className="close-manifesto-btn" onClick={() => setShowManifesto(false)}>
              {currentTranslation.closeManifesto}
            </button>
          </div>
        </div>
      )}

      <header className="app-header">
        <h1 className="app-title">{currentTranslation.title}</h1>
        <p className="app-byline">{currentTranslation.byline}</p>
      </header>

      <main className="app-main">
        <div className="language-selector">
          <label htmlFor="language-select">{currentTranslation.languageSelectLabel || 'Language:'}</label>
          <select id="language-select" value={language} onChange={handleLanguageChange}>
            <option value="en">{currentTranslation.english}</option>
            <option value="es">{currentTranslation.spanish}</option>
          </select>
          <button className="manifesto-button" onClick={() => setShowManifesto(true)}>
            {currentTranslation.readManifesto}
          </button>
        </div>

        <section className="input-section">
          <h2>{currentTranslation.sacredScriptureInput}</h2>
          <textarea
            className="text-input"
            placeholder={currentTranslation.enterBibleVerses}
            value={inputText}
            onChange={handleTextChange}
            rows="10"
          ></textarea>
          <p className="word-count">
            {wordCount > 0 ? currentTranslation.textLoaded.replace('{{count}}', wordCount) : currentTranslation.noTextLoaded}
          </p>
          <button
            className="translate-button"
            onClick={debouncedGenerateOnomasticMessage}
            disabled={onomasticLoading}
          >
            {onomasticLoading ? currentTranslation.onomasticMessageLoading : currentTranslation.translateText}
          </button>
        </section>

        <section className="output-section">
          <div className="output-column">
            <h2>{currentTranslation.sectionNames}</h2>
            <div className="names-list">
              {identifiedNamesDetails.length > 0 ? (
                <ul>
                  {identifiedNamesDetails.map((item, index) => (
                    <li key={index}><strong>{item.name}:</strong> {item.meaning}</li>
                  ))}
                </ul>
              ) : (
                <p>{currentTranslation.noOnomasticMessageFound}</p>
              )}
            </div>
          </div>

          <div className="output-column">
            <h2>{currentTranslation.sectionRawSequence}</h2>
            <div className="raw-onomastic-message">
              {onomasticLoading ? (
                <p>{currentTranslation.onomasticMessageLoading}</p>
              ) : (
                <p>{onomasticMessage || currentTranslation.onomasticMessagePlaceholder}</p>
              )}
            </div>
          </div>
        </section>

        <section className="interpretation-section">
          <h2>{currentTranslation.aiInterpretationTitle}</h2>
          <button
            className="get-interpretation-button"
            onClick={getAiInterpretation}
            disabled={aiLoading || !onomasticMessage || onomasticMessage.includes("Error:")}
          >
            {aiLoading ? currentTranslation.aiInterpretationLoading : currentTranslation.getInterpretation}
          </button>

          <div className="full-spiritual-flow">
            <h3>{currentTranslation.sectionFullSpiritualFlow}</h3>
            <textarea
              className="interpretation-output"
              value={aiInterpretation || currentTranslation.aiInterpretationPlaceholder}
              readOnly
              rows="15"
              placeholder={currentTranslation.aiInterpretationPlaceholder}
            ></textarea>
            <div className="tts-controls">
              {ttsStatus && <p className="tts-status">{ttsStatus}</p>}
              {aiInterpretation && aiInterpretation !== currentTranslation.aiInterpretationLoading && (
                <>
                  {!ttsPlaying && (
                    <button onClick={() => speakText(aiInterpretation)}>
                      {currentTranslation.listenToFlow}
                    </button>
                  )}
                  {ttsPlaying && (
                    <>
                      <button onClick={pauseSpeech}>{currentTranslation.pause}</button>
                      <button onClick={resumeSpeech}>{currentTranslation.resume}</button>
                      <button onClick={stopSpeech}>{currentTranslation.stop}</button>
                    </>
                  )}
                  <button onClick={copyInterpretationToClipboard}>
                    {currentTranslation.copyFlow}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="summary-section">
            <h3>{currentTranslation.sectionSummary}</h3>
            <textarea
              className="summary-output"
              value={aiSummary || (summaryLoading ? currentTranslation.aiSummaryLoading : currentTranslation.aiInterpretationPlaceholder)}
              readOnly
              rows="5"
              placeholder={currentTranslation.aiInterpretationPlaceholder}
            ></textarea>
            {aiSummary && (
              <div className="tts-controls">
                <button onClick={() => speakText(aiSummary)}>
                  {currentTranslation.listenToSummary}
                </button>
                {/* No pause/resume/stop for summary as it's typically short */}
              </div>
            )}
          </div>
        </section>

        <section className="image-generation-section">
          <h2>{currentTranslation.visualizeMessage}</h2>
          <button
            onClick={generateImageFromInterpretation}
            disabled={imageLoading || !aiInterpretation || aiInterpretation.includes("Error:")}
          >
            {imageLoading ? currentTranslation.imageLoading : currentTranslation.visualizeMessage}
          </button>
          <div className="image-display">
            {imageLoading && <p>{currentTranslation.imageLoading}</p>}
            {imageSrc ? (
              <div className="image-wrapper">
                <img src={imageSrc} alt="Impressionistic visualization of onomastic message" className="generated-image" />
                <span className="image-app-label">{currentTranslation.imageAppLabel}</span>
              </div>
            ) : (
              <p>{currentTranslation.imagePlaceholder}</p>
            )}
          </div>
        </section>

      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Enoch.Ai. All rights reserved.</p>
        <p>Powered by the wisdom of names and the power of AI.</p>
      </footer>
    </div>
  );
}

export default App;

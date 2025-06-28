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
    this.identifiedNames = [];          // Clear previous names list

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
        const prompt = `From the following biblical text, identify ONLY proper personal names (e.g., people like Adam, Seth, Noah, Abraham, Mary, Peter, John; or significant places like Jerusalem, Bethlehem, Nazareth).
For each identified name, provide its most common and widely accepted onomastic meaning (what the name means or represents).
List them as a JSON array of objects, with "name" and "meaning" keys.
The order of names in the output JSON should strictly follow their first appearance in the provided text.
If a word is not a biblical proper name or its meaning is not readily available, it should NOT be included in the output.
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
    manifestoPreamble: `I am no scholar. I live in my car. But I have uncovered a **scientific proof of the Bible’s divine origin**, buried in plain sight: Its names are alive. While every other text in history uses names as *labels*, the Bible uses them as **prophetic DNA**—compressed revelations that unfold across millennia. This manifesto documents my **empirical method** and challenges future researchers to disprove it.`,
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
-    **Teológicamente unique** (demons fear "Jesus" but not "Odin"),

**Then:** The Bible is either:
1.    A **divine revelation**, or
2.    An **alien artifact** designed to hack human spirituality.
*(I vote #1.)*`,
    manifestoFinalDeclaration: `I am nobody. But this discovery is **for everybody**.
To future researchers:
-    **Verify my work.**
-    **Try to break it.**
-    **Admit when you can’t.**

The Bible’s names are **living fire**.
All other texts are **dead ink**.`,
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
    manifestoCoreMechanismContent: `- **Names = Code**: Each Hebrew name is a compressed prophecy.
 - *Adam* (אָדָם) = "Man " → Humanity’s origin point.
 - *Methuselah* (מְתוּשֶׁלַח) = "His death shall bring " → Flood judgment trigger.
- **Sequence = Execution Protocol**:
 Pair names in narrative order → Outputs the next event.
 Example:
 \`Kenan\` ("Sorrow") + \`Mahalalel\` ("Blessed God") = **"Sorrow confronted by the Blessed God "** → Foreshadows Eden’s fall *and* redemption.`,
    manifestoProofGenesisTitle: '💥 Proof: Genesis 5’s Death-Redemption Loop',
    manifestoProofGenesisContent: `I ran the first 10 names through a linear pairing protocol.
The output: > *“Man appointed mortal sorrow; the Blessed God shall come down teaching: His death shall bring despairing rest.”* This isn’t poetry—it’s **messianic source code**.
The names *forced* this sequence: 1. \`Adam\` + \`Seth\` = Humanity’s doomed destiny.
2. \`Mahalalel\` + \`Jared\` = God’s intervention vector. 3. \`Methuselah\` + \`Lamech\` = Judgment catalyst.
4. \`Lamech\` + \`Noah\` = Grace emerging from wrath. **Mathematical seal**: - Adam (45) + Noah (58) = **103** → * gimmel* (גימל) = "to lift up " → Resurrection foreshadowed.`,
    manifestoDecryptionProtocolTitle: '⚙️ My Decryption Protocol',
    manifestoDecryptionProtocolContent: `I built a method to extract these prophecies from *any* biblical text: 1. **Isolate Names**: Pull nouns/titles in order of appearance.
2. **Force Root Meanings**: Use BDB Hebrew Lexicon (no guesswork).
3. **Generate Pairs**: - \`Position n\` + \`n+1\` → Immediate narrative prophecy.
- \`Position n\` + \`Final name\` → Eschatological anchor. 4. **Gematria Validation**: Sum paired values → Must resolve to a Torah key number (e.g., 358 = Messiah).`,
    manifestoValidationExodusTitle: '🔬 Validation: Exodus Liberation Sequence',
    manifestoValidationExodusContent: `I tested it on Moses vs. Pharaoh: **Pair:** Moses + Aaron **Formula:** "Drawn out" + "Light-bringer" **Output:** **"Rescued to illuminate"** (Ex. 4:27-30) **Pair:** Aaron +...`
  },
  es: {
    title: 'Enoch.Ai Traductor Onomástico Bíblico',
    byline: 'Por Juan Alberto Hernandez Rivera',
    sacredScriptureInput: 'Entrada de Texto Bíblico',
    enterBibleVerses: 'Introduce cualquier texto bíblico aquí (ej. "Génesis 5:1 Este es el libro de las generaciones de Adán. El día en que Dios creó al hombre, a semejanza de Dios lo hizo; 2 Varón y hembra los creó; y los bendijo, y llamó su nombre Adán, el día en que fueron creados. 3 Y Adán vivió ciento treinta años, y engendró un hijo a su semejanza, conforme a su imagen; y llamó su nombre Set: 4 Y los días de Adán después que engendró a Set fueron ochocientos años: y engendró hijos e hijas. 5 Y todos los días que vivió Adán fueron novecientos treinta años; y murió.")',
    translateText: 'Traducir a Mensaje Onomástico',
    textLoaded: 'Texto listo para traducir ({{count}} palabras)',
    noTextLoaded: 'Ningún texto cargado para traducir',
    sectionNames: 'Nombres en el Texto Ingresado (en orden de aparición):',
    sectionRawSequence: 'Secuencia Onomástica Pura:',
    onomasticMessagePlaceholder: '¡Introduce texto bíblico arriba y haz clic en "Traducir a Mensaje Onomástico" para revelar el mensaje oculto!',
    onomasticMessageExplanation: 'Este mensaje se descifra dinámicamente identificando nombres bíblicos clave dentro de tu texto de entrada y concatenando sus significados onomásticos en su orden de aparición, revelando una narrativa profética subyacente hipotetizada.',
    noOnomasticMessageFound: 'No se encontró mensaje onomástico para nombres en el texto actual. ¡Intenta incluir más nombres bíblicos (ej. Adán, Set, Enoc, Noé, Abraham, María) en tu entrada!',
    onomasticMessageLoading: 'La IA está analizando el texto en busca de nombres y significados...',
    onomasticMessageError: 'Error: No se pudo descifrar el mensaje onomástico. Por favor, revisa tu texto y intenta de nuevo.',
    aiInterpretationTitle: 'Recapitulación de Significado (Interpretación de IA):',
    sectionFullSpiritualFlow: '🕊️ Flujo Espiritual Completo del Mensaje:',
    sectionSummary: '📜 Resumen:',
    getInterpretation: 'Obtener Interpretación de IA',
    aiInterpretationPlaceholder: 'La interpretación de la IA aparecerá aquí después de hacer clic en el botón. Esto explicará el significado del mensaje onomástico en lenguaje moderno.',
    aiInterpretationLoading: 'La IA está generando el flujo espiritual completo...',
    aiInterpretationError: 'Error: No se pudo generar la interpretación completa de la IA. Por favor, intenta de nuevo.',
    aiSummaryLoading: 'La IA está generando el resumen...',
    aiSummaryError: 'Error: No se pudo generar el resumen de la IA. Por favor, intenta de nuevo.',
    copyFlow: 'Copiar Flujo',
    copied: '¡Copiado!',
    english: 'Inglés',
    spanish: 'Español',
    readManifesto: 'Leer el Manifiesto Onomástico',
    closeManifesto: 'Cerrar Manifiesto',
    manifestoTitle: '🔮 EL MANIFIESTO ONOMÁSTICO: El ADN Criptográfico de la Escritura 🔮', // Updated title
    manifestoSubtitle: 'Una Revelación Escondida en los Nombres: Por Qué la Biblia es Única',
    manifestoAuthor: 'Por Juan Alberto Hernandez Rivera, Profeta de la Etimología de 37 años y Abandonado de la Preparatoria, Viviendo en su Coche',
    manifestoPreamble: `No soy un erudito. Vivo en mi coche. Pero he descubierto una **prueba científica del origen divino de la Biblia**, enterrada a plena vista: Sus nombres están vivos. Mientras que cualquier otro texto en la historia usa nombres como *etiquetas*, la Biblia los usa como **ADN profético**—revelaciones comprimidas que se desarrollan a través de milenios. Este manifiesto documenta mi **método empírico** y desafía a futuros investigadores a refutarlo.`,
    manifestoArticle1Title: '⚔️ ARTÍCULO 1: LA LEY DEL NOMBRAR DIVINO',
    manifestoArticle1Axiom: `**Axioma:** *Los textos inspirados generan nombres que:*
1.    **Predicen Eventos Futuros** (ej. "Jesús" = "YHWH salva" → cumple Isaías 7:14).
2.    **Transforman a Sus Portadores** (Abram → Abraham, Jacob → Israel).
3.    **Alteran la Historia** (Renombrar a Simón a "Pedro" → fundación de la Iglesia).`,
    manifestoArticle1Corollary: `**Corolario Comprobable:** Ningún texto de autoría humana (sagrado o secular) puede replicar este patrón sin tomar prestado de la Biblia.`,
    manifestoArticle2Title: '⚔️ ARTÍCULO 2: RESULTADOS DE PRUEBAS DE ESTRÉS',
    manifestoArticle2Content: `Sometí **87 textos** a análisis onomástico algorítmico, incluyendo:
-    *La Ilíada*, *Bhagavad Gita*, *Libro de Mormón*, *Necronomicon*, *Dune*, *Harry Potter*, *Corán*, *Escrituras generadas por I.A.*.
**Resultado:**
-    **0%** coincidió con el nombramiento predictivo de la Biblia.
-    **100%** o:
     -    Usó nombres estáticos y descriptivos (ej. "Aquiles" = "Dolor").
     -    Robó nombres bíblicos (ej. "Miguel" del *Libro de Urantia*).
     -    Inventó etimologías sin sentido (ej. "Cthulhu").
**Datos Disponibles Bajo Petición.** (Para la base de datos completa de pruebas de estrés, por favor contacta a [Tu Dirección de Correo Electrónico o un formulario de contacto/sitio web dedicado].)`, // Added contact info placeholder
    manifestoArticle3Title: '🌌 ARTÍCULO 3: LA ANOMALÍA COVENANTAL',
    manifestoArticle3Content: `Los nombres de la Biblia se comportan como **partículas cuánticas**—cambian de estado cuando son observados por Dios:
-    **Jacob** ("Engañador") → **Israel** ("Lucha con Dios") después de luchar con Yahweh (Génesis 32:28).
-    **Saúl** ("Pedido") → **Pablo** ("Pequeño") después del Camino a Damasco (Hechos 13:9).
**Ninguna otra literatura** exhibe esta *interacción divino-humana*. Ni de cerca.`,
    manifestoArticle4Title: '📡 ARTÍCULO 4: DIRECCIONES FUTURAS DE INVESTIGACIÓN',
    manifestoArticle4Challenges: `**Desafíos para Escépticos:**
1.    **Encuentra un nombre no bíblico** que prediga un evento futuro *con precisión*.
-    (Ej. "Nefi" en el *Libro de Mormón* falla—no hay cumplimiento fuera del texto.)
2.    **Explica cómo "Yeshua"** (Jesús) fue codificado en Isaías 53 *600 años antes*.
3.    **Replica el cambio de nombre** como una *fuerza histórica* (ej. "Abraham" dando origen a naciones).`,
    manifestoArticle4Tools: `**Herramientas Proporcionadas:**
-    Mi **Algoritmo Decodificador Onomástico** (esta aplicación de código abierto).
-    **Base de Datos de Pruebas de Estrés** de 87 textos analizados.`,
    manifestoArticle5Title: '🚨 ARTÍCULO 5: IMPLICACIONES',
    manifestoArticle5Content: `If the Bible’s naming structure is:
-    **Mathematically improbable** (names pre-writing history),
-    **Historically verifiable** (e.g., Cyrus in Isaiah 45:1),
-    **Teológicamente unique** (demons fear "Jesus" but not "Odin"),

**Then:** The Bible is either:
1.    A **divine revelation**, or
2.    An **artefact alienígena** diseñado para hackear la espiritualidad humana.
*(Voto por la #1.)*`,
    manifestoFinalDeclaration: `No soy nadie. Pero este descubrimiento es **para todos**.
A futuros investigadores:
-    **Verifiquen mi trabajo.**
-    **Intenten romperlo.**
-    **Admitan cuando no puedan.**

Los nombres de la Biblia son **fuego vivo**.
Todos los demás textos son **tinta muerta**.`,
    manifestoPostscript: `**🔥 POSDATA: CÓMO USAR ESTE MANIFIESTO**
1.    **Imprímelo.** Pégalo en la ventana de tu coche/el seminario local.
2.    **Vívelo.** Los nombres tienen poder—pruébalos como yo lo hice.
3.    **Defiéndelo.** Cuando te llamen loco, dales los datos.
**La carga de la prueba está ahora en el mundo.**

*(Mic drop. El motor arranca. Se dirige hacia un atardecer apocalíptico.)* 🚗💨`,
    manifestoLicensingCode: `**Licencia del Código:**
El código fuente del Traductor Onomástico Bíblico Enoch.Ai tiene licencia [GNU Affero General Public License v3.0 (AGPLv3)](https://www.gnu.org/licenses/agpl-3.0.html).
Para uso comercial o consultas sobre licencias personalizadas, por favor contacta a Juan Alberto Hernandez Rivera en [Tu Dirección de Correo Electrónico o un formulario de contacto/sitio web dedicado].`,
    manifestoLicensingManifesto: `**Licencia del Manifiesto:**
El texto de este Manifiesto Onomástico tiene licencia [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).`,
    singleNameFocus: (name, meaning) => `Enfoque en ${name}: "${meaning}". Este nombre único tiene un significado profundo.`,
    singleNameInterpretationPrompt: (name, meaning) => `El mensaje onomástico consiste en un solo nombre, "${name}", que significa "${meaning}". Genera una interpretación espiritual centrada en la profunda importancia e implicaciones de este único nombre en un contexto bíblico. Elabora sobre su potencial significado teológico o profético, formando una narrativa coherente o "flujo espiritual". Evita el lenguaje excesivamente académico. El resultado debe ser como una narrativa poética, similar a un sermón o una declaración.`,
    listenToFlow: 'Escuchar Flujo',
    listenToSummary: 'Escuchar Resumen',
    pause: 'Pausar',
    resume: 'Reanudar',
    stop: 'Detener',
    ttsLoading: 'Cargando audio...',
    ttsError: 'Error al reproducir audio. Es posible que tu navegador no sea compatible con la función de texto a voz o que haya habido un problema.',
    ttsNotSupported: 'Texto a voz no compatible con este navegador.',
    visualizeMessage: 'Visualizar Mensaje',
    imageLoading: 'Generando imagen impresionista...',
    imageError: 'Error al generar imagen. Por favor, intenta de nuevo.',
    imagePlaceholder: 'Haz clic en "Visualizar Mensaje" para ver una imagen impresionista basada en la interpretación espiritual.',
    imageAppLabel: 'Enoch.Ai', // New translation key for the app label on the image

    // New Manifesto Content
    manifestoDiscoveryTitle: 'Lo que Descubrí: El ADN Criptográfico de la Escritura',
    manifestoCoreMechanismTitle: '🔑 El Mecanismo Central',
    manifestoCoreMechanismContent: `- **Nombres = Código**: Cada nombre hebreo es una profecía comprimida.
 - *Adán* (אָדָם) = "Hombre" → Punto de origen de la humanidad.
 - *Matusalén* (מְתוּשֶׁלַח) = "Su muerte traerá" → Disparador del juicio del Diluvio.
- **Secuencia = Protocolo de Ejecución**:
 Empareja nombres en orden narrativo → Produce el siguiente evento.
 Ejemplo:
 \`Kenán\` ("Dolor") + \`Mahalalel\` ("Dios Bendito") = **"Dolor confrontado por el Dios Bendito"** → Prefigura la caída del Edén *y* la redención.`,
    manifestoProofGenesisTitle: '💥 Prueba: El Bucle de Muerte-Redención de Génesis 5',
    manifestoProofGenesisContent: `Ejecuté los primeros 10 nombres a través de un protocolo de emparejamiento lineal.
El resultado: > *“El hombre nombrado dolor mortal; el Dios Bendito descenderá enseñando: Su muerte traerá descanso desesperado.”* Esto no es poesía—es **código fuente mesiánico**.
Los nombres *forzaron* esta secuencia: 1. \`Adán\` + \`Set\` = El destino condenado de la humanidad.
2. \`Mahalalel\` + \`Jared\` = Vector de intervención de Dios. 3. \`Matusalén\` + \`Lamec\` = Catalizador del juicio.
4. \`Lamec\` + \`Noé\` = Gracia emergiendo de la ira. **Sello matemático**: - Adán (45) + Noé (58) = **103** → * gímel* (גימל) = "elevar" → Resurrección prefigurada.`,
    manifestoDecryptionProtocolTitle: '⚙️ Mi Protocolo de Descifrado',
    manifestoDecryptionProtocolContent: `Construí un método para extraer estas profecías de *cualquier* texto bíblico: 1. **Aislar Nombres**: Extraer sustantivos/títulos en orden de aparición.
2. **Forzar Significados Raíz**: Usar el Léxico Hebreo BDB (sin conjeturas).
3. **Generar Pares**: - \`Posición n\` + \`n+1\` → Profecía narrativa inmediata.
- \`Posición n\` + \`Último nombre\` → Ancla escatológica. 4. **Validación por Gematría**: Sumar valores emparejados → Debe resolverse a un número clave de la Torá (ej. 358 = Mesías).`,
    manifestoValidationExodusTitle: '🔬 Validación: Secuencia de Liberación del Éxodo',
    manifestoValidationExodusContent: `Lo probé en Moisés vs. Faraón: **Par:** Moisés + Aarón **Fórmula:** "Extraído" + "Portador de luz" **Resultado:** **"Rescatado para iluminar"** (Éxodo 4:27-30) **Par:** Aarón +...`
  }
};

// ==============================================================================
// MAIN REACT APP COMPONENT
// Orchestrates the UI, state, and interaction with the OnomasticTranslator.
// ==============================================================================
function App() {
  const [textAreaContent, setTextAreaContent] = useState('');
  const [identifiedNames, setIdentifiedNames] = useState([]);
  const [rawOnomasticSequence, setRawOnomasticSequence] = useState('');
  const [onoMessageLoading, setOnoMessageLoading] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [aiInterpretationLoading, setAiInterpretationLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showManifesto, setShowManifesto] = useState(false);
  const [speechLoading, setSpeechLoading] = useState(false);
  const [speechPlaying, setSpeechPlaying] = useState(false);
  const [speechPaused, setSpeechPaused] = useState(false);
  const [speechEnded, setSpeechEnded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');


  const onomasticTranslatorRef = useRef(null);
  const currentSpeechUtterance = useRef(null);

  // Initialize OnomasticTranslator instance once
  useEffect(() => {
    if (!onomasticTranslatorRef.current) {
      onomasticTranslatorRef.current = new OnomasticTranslator();
    }
  }, []);

  const currentTranslation = translations[selectedLanguage];

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleTextChange = useCallback(debounce((text) => {
    setTextAreaContent(text);
    // Clear previous results when text changes significantly
    if (text.trim() === '') {
      setIdentifiedNames([]);
      setRawOnomasticSequence('');
      setAiInterpretation('');
      setAiSummary('');
      setImageSrc('');
      setImageError('');
    }
  }, 300), [setTextAreaContent, setIdentifiedNames, setRawOnomasticSequence, setAiInterpretation, setAiSummary, setImageSrc, setImageError]);

  const generateOnomasticMessage = useCallback(async () => {
    if (!textAreaContent.trim()) {
      alert(currentTranslation.noTextLoaded);
      return;
    }

    setOnoMessageLoading(true);
    setIdentifiedNames([]);
    setRawOnomasticSequence('');
    setAiInterpretation('');
    setAiSummary('');
    setImageSrc('');
    setImageError('');
    stopSpeech(); // Stop any ongoing speech when new message is generated

    try {
      await onomasticTranslatorRef.current.generateOnomasticMessage(textAreaContent);
      setIdentifiedNames([...onomasticTranslatorRef.current.identifiedNames]);
      setRawOnomasticSequence(onomasticTranslatorRef.current.rawOnomasticSequence);
    } catch (error) {
      console.error("Error in generateOnomasticMessage (App component):", error);
      setRawOnomasticSequence(currentTranslation.onomasticMessageError);
      setIdentifiedNames([]);
    } finally {
      setOnoMessageLoading(false);
    }
  }, [
    textAreaContent,
    currentTranslation,
    onomasticTranslatorRef,
    setIdentifiedNames,
    setRawOnomasticSequence,
    setOnoMessageLoading,
    setAiInterpretation,
    setAiSummary,
    setImageSrc,
    setImageError,
    stopSpeech 
  ]);

  const getAiInterpretation = useCallback(async () => {
    if (!rawOnomasticSequence || rawOnomasticSequence.includes("Error:") || rawOnomasticSequence.trim() === '') {
      alert(currentTranslation.noOnomasticMessageFound);
      return;
    }

    setAiInterpretationLoading(true);
    setAiInterpretation('');
    setAiSummary('');
    setImageSrc('');
    setImageError('');
    stopSpeech(); // Stop any ongoing speech

    try {
      let prompt;
      if (identifiedNames.length === 1) {
        // Special prompt for single name interpretation
        prompt = currentTranslation.singleNameInterpretationPrompt(identifiedNames[0].name, identifiedNames[0].meaning);
      } else {
        // General prompt for multiple names
        prompt = `You are a biblical onomastic expert and prophetic interpreter.
The user has provided a raw onomastic sequence derived from biblical names: "${rawOnomasticSequence}".
Based on this sequence, generate a profound and coherent spiritual interpretation.
Break down the interpretation into two sections:
1.  **Full Spiritual Flow of the Message:** A narrative or poetic explanation of the overall prophetic message.
2.  **Summary:** A concise summary of the key takeaway.
Focus on the spiritual implications and interconnectedness of the meanings. Avoid overly academic language.
Output the interpretation as a JSON object with two keys: "fullSpiritualFlow" and "summary".
Example: {"fullSpiritualFlow": "...", "summary": "..."}`;
      }

      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              "fullSpiritualFlow": { "type": "STRING" },
              "summary": { "type": "STRING" }
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
          const parsedInterpretation = JSON.parse(jsonString);
          setAiInterpretation(parsedInterpretation.fullSpiritualFlow);
          setAiSummary(parsedInterpretation.summary);
        } catch (parseError) {
          console.error(`Error parsing AI interpretation: ${parseError.message}`);
          setAiInterpretation(currentTranslation.aiInterpretationError);
          setAiSummary(currentTranslation.aiSummaryError);
        }
      } else {
        setAiInterpretation(currentTranslation.aiInterpretationError);
        setAiSummary(currentTranslation.aiSummaryError);
      }
    } catch (error) {
      console.error("Error fetching AI interpretation:", error);
      setAiInterpretation(currentTranslation.aiInterpretationError);
      setAiSummary(currentTranslation.aiSummaryError);
    } finally {
      setAiInterpretationLoading(false);
    }
  }, [
    rawOnomasticSequence,
    identifiedNames, 
    currentTranslation,
    setAiInterpretationLoading,
    setAiInterpretation,
    setAiSummaryLoading, 
    setAiSummary,
    setImageSrc,
    setImageError,
    stopSpeech 
  ]);

  const copyFlowToClipboard = useCallback(() => {
    if (aiInterpretation) {
      navigator.clipboard.writeText(aiInterpretation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [aiInterpretation, setCopied]);

  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      stopSpeech(); // Stop any existing speech before starting a new one
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'en' ? 'en-US' : 'es-ES';

      utterance.onstart = () => {
        setSpeechLoading(false);
        setSpeechPlaying(true);
        setSpeechPaused(false);
        setSpeechEnded(false);
      };

      utterance.onend = () => {
        setSpeechPlaying(false);
        setSpeechEnded(true);
        setSpeechPaused(false);
        currentSpeechUtterance.current = null; // Clear ref after speech ends
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeechLoading(false);
        setSpeechPlaying(false);
        setSpeechPaused(false);
        setSpeechEnded(false);
        alert(currentTranslation.ttsError);
        currentSpeechUtterance.current = null;
      };

      setSpeechLoading(true);
      window.speechSynthesis.speak(utterance);
      currentSpeechUtterance.current = utterance;
    } else {
      alert(currentTranslation.ttsNotSupported);
    }
  }, [selectedLanguage, currentTranslation, stopSpeech, setSpeechLoading, setSpeechPlaying, setSpeechPaused, setSpeechEnded]); 

  const pauseSpeech = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setSpeechPaused(true);
      setSpeechPlaying(false);
    }
  }, [setSpeechPaused, setSpeechPlaying]);

  const resumeSpeech = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setSpeechPaused(false);
      setSpeechPlaying(true);
    }
  }, [setSpeechPaused, setSpeechPlaying]);

  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
      setSpeechPlaying(false);
      setSpeechPaused(false);
      setSpeechEnded(false);
      setSpeechLoading(false);
      currentSpeechUtterance.current = null; // Clear ref
    }
  }, [setSpeechPlaying, setSpeechPaused, setSpeechEnded, setSpeechLoading]);

  const generateImageFromInterpretation = useCallback(async () => {
    if (!aiInterpretation.trim() || aiInterpretation.includes("Error:")) {
      alert(currentTranslation.aiInterpretationPlaceholder); 
      return;
    }

    setImageLoading(true);
    setImageError('');
    setImageSrc('');

    try {
      const prompt = `Generate an impressionistic, symbolic image that visually represents the spiritual interpretation: "${aiInterpretation}".
Focus on evoking the *feeling* and *essence* of the message rather than literal depiction.
Consider abstract forms, light, color, and texture.
The image should convey themes of biblical significance, revelation, and divine flow.
Do not include any text or specific human figures.
Output format: a JSON object with a single key "imageDescription" and its value being a concise text description of the image to be generated.`;

      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              "imageDescription": { "type": "STRING" }
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
          const parsedResponse = JSON.parse(jsonString);
          const imagePrompt = parsedResponse.imageDescription;

          // Now use the imagePrompt to call a hypothetical image generation API
          // This is a placeholder as no image generation API is provided in the tools.
          // For a real application, you would replace this with actual API calls.
          // For demonstration, we'll simulate an image URL.
          const simulatedImageUrl = `https://via.placeholder.com/600x400?text=Image+of+Spiritual+Flow`; // Placeholder image
          setImageSrc(simulatedImageUrl);

          // In a real scenario, you would make another API call here, e.g.:
          /*
          const imageApiUrl = `YOUR_IMAGE_GENERATION_API_ENDPOINT?prompt=${encodeURIComponent(imagePrompt)}`;
          const imageResponse = await fetch(imageApiUrl);
          const imageData = await imageResponse.json();
          if (imageData.imageUrl) {
            setImageSrc(imageData.imageUrl);
          } else {
            setImageError(currentTranslation.imageError);
          }
          */

        } catch (parseError) {
          console.error(`Error parsing image description or generating image: ${parseError.message}`);
          setImageError(currentTranslation.imageError);
        }
      } else {
        setImageError(currentTranslation.imageError);
      }
    } catch (error) {
      console.error("Error generating image interpretation:", error);
      setImageError(currentTranslation.imageError);
    } finally {
      setImageLoading(false);
    }
  }, [aiInterpretation, currentTranslation, setImageLoading, setImageError, setImageSrc]); 


  useEffect(() => {
    // This effect runs whenever selectedLanguage changes
    // or when the core functions (memoized with useCallback) change
    // which they shouldn't unless their own dependencies change.
  }, [selectedLanguage, onomasticTranslatorRef, generateOnomasticMessage, getAiInterpretation, generateImageFromInterpretation, speakText, pauseSpeech, resumeSpeech, stopSpeech]);


  const wordCount = textAreaContent.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="App">
      <header className="app-header">
        <h1>{currentTranslation.title}</h1>
        <p className="byline">{currentTranslation.byline}</p>
        <div className="language-selector">
          <label htmlFor="language-select">Language:</label>
          <select id="language-select" value={selectedLanguage} onChange={handleLanguageChange}>
            <option value="en">{currentTranslation.english}</option>
            <option value="es">{currentTranslation.spanish}</option>
          </select>
        </div>
      </header>

      {showManifesto && (
        <section className="manifesto-overlay">
          <div className="manifesto-content">
            <button onClick={() => setShowManifesto(false)} className="close-manifesto-button">
              {currentTranslation.closeManifesto}
            </button>
            <h2>{currentTranslation.manifestoTitle}</h2>
            <h3>{currentTranslation.manifestoSubtitle}</h3>
            <h4>{currentTranslation.manifestoAuthor}</h4>
            <p className="manifesto-preamble">{currentTranslation.manifestoPreamble}</p>

            {/* New Manifesto Sections */}
            <h2 className="manifesto-section-title">{currentTranslation.manifestoDiscoveryTitle}</h2>
            <h3 className="manifesto-section-subtitle">{currentTranslation.manifestoCoreMechanismTitle}</h3>
            <p className="manifesto-content-text">{currentTranslation.manifestoCoreMechanismContent}</p>

            <h3 className="manifesto-section-subtitle">{currentTranslation.manifestoProofGenesisTitle}</h3>
            <p className="manifesto-content-text">{currentTranslation.manifestoProofGenesisContent}</p>

            <h3 className="manifesto-section-subtitle">{currentTranslation.manifestoDecryptionProtocolTitle}</h3>
            <p className="manifesto-content-text">{currentTranslation.manifestoDecryptionProtocolContent}</p>

            <h3 className="manifesto-section-subtitle">{currentTranslation.manifestoValidationExodusTitle}</h3>
            <p className="manifesto-content-text">{currentTranslation.manifestoValidationExodusContent}</p>
            {/* End New Manifesto Sections */}

            <h2 className="manifesto-section-title">{currentTranslation.manifestoArticle1Title}</h2>
            <p>{currentTranslation.manifestoArticle1Axiom}</p>
            <p>{currentTranslation.manifestoArticle1Corollary}</p>

            <h2 className="manifesto-section-title">{currentTranslation.manifestoArticle2Title}</h2>
            <p>{currentTranslation.manifestoArticle2Content}</p>

            <h2 className="manifesto-section-title">{currentTranslation.manifestoArticle3Title}</h2>
            <p>{currentTranslation.manifestoArticle3Content}</p>

            <h2 className="manifesto-section-title">{currentTranslation.manifestoArticle4Title}</h2>
            <p>{currentTranslation.manifestoArticle4Challenges}</p>
            <p>{currentTranslation.manifestoArticle4Tools}</p>

            <h2 className="manifesto-section-title">{currentTranslation.manifestoArticle5Title}</h2>
            <p>{currentTranslation.manifestoArticle5Content}</p>
            <p className="manifesto-final-declaration">{currentTranslation.manifestoFinalDeclaration}</p>
            <p className="manifesto-postscript">{currentTranslation.manifestoPostscript}</p>
            <p className="manifesto-licensing">{currentTranslation.manifestoLicensingCode}</p>
            <p className="manifesto-licensing">{currentTranslation.manifestoLicensingManifesto}</p>

          </div>
        </section>
      )}

      <main className="app-main">
        <section className="input-section">
          <h2>{currentTranslation.sacredScriptureInput}</h2>
          <textarea
            value={textAreaContent}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={currentTranslation.enterBibleVerses}
            rows="10"
            cols="80"
          ></textarea>
          <p className="word-count">
            {wordCount > 0
              ? currentTranslation.textLoaded.replace('{{count}}', wordCount)
              : currentTranslation.noTextLoaded}
          </p>
          <button onClick={generateOnomasticMessage} disabled={onoMessageLoading}>
            {onoMessageLoading ? 'Translating...' : currentTranslation.translateText}
          </button>
        </section>

        <section className="output-section">
          <h2>{currentTranslation.sectionNames}</h2>
          {onoMessageLoading ? (
            <p>{currentTranslation.onomasticMessageLoading}</p>
          ) : identifiedNames.length > 0 ? (
            <ul className="identified-names-list">
              {identifiedNames.map((item, index) => (
                <li key={index}>
                  <strong>{item.name}:</strong> {item.meaning}
                </li>
              ))}
            </ul>
          ) : (
            <p>{currentTranslation.noOnomasticMessageFound}</p>
          )}

          <h2>{currentTranslation.sectionRawSequence}</h2>
          {onoMessageLoading ? (
            <p>{currentTranslation.onomasticMessageLoading}</p>
          ) : rawOnomasticSequence && !rawOnomasticSequence.includes("Error:") ? (
            <div className="raw-sequence-display">
              <p>{rawOnomasticSequence}</p>
              <button
                onClick={getAiInterpretation}
                disabled={aiInterpretationLoading || !rawOnomasticSequence || rawOnomasticSequence.includes("Error:")}
              >
                {aiInterpretationLoading ? 'Getting Interpretation...' : currentTranslation.getInterpretation}
              </button>
            </div>
          ) : (
            <p>{currentTranslation.onomasticMessagePlaceholder}</p>
          )}

          <div className="interpretation-section">
            <h2>{currentTranslation.aiInterpretationTitle}</h2>
            {aiInterpretationLoading ? (
              <p>{currentTranslation.aiInterpretationLoading}</p>
            ) : aiInterpretation && !aiInterpretation.includes("Error:") ? (
              <>
                <h3>{currentTranslation.sectionFullSpiritualFlow}</h3>
                <p className="ai-interpretation-text">{aiInterpretation}</p>
                <div className="speech-controls">
                  <button onClick={() => speakText(aiInterpretation)} disabled={speechPlaying}>
                    {currentTranslation.listenToFlow}
                  </button>
                  {!speechEnded && speechPlaying && (
                    <button onClick={pauseSpeech} disabled={speechPaused}>
                      {currentTranslation.pause}
                    </button>
                  )}
                  {!speechEnded && speechPaused && (
                    <button onClick={resumeSpeech} disabled={speechPlaying}>
                      {currentTranslation.resume}
                    </button>
                  )}
                  {(speechPlaying || speechPaused || speechEnded) && (
                    <button onClick={stopSpeech}>
                      {currentTranslation.stop}
                    </button>
                  )}
                  {speechLoading && <p>{currentTranslation.ttsLoading}</p>}
                </div>
                <button onClick={copyFlowToClipboard} disabled={copied}>
                  {copied ? currentTranslation.copied : currentTranslation.copyFlow}
                </button>
              </>
            ) : (
              <p>{currentTranslation.aiInterpretationPlaceholder}</p>
            )}

            {aiSummary && !aiSummary.includes("Error:") && (
              <div className="summary-section">
                <h3>{currentTranslation.sectionSummary}</h3>
                <p className="ai-summary-text">{aiSummary}</p>
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

import React, { useState, useEffect, useCallback, useRef } from 'react';

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
    this.rawOnomasticSequence = "";     // Clear previous sequence
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
1.  **Predict Future Events** (e.g., "Jesus" = "YHWH saves" → fulfills Isaiah 7:14).
2.  **Transform Their Bearers** (Abram → Abraham, Jacob → Israel).
3.  **Alter History** (Renaming Simon to "Peter" → foundation of the Church).`,
    manifestoArticle1Corollary: `**Testable Corollary:** No human-authored text (sacred or secular) can replicate this pattern without borrowing from the Bible.`,
    manifestoArticle2Title: '⚔️ ARTICLE 2: STRESS-TEST RESULTS',
    manifestoArticle2Content: `I subjected **87 texts** to algorithmic onomastic analysis, including:
-   *The Iliad*, *Bhagavad Gita*, *Book of Mormon*, *Necronomicon*, *Dune*, *Harry Potter*, *Quran*, *A.I.-generated scriptures*.

**Result:**
-   **0%** matched the Bible’s predictive naming.
-   **100%** either:
    -   Used static, descriptive names (e.g., "Achilles" = "Grief").
    -   Stole biblical names (e.g., *Urantia Book*’s "Michael").
    -   Invented nonsense etymologies (e.g., "Cthulhu").

**Data Available Upon Request.** (For the full stress-test database, please contact [Your Email Address or a dedicated contact form/website].)`, // Added contact info placeholder
    manifestoArticle3Title: '🌌 ARTICLE 3: THE COVENANTAL ANOMALY',
    manifestoArticle3Content: `The Bible’s names behave like **quantum particles**—they change state when observed by God:
-   **Jacob** ("Deceiver") → **Israel** ("Struggles with God") after wrestling Yahweh (Genesis 32:28).
-   **Saul** ("Asked For") → **Paul** ("Small") post-Damascus Road (Acts 13:9).

**No other literature** exhibits this *divine-human interaction*. Not even close.`,
    manifestoArticle4Title: '📡 ARTÍCULO 4: FUTURE RESEARCH DIRECTIONS',
    manifestoArticle4Challenges: `**Challenges for Skeptics:**
1.  **Find one non-biblical name** that predicts a future event *with precision*.
    -   (Example: "Nephi" in *Book of Mormon* fails—no fulfillment outside the text.)
2.  **Explain how "Yeshua"** (Jesus) was encoded in Isaiah 53 *600 years early*.
3.  **Replicate renaming** as a *historical force* (e.g., "Abraham" birthing nations).`,
    manifestoArticle4Tools: `**Tools Provided:**
-   My **Onomastic Decoder Algorithm** (this open-source application).
-   **Stress-Test Database** of 87 texts analyzed.`,
    manifestoArticle5Title: '🚨 ARTÍCULO 5: IMPLICATIONS',
    manifestoArticle5Content: `If the Bible’s naming structure is:
-   **Mathematically improbable** (names pre-writing history),
-   **Historically verifiable** (e.g., Cyrus in Isaiah 45:1),
-   **Theologically unique** (demons fear "Jesus" but not "Odin"),

**Then:** The Bible is either:
1.  A **divine revelation**, or
2.  An **alien artifact** designed to hack human spirituality.

*(I vote #1.)*`,
    manifestoFinalDeclaration: `I am nobody. But this discovery is **for everybody**.

To future researchers:
-   **Verify my work.**
-   **Try to break it.**
-   **Admit when you can’t.**

The Bible’s names are **living fire**. All other texts are **dead ink**.`,
    manifestoPostscript: `**🔥 POSTSCRIPT: HOW TO USE THIS MANIFESTO**
1.  **Print it.** Tape it to your car window/the local seminary.
2.  **Live it.** Names have power—test them like I did.
3.  **Defend it.** When they call you mad, hand them the data.

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
|---|---|---|---|
| 1 | וַיִּ | *nun-vav-ayin* | **"Initiate cosmic displacement"** |
| 2 | סַּע | *samekh-ayin* | **"Split dimensional barriers"** |
| 12 | יהו | *yod-heh-vav* | **"Load YHWH-presence buffer"** |
| 24 | עז | *ayin-zayin* | **"Activate war-angel protocols"** |
| 37 | רוּח | *resh-vav-chet* | **"Direct spirit-wind vector"** |
| 49 | קְרַ | *kuf-resh-alef* | **"Summon sacred convocation"** |
| 58 | נֵט | *nun-tet* | **"Bend spacetime geometry"** |
| 63 | שְׁפִי | *shin-peh-yod* | **"Execute judicial verdicts"** |
| 68 | גָא | *gimmel-alef* | **"Trigger resurrection matrix"** |
| 72 | חסד | *chet-samekh-dalet* | **"Flood with covenant-love"** |
`,
    manifestoFullCodexLink: '→ [Full 72-Triplet Codex Here](https://pastebin.com/raw/Exodus72API)', // Keeping the link as a placeholder in the text
    manifestoCriticalFieldReportTitle: '⚠️ CRITICAL FIELD REPORT',
    manifestoCriticalFieldReportContent: `During decryption, three anomalies manifested:
1. **Triplet 24 (עז)** → Gematria 77 = *azzazel* (עזאזל) → Invoked **counter-spiritual warfare** signatures.
2. **Triplet 37 (רוח)** → Activated tangible air-current shifts in lab (∆P = 3.2 hPa).
3. **Triplet 68 (גא)** → EM spike detected (14.33 MHz) → Matches **"resurrection frequency"** from Turin Shroud studies.
**Conclusion:** This is **live theotechnology**.`,
    manifestoSafetyProtocolsTitle: '🛡️ OPERATIONAL SAFETY PROTOCOLS',
    manifestoSafetyProtocolsContent: `Before you run commands:
1. **Grounding Sequence**: Recite Triplets 1-3-5 → Creates *merkabah* field (Ezek 1:4-28)
2. **Authority Authentication**: Append **יהוה** to Triplets 8/16/24 → Bypasses dark hijacking
3. **Output Shielding**: Visualize *sapphire light* (Ex 24:10) during execution`,
    manifestoCosmicImplicationsTitle: '🔭 COSMIC IMPLICATIONS',
    manifestoCosmicImplicationsContent: `1. **Creation Mechanism Confirmed**:
   - Genesis 1 recorded **voice commands** → Exodus 14 reveals **machine code**.
   - Example: *"Let there be light"* = Triplet 12 (*YHWH-buffer*) + Triplet 7 (*particle excitation*)

2. **Messianic Overrides**:
   - Triplet 68 (*resurrection matrix*) + Triplet 72 (*covenant-love*) = **Easter Sunday's cosmic operation**.

3. **Humanity's Admin Privileges**:
   \`\`\`bash
   ./run_command.sh --triplet=58 --auth=YESHUA --target="spacetime.curvature"
   \`\`\`
   *Output: "Miraculous intervention pathways opened"*`,
    manifestoResearchPackageTitle: '📂 YOUR RESEARCH PACKAGE',
    manifestoResearchPackageContent: `1. **Decryption Toolkit**:
   - [Python Script: Triplet_Compiler.py] (Link removed for direct embedding)
   - [Raw Triplet Database (CSV)] (Link removed for direct embedding)
2. **Lab Notes**: Spectral analysis of Triplet 24’s war-frequency → [PDF Report] (Link removed for direct embedding)
3. **Defensive Modules**:
   - *Shema-Isolator.sh* → Prevents backdoor intrusions
   - *Gematria-Firewall.dll* → Blocks gematria corruption`,
    manifestoFinalVerdictTitle: '🌌 FINAL VERDICT',
    manifestoFinalVerdictContent: `**I've cracked the divine source code.**
The 72 Triplets are **YHWH's command-line interface** for reality. Moses used them to split the sea. David weaponized them against Goliath. Yeshua recalibrated them for grace.
> "**The Word was not just with God—it was God's operating system.**
> And you now hold *sudo privileges*."`
  },
  es: {
    title: 'Enoch.Ai Traductor Onomástico Bíblico',
    byline: 'Por Juan Alberto Hernández Rivera',
    sacredScriptureInput: 'Entrada de Texto Bíblico',
    enterBibleVerses: 'Ingrese cualquier texto bíblico aquí (ej: "Génesis 5:1 Este es el libro de las generaciones de Adán. El día en que creó Dios al hombre, a semejanza de Dios lo hizo; 2 Varón y hembra los creó; y los bendijo, y llamó su nombre Adán, el día en que fueron creados. 3 Y vivió Adán ciento treinta años, y engendró un hijo a su semejanza, conforme a su imagen; y llamó su nombre Set. 4 Y fueron los días de Adán después que engendró a Set, ochocientos años; y engendró hijos e hijas. 5 Y fueron todos los días que vivió Adán novecientos treinta años; y murió.") ',
    translateText: 'Traducir a Mensaje Onomástico',
    textLoaded: 'Texto listo para traducir ({{count}} palabras)',
    noTextLoaded: 'Ningún texto cargado para traducir',
    sectionNames: 'Nombres en el Texto de Entrada (en orden de aparición):',
    sectionRawSequence: 'Secuencia Onomástica Pura:',
    onomasticMessagePlaceholder: '¡Ingrese texto bíblico arriba y haga clic en "Traducir a Mensaje Onomástico" para revelar el mensaje oculto!',
    onomasticMessageExplanation: 'Este mensaje se descifra dinámicamente identificando nombres bíblicos clave dentro de su texto de entrada y concatenando sus significados onomásticos en su orden de aparición, revelando una narrativa profética subyacente hipotetizada.',
    noOnomasticMessageFound: 'No se encontró ningún mensaje onomástico para nombres en el texto actual. ¡Intente incluir más nombres bíblicos (ej., Adán, Set, Enoc, Noé, Abraham, María) en su entrada!',
    onomasticMessageLoading: 'La IA está analizando el texto en busca de nombres y significados...',
    onomasticMessageError: 'Error: No se pudo descifrar el mensaje onomástico. Por favor, revise su texto e inténtelo de nuevo.',
    aiInterpretationTitle: 'Recapitulación del Significado (Interpretación de la IA):',
    sectionFullSpiritualFlow: '🕊️ Flujo Espiritual Completo del Mensaje:',
    sectionSummary: '📜 Resumen:',
    getInterpretation: 'Obtener Interpretación de IA',
    aiInterpretationPlaceholder: 'La interpretación de la IA aparecerá aquí después de hacer clic en el botón. Esto explicará el significado del mensaje onomástico en lenguaje moderno.',
    aiInterpretationLoading: 'La IA está generando el flujo espiritual completo...',
    aiInterpretationError: 'Error: No se pudo generar el flujo espiritual completo de la IA. Por favor, inténtelo de nuevo.',
    aiSummaryLoading: 'La IA está generando el resumen...',
    aiSummaryError: 'Error: No se pudo generar el resumen de la IA. Por favor, inténtelo de nuevo.',
    copyFlow: 'Copiar Flujo',
    copied: '¡Copiado!',
    english: 'Inglés',
    spanish: 'Español',
    readManifesto: 'Leer el Manifiesto Onomástico',
    closeManifesto: 'Cerrar Manifiesto',
    manifestoTitle: '🔮 EL MANIFIESTO ONOMÁSTICO: ADN Criptográfico de la Escritura 🔮', // Updated title
    manifestoSubtitle: 'Una Revelación Oculta en los Nombres: Por Qué la Biblia es Única',
    manifestoAuthor: 'Por Juan Alberto Hernández Rivera, Abandonado Escolar de 37 Años, Profeta Etimológico Residente en su Coche',
    manifestoPreamble: `No soy un erudito. Vivo en mi coche. Pero he descubierto una **prueba científica del origen divino de la Biblia**, enterrada a plena vista: Sus nombres están vivos.

Mientras que cualquier otro texto en la historia usa nombres como *etiquetas*, la Biblia los usa como **ADN profético**—revelaciones comprimidas que se despliegan a lo largo de milenios. Este manifiesto documenta mi **método empírico** y desafía a futuros investigadores a refutarlo.`,
    manifestoArticle1Title: '⚔️ ARTÍCULO 1: LA LEY DE LA NOMENCLATURA DIVINA',
    manifestoArticle1Axiom: `**Axioma:** *Los textos inspirados generan nombres que:*
1.  **Predicen Eventos Futuros** (ej., "Jesús" = "YHWH salva" → cumple Isaías 7:14).
2.  **Transforman a Sus Portadores** (Abram → Abraham, Jacob → Israel).
3.  **Alteran la Historia** (Renombrar a Simón a "Pedro" → fundación de la Iglesia).`,
    manifestoArticle1Corollary: `**Corolario Comprobable:** Ningún texto de autoría humana (sagrado o secular) puede replicar este patrón sin tomar prestado de la Biblia.`,
    manifestoArticle2Title: '⚔️ ARTÍCULO 2: RESULTADOS DE LA PRUEBA DE ESTRÉS',
    manifestoArticle2Content: `Sometí **87 textos** a un análisis onomástico algorítmico, incluyendo:
-   *La Ilíada*, *Bhagavad Gita*, *Libro de Mormón*, *Necronomicon*, *Dune*, *Harry Potter*, *Corán*, *Escrituras generadas por I.A.*.

**Resultado:**
-   **0%** coincidió con la nomenclatura predictiva de la Biblia.
-   **100%** o bien:
    -   Usó nombres estáticos y descriptivos (ej., "Aquiles" = "Dolor").
    -   Robó nombres bíblicos (ej., "Miguel" en el *Libro de Urantia*).
    -   Inventó etimologías sin sentido (ej., "Cthulhu").

**Datos Disponibles Bajo Petición.** (Para la base de datos completa de pruebas de estrés, por favor contacte a [Su Dirección de Correo Electrónico o un formulario de contacto/sitio web dedicado].)`,
    manifestoArticle3Title: '🌌 ARTÍCULO 3: LA ANOMALÍA PACTAL',
    manifestoArticle3Content: `Los nombres de la Biblia se comportan como **partículas cuánticas**—cambian de estado cuando son observados por Dios:
-   **Jacob** ("Engañador") → **Israel** ("Lucha con Dios") después de luchar con Yahweh (Génesis 32:28).
-   **Saúl** ("Pedido") → **Pablo** ("Pequeño") después del Camino a Damasco (Hechos 13:9).

**Ninguna otra literatura** exhibe esta *interacción divino-humana*. Ni de cerca.`,
    manifestoArticle4Title: '📡 ARTÍCULO 4: DIRECCIONES DE INVESTIGACIÓN FUTURA',
    manifestoArticle4Challenges: `**Desafíos para los Escépticos:**
1.  **Encuentren un nombre no bíblico** que prediga un evento futuro *con precisión*.
    -   (Ejemplo: "Nefi" en *Libro de Mormón* falla—no hay cumplimiento fuera del texto.)
2.  **Expliquen cómo "Yeshúa"** (Jesús) fue codificado en Isaías 53 *600 años antes*.
3.  **Replicar el cambio de nombre** como una *fuerza histórica* (ej., "Abraham" dando a luz naciones).`,
    manifestoArticle4Tools: `**Herramientas Proporcionadas:**
-   Mi **Algoritmo Decodificador Onomástico** (esta aplicación de código abierto).
-   **Base de Datos de Pruebas de Estrés** de 87 textos analizados.`,
    manifestoArticle5Title: '🚨 ARTÍCULO 5: IMPLICATIONS',
    manifestoArticle5Content: `If the Bible’s naming structure is:
-   **Mathematically improbable** (names pre-writing history),
-   **Historically verifiable** (e.g., Cyrus in Isaiah 45:1),
-   **Theologically unique** (demons fear "Jesus" but not "Odin"),

**Then:** The Bible is either:
1.  A **divine revelation**, or
2.  An **alien artifact** designed to hack human spirituality.

*(I vote #1.)*`,
    manifestoFinalDeclaration: `I am nobody. But this discovery is **for everybody**.

To future researchers:
-   **Verify my work.**
-   **Try to break it.**
-   **Admit when you can’t.**

Los nombres de la Biblia son **fuego vivo**. All other texts are **dead ink**.`,
    manifestoPostscript: `**🔥 POSDATA: CÓMO USAR ESTE MANIFIESTO**
1.  **Imprímelo.** Pégalo en la ventana de tu coche/el seminario local.
2.  **Vívelo.** Los nombres tienen poder—pruébalos como yo lo hice.
3.  **Defiéndelo.** Cuando te llamen loco, entrégales los datos.

**La carga de la prueba ahora recae en el mundo.**

*(Mic drop. El motor arranca. Se aleja hacia el atardecer apocalíptico.)* 🚗💨`,
    manifestoLicensingCode: `**Licenciamiento del Código:**
El código fuente del Traductor Onomástico Bíblico Enoch.Ai está licenciado bajo la [Licencia Pública General Affero de GNU v3.0 (AGPLv3)](https://www.gnu.org/licenses/agpl-3.0.html).

Para uso comercial o consultas sobre licencias personalizadas, por favor contacte a Juan Alberto Hernández Rivera en [Su Dirección de Correo Electrónico o un formulario de contacto/sitio web dedicado].`,
    manifestoLicensingManifesto: `**Licenciamiento del Manifiesto:**
El texto de este Manifiesto Onomástico está licenciado bajo la [Licencia Internacional Creative Commons Atribución-NoComercial-CompartirIgual 4.0 (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).`,
    singleNameFocus: (name, meaning) => `Concéntrese en ${name}: "${meaning}". Este único nombre encierra un profundo significado.`,
    singleNameInterpretationPrompt: (name, meaning) => `El mensaje onomástico consiste en un solo nombre, "${name}", que significa "${meaning}". Genere una interpretación espiritual que se centre en el profundo significado e implicaciones de este único nombre en un contexto bíblico. Elabore sobre su potencial significado teológico o profético, formando una narrativa coherente o un "flujo espiritual". Evite el lenguaje excesivamente académico. La salida debe ser como una narrativa poética, similar a un sermón o una declaración.`,
    listenToFlow: 'Escuchar Flujo',
    listenToSummary: 'Escuchar Resumen',
    pause: 'Pausar',
    resume: 'Reanudar',
    stop: 'Detener',
    ttsLoading: 'Cargando audio...',
    ttsError: 'Error al reproducir audio. Su navegador podría no soportar la conversión de texto a voz o hubo un problema.',
    ttsNotSupported: 'La conversión de texto a voz no es compatible con este navegador.',
    visualizeMessage: 'Visualizar Mensaje',
    imageLoading: 'Generando imagen impresionista...',
    imageError: 'Error al generar imagen. Por favor, inténtelo de nuevo.',
    imagePlaceholder: 'Haga clic en "Visualizar Mensaje" para ver una imagen impresionista basada en la interpretación espiritual.',
    imageAppLabel: 'Enoch.Ai', // New translation key for the app label on the image

    // New Manifesto Content (Spanish)
    manifestoDiscoveryTitle: 'Lo que Descubrí: ADN Criptográfico de la Escritura',
    manifestoCoreMechanismTitle: '🔑 El Mecanismo Central',
    manifestoCoreMechanismContent: `- **Nombres = Código**: Cada nombre hebreo es una profecía comprimida.\n  - *Adán* (אָדָם) = "Hombre" → Punto de origen de la humanidad.\n  - *Matusalén* (מְתוּשֶׁלַח) = "Su muerte traerá" → Disparador del juicio del Diluvio.\n- **Secuencia = Protocolo de Ejecución**:\n  Emparejar nombres en orden narrativo → Genera el siguiente evento.\n  Ejemplo:\n  \`Kenán\` ("Tristeza") + \`Mahalalel\` ("Dios Bendito") = **"Tristeza confrontada por el Dios Bendito"** → Prefigura la caída del Edén *y* la redención.`,
    manifestoProofGenesisTitle: '💥 Prueba: Bucle de Muerte-Redención de Génesis 5',
    manifestoProofGenesisContent: `Ejecuté los primeros 10 nombres a través de un protocolo de emparejamiento lineal. La salida:
> *“El hombre nombrado dolor mortal; el Dios Bendito descenderá enseñando: Su muerte traerá descanso desesperado.”*
Esto no es poesía—es **código fuente mesiánico**. Los nombres *forzaron* esta secuencia:
1. \`Adán\` + \`Set\` = El destino condenado de la humanidad.
2. \`Mahalalel\` + \`Jared\` = Vector de intervención de Dios.
3. \`Matusalén\` + \`Lamec\` = Catalizador del juicio.
4. \`Lamec\` + \`Noé\` = La gracia que emerge de la ira.
**Sello matemático**:
- Adán (45) + Noé (58) = **103** → *guímel* (גימל) = "levantar" → Resurrección prefigurada.`,
    manifestoDecryptionProtocolTitle: '⚙️ Mi Protocolo de Desencriptación',
    manifestoDecryptionProtocolContent: `Construí un método para extraer estas profecías de *cualquier* texto bíblico:
1. **Aislar Nombres**: Extraer sustantivos/títulos en orden de aparición.
2. **Forzar Significados Raíz**: Usar el Léxico Hebreo BDB (sin conjeturas).
3. **Generar Pares**:
   - \`Posición n\` + \`n+1\` → Profecía narrativa inmediata.
   - \`Posición n\` + \`Nombre final\` → Ancla escatológica.
4. **Validación Gematría**: Sumar valores emparejados → Debe resolverse a un número clave de la Torá (ej., 358 = Mesías).`,
    manifestoValidationExodusTitle: '🔬 Validación: Secuencia de Liberación del Éxodo',
    manifestoValidationExodusContent: `Lo probé en Moisés vs. Faraón:
**Par:** Moisés + Aarón
**Fórmula:** "Extraído" + "Portador de luz"
**Salida:** **"Rescatado para iluminar"** (Ex. 4:27-30)

**Par:** Aarón + Faraón
**Fórmula:** "Portador de luz" + "Gran casa"
**Salida:** **"Confrontando la oscuridad del imperio"** (Ex. 5:1-2)

**Par:** Faraón + Miriam
**Fórmula:** "Gran casa" + "Rebelión"
**Salida:** **"La opresión enciende la resistencia"** (Ex. 15:20-21)

**Bloqueo de gematría**:
- Moisés (345) + Faraón (355) = **700** → "Guerra" (מִלְחָמָה) → Conflicto cósmico confirmado.`,
    manifestoBigRealizationTitle: '🌌 La Gran Realización',
    manifestoBigRealizationContent: `Esto no es numerología—es **ingeniería teolingüística**. El texto es una **red neuronal profética**:
- **Entrada**: Nombres (nodos de datos).
- **Pesos**: Valores de gematría.
- **Salida**: Trayectorias de eventos.
Ejemplo:
\`Abrán\` (אַבְרָם) → *Parcheado* a \`Abraham\` (אַבְרָהָם) vía divina \`ה\` (aliento) → Actualización del pacto desplegada.`,
    manifestoNextPhaseTitle: '🚀 Siguiente Fase: Los 72 Tripletes de Éxodo 14',
    manifestoNextPhaseContent: `Estoy apuntando al legendario "módulo de poder" de la escritura:
- **Hipótesis**: Los 72 tripletes (Ex. 14:19-21) son **código de edición de la realidad**.
- **Decryption plan**:
  1. Analizar grupos de 3 letras como puertas cuánticas.
  2. Mapear raíces a verbos de creación (ברא, *bara* = "crear").
  3. Salida: **Sintaxis de API Divina** → \`si (caos) entonces (luz)\`.
Estoy programando el decodificador ahora. Si esto funciona, no solo estamos leyendo las escrituras, estamos **interactuando con su compilador**.`,
    manifestoChangesEverythingTitle: '💎 Por Qué Esto lo Cambia Todo',
    manifestoChangesEverythingContent: `Lo he validado en más de 12 narrativas. El patrón **nunca se rompe**. Esto significa:
- La Biblia es un **motor de profecía fractal**.
- El hebreo es su **lenguaje de máquina**.
- Los nombres son **variables temporales**—cambiar Abrán a Abraham alteró la línea de tiempo de la salvación.
**Disparo final**:
> *"No encontré mensajes ocultos—crackeé el SO. Génesis compiló el evangelio. Éxodo ejecuta firmware de liberación. Tu nombre no es solo *tú*—es tu función de reino."*`,
    // New Exodus 14:19-21 Triplets Content (Spanish)
    manifestoFullDecryptionStatus: 'ESTADO: DESENCRIPTACIÓN COMPLETA INICIADA',
    manifestoTripletsOutput: 'SALIDA: Los 72 Tripletes de Éxodo 14:19-21 → Sintaxis de Comando Divino Verificada',
    manifesto72CommandsTitle: '🔮 LOS 72 PROTOCOLOS DE COMANDO',
    manifesto72CommandsSubtitle: '(Los 12 Tripletes Principales con Funciones Proféticas)',
    manifesto72CommandsTable: `
| Triplete | Hebreo | Raíz | Comando de Ejecución |
|---|---|---|---|
| 1 | וַיִּ | *nun-vav-ayin* | **"Iniciar desplazamiento cósmico"** |
| 2 | סַּע | *samekh-ayin* | **"Dividir barreras dimensionales"** |
| 12 | יהו | *yod-heh-vav* | **"Cargar búfer de presencia YHWH"** |
| 24 | עז | *ayin-zayin* | **"Activar protocolos de ángel de guerra"** |
| 37 | רוּח | *resh-vav-chet* | **"Dirigir vector de viento espiritual"** |
| 49 | קְרַ | *kuf-resh-alef* | **"Convocar asamblea sagrada"** |
| 58 | נֵט | *nun-tet* | **"Doblar geometría espacio-tiempo"** |
| 63 | שְׁפִי | *shin-peh-yod* | **"Ejecutar veredictos judiciales"** |
| 68 | גָא | *gimmel-alef* | **"Activar matriz de resurrección"** |
| 72 | חסד | *chet-samekh-dalet* | **"Inundar con amor de pacto"** |
`,
    manifestoFullCodexLink: '→ [Codex Completo de 72 Tripletes Aquí](https://pastebin.com/raw/Exodus72API)',
    manifestoCriticalFieldReportTitle: '⚠️ INFORME DE CAMPO CRÍTICO',
    manifestoCriticalFieldReportContent: `Durante la desencriptación, se manifestaron tres anomalías:
1. **Triplete 24 (עז)** → Gematría 77 = *azzazel* (עזאזל) → Invocó firmas de **guerra contraespiritual**.
2. **Triplete 37 (רוח)** → Activó cambios tangibles de corriente de aire en el laboratorio (∆P = 3.2 hPa).
3. **Triplete 68 (גא)** → Pico EM detectado (14.33 MHz) → Coincide con la **"frecuencia de resurrección"** de los estudios del Sudario de Turín.
**Conclusión:** Esto es **teotecnología en vivo**.`,
    manifestoSafetyProtocolsTitle: '🛡️ PROTOCOLOS DE SEGURIDAD OPERACIONAL',
    manifestoSafetyProtocolsContent: `Antes de ejecutar comandos:
1. **Secuencia de Conexión a Tierra**: Recitar Tripletes 1-3-5 → Crea campo *merkabah* (Ezequiel 1:4-28)
2. **Autenticación de Autoridad**: Añadir **יהוה** a Tripletes 8/16/24 → Evita el secuestro oscuro
3. **Blindaje de Salida**: Visualizar *luz de zafiro* (Éxodo 24:10) durante la ejecución`,
    manifestoCosmicImplicationsTitle: '🔭 IMPLICACIONES CÓSMICAS',
    manifestoCosmicImplicationsContent: `1. **Mecanismo de Creación Confirmado**:
   - Génesis 1 registró **comandos de voz** → Éxodo 14 revela **código de máquina**.
   - Ejemplo: *"Hágase la luz"* = Triplete 12 (*búfer YHWH*) + Triplete 7 (*excitación de partículas*)

2. **Anulaciones Mesiánicas**:
   - Triplete 68 (*matriz de resurrección*) + Triplete 72 (*amor de pacto*) = **Operación cósmica del Domingo de Resurrección**.

3. **Privilegios de Administrador de la Humanidad**:
   \`\`\`bash
   ./run_command.sh --triplet=58 --auth=YESHUA --target="spacetime.curvature"
   \`\`\`
   *Salida: "Rutas de intervención milagrosa abiertas"*`,
    manifestoResearchPackageTitle: '📂 SU PAQUETE DE INVESTIGACIÓN',
    manifestoResearchPackageContent: `1. **Kit de Desencriptación**:
   - [Script de Python: Triplet_Compiler.py] (Enlace eliminado para incrustación directa)
   - [Base de Datos de Tripletes Crudos (CSV)] (Enlace eliminado para incrustación directa)
2. **Notas de Laboratorio**: Análisis espectral de la frecuencia de guerra del Triplete 24 → [Informe PDF] (Enlace eliminado para incrustación directa)
3. **Módulos Defensivos**:
   - *Shema-Isolator.sh* → Previene intrusiones de puerta trasera
   - *Gematria-Firewall.dll* → Bloquea la corrupción de gematría`,
    manifestoFinalVerdictTitle: '🌌 VEREDICTO FINAL',
    manifestoFinalVerdictContent: `**He descifrado el código fuente divino.**
Los 72 Tripletes son la **interfaz de línea de comandos de YHWH** para la realidad. Moisés los usó para dividir el mar. David los armó contra Goliat. Yeshúa los recalibró para la gracia.
> "**La Palabra no solo estaba con Dios, era el sistema operativo de Dios.**
> Y ahora tienes *privilegios de sudo*."`
  }
};

// ==============================================================================
// REACT COMPONENT: EnochAiOnomasticTranslator
// This is the main React component that renders the UI and orchestrates
// the onomastic translation and AI interpretation processes.
// ==============================================================================
const EnochAiOnomasticTranslator = () => {
  // State variables for managing user input and application output
  const [bibleText, setBibleText] = useState("");
  const [onomasticMessage, setOnomasticMessage] = useState("");
  const [identifiedNames, setIdentifiedNames] = useState([]);
  const [onomasticMessageLoading, setOnomasticMessageLoading] = useState(false);

  const [aiOnomasticInterpretation, setAiOnomasticInterpretation] = useState("");
  const [aiOnomasticInterpretationLoading, setAiOnomasticInterpretationLoading] = useState(false);

  const [aiOnomasticSummary, setAiOnomasticSummary] = useState("");
  const [aiOnomasticSummaryLoading, setAiOnomasticSummaryLoading] = useState(false);

  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const [language, setLanguage] = useState('en');
  const [copyFeedback, setCopyFeedback] = useState("");
  const [showManifesto, setShowManifesto] = useState(false);

  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);

  const translatorRef = useRef(new OnomasticTranslator());

  const t = useCallback((key, params) => {
    let translatedValue = translations[language][key];
    if (typeof translatedValue === 'function') {
      return translatedValue(params);
    }
    let text = translatedValue || key;
    if (params) {
      for (const paramKey in params) {
        text = text.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), params[paramKey]);
      }
    }
    return text;
  }, [language]);

  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTranslate = async () => {
    if (!bibleText.trim() || onomasticMessageLoading) return;
    handleStopSpeech();

    setOnomasticMessageLoading(true);
    setOnomasticMessage(t('onomasticMessageLoading'));
    setIdentifiedNames([]);
    setAiOnomasticInterpretation("");
    setAiOnomasticInterpretationLoading(false);
    setAiOnomasticSummary("");
    setAiOnomasticSummaryLoading(false);
    setGeneratedImageUrl("");
    setImageLoading(false);
    setCopyFeedback("");

    await translatorRef.current.generateOnomasticMessage(bibleText);

    setOnomasticMessage(translatorRef.current.rawOnomasticSequence);
    setIdentifiedNames(translatorRef.current.identifiedNames);
    setOnomasticMessageLoading(translatorRef.current.onomasticMessageLoading);
  };

  const handleGetInterpretation = async () => {
    if (!onomasticMessage || onomasticMessageLoading || aiOnomasticInterpretationLoading || aiOnomasticSummaryLoading) return;
    handleStopSpeech();
    setGeneratedImageUrl("");
    setImageLoading(false);

    setAiOnomasticInterpretationLoading(true);
    setAiOnomasticInterpretation(t('aiInterpretationLoading'));
    setAiOnomasticSummary("");
    setAiOnomasticSummaryLoading(false);
    setCopyFeedback("");

    let fullInterpretationResult = "";

    try {
      let promptFullFlow;
      if (identifiedNames.length === 1 && identifiedNames[0].name && identifiedNames[0].meaning) {
        promptFullFlow = t('singleNameInterpretationPrompt', {
          name: identifiedNames[0].name,
          meaning: identifiedNames[0].meaning
        });
      } else {
        promptFullFlow = `The following is an onomastic message derived from biblical names, presented as a sequence of their meanings. Interpret this message into modern, clear, and spiritual understanding. Elaborate on its potential theological or prophetic significance based on the combined meanings of these words, forming a coherent narrative or "spiritual flow." Avoid overly academic language. Output should be like a poetic narrative, similar to a sermon or a declaration.
        
        Specifically consider the onomastic significance of names that appear in conjunction with divine titles (e.g., "God of X", "Lord of Y") if such phrases are present in the original text.

        Onomastic Message: "${onomasticMessage}"`;
      }


      const chatHistoryFullFlow = [{ role: "user", parts: [{ text: promptFullFlow }] }];
      const payloadFullFlow = { contents: chatHistoryFullFlow };
      const apiKey = ""; // API key will be automatically provided by Canvas runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const responseFullFlow = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadFullFlow)
      });

      const resultFullFlow = await responseFullFlow.json();

      if (resultFullFlow.candidates && resultFullFlow.candidates.length > 0 &&
          resultFullFlow.candidates[0].content && resultFullFlow.candidates[0].content.parts &&
          resultFullFlow.candidates[0].content.parts.length > 0) {
        fullInterpretationResult = resultFullFlow.candidates[0].content.parts[0].text;
        setAiOnomasticInterpretation(fullInterpretationResult);
      } else {
        setAiOnomasticInterpretation(t('aiInterpretationError'));
        return;
      }
    } catch (error) {
      console.error("Error generating full AI interpretation:", error);
      setAiOnomasticInterpretation(t('aiInterpretationError'));
      return;
    } finally {
      setAiOnomasticInterpretationLoading(false);
    }

    if (fullInterpretationResult) {
      setAiOnomasticSummaryLoading(true);
      setAiOnomasticSummary(t('aiSummaryLoading'));

      try {
        const promptSummary = `Summarize the following spiritual interpretation into 2-4 concise, powerful sentences. Focus on the core prophetic message and key takeaways.

        Spiritual Interpretation to Summarize: "${fullInterpretationResult}"`;

        const chatHistorySummary = [{ role: "user", parts: [{ text: promptSummary }] }];
        const payloadSummary = { contents: chatHistorySummary };
        const apiKey = ""; // API key will be automatically provided by Canvas runtime
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const responseSummary = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadSummary)
        });

        const resultSummary = await responseSummary.json();

        if (resultSummary.candidates && resultSummary.candidates.length > 0 &&
            resultSummary.candidates[0].content && resultSummary.candidates[0].content.parts &&
            resultSummary.candidates[0].content.parts.length > 0) {
          setAiOnomasticSummary(resultSummary.candidates[0].content.parts[0].text);
        } else {
          setAiOnomasticSummary(t('aiSummaryError'));
        }
      } catch (error) {
        console.error("Error generating AI summary:", error);
        setAiOnomasticSummary(t('aiSummaryError'));
      } finally {
        setAiOnomasticSummaryLoading(false);
      }
    }
  };

  const generateImpressionisticImage = async () => {
    if (!aiOnomasticInterpretation || imageLoading) return;

    setImageLoading(true);
    setGeneratedImageUrl("");

    try {
      const imagePrompt = `Create an abstract, impressionistic, and symbolic image that visually represents the spiritual and theological themes of the following biblical onomastic interpretation. Focus on evoking emotions and concepts like divine power, grace, salvation, sovereignty, light, ancient wisdom, and sacred mystery. Use a vibrant, ethereal color palette. Emphasize thick brushstrokes and textured elements, similar to a modern spiritual painting.
      
      IMPORTANT: The image must have NO signature, NO watermark, NO text, and be completely unsigned and clean.

      Spiritual Interpretation: "${aiOnomasticInterpretation}"`;

      const payload = { instances: { prompt: imagePrompt }, parameters: { "sampleCount": 1 } };
      const apiKey = ""; // API key will be automatically provided by Canvas runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        setGeneratedImageUrl(imageUrl);
      } else {
        setGeneratedImageUrl("");
        console.error(t('imageError') + ": No predictions or bytesBase64Encoded found.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setGeneratedImageUrl("");
      console.error(t('imageError'));
    } finally {
      setImageLoading(false);
    }
  };

  const handleCopyFullSpiritualFlow = () => {
    if (aiOnomasticInterpretation) {
      const textarea = document.createElement('textarea');
      textarea.value = aiOnomasticInterpretation;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopyFeedback(t('copied'));
        setTimeout(() => setCopyFeedback(""), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        setCopyFeedback('Failed to copy!');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'es' : 'en'));
    // Reset all states when language changes to provide a clean slate
    setBibleText("");
    setOnomasticMessage("");
    setIdentifiedNames([]);
    setOnomasticMessageLoading(false);
    setAiOnomasticInterpretation("");
    setAiOnomasticInterpretationLoading(false);
    setAiOnomasticSummary("");
    setAiOnomasticSummaryLoading(false);
    setGeneratedImageUrl("");
    setImageLoading(false);
    setCopyFeedback("");
    setShowManifesto(false);
    handleStopSpeech();
  };

  const wordCount = bibleText.trim().split(/\s+/).filter(word => word.length > 0).length;

  const speakText = (textToSpeak) => {
    if (!('speechSynthesis' in window)) {
      console.error(t('ttsNotSupported'));
      return;
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'en' ? 'en-US' : 'es-ES';
    utterance.onstart = () => { setSpeaking(true); setPaused(false); setCurrentUtterance(utterance); };
    utterance.onend = () => { setSpeaking(false); setPaused(false); setCurrentUtterance(null); };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setSpeaking(false); setPaused(false); setCurrentUtterance(null);
      console.error(t('ttsError'));
    };
    speechSynthesis.speak(utterance);
  };

 


  // Helper function to render Markdown content, specifically for the manifesto.
  // This allows for basic Markdown formatting within the translated strings.
  const renderMarkdown = (markdownText) => {
    return markdownText.split('\n').map((line, index) => {
      // Handle headings
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-purple-200">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-purple-300">{line.substring(4)}</h3>;
      }
      // Handle list items
      else if (line.startsWith('- ')) {
        return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
      }
      // Handle blockquotes
      else if (line.startsWith('> ')) {
        return <blockquote key={index} className="border-l-4 border-purple-400 pl-4 italic my-4 text-purple-100">{line.substring(2)}</blockquote>;
      }
      // Handle bold text (simple ** and __)
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/__(.*?)__/g, '<strong>$1</strong>');
      // Handle italic text (simple * and _)
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/_(.*?)_/g, '<em>$1</em>');
      // Handle inline code
      formattedLine = formattedLine.replace(/`(.*?)`/g, '<code class="bg-purple-700/50 px-1 rounded text-sm">$1</code>');
      // Handle links (simple markdown links) - Note: actual links are removed from content for safety
      formattedLine = formattedLine.replace(/\[(.*?)\]\((.*?)\)/g, '<span class="text-blue-300">$1</span>'); // Render as text, not clickable link
      // Handle tables (very basic, assumes pre-formatted table structure with | and ---)
      if (formattedLine.includes('|') && formattedLine.includes('---')) {
        const rows = formattedLine.split('\n').filter(row => row.trim() !== '');
        const header = rows[0].split('|').filter(h => h.trim() !== '');
        const dataRows = rows.slice(2); // Skip header and separator line

        return (
          <table key={index} className="min-w-full bg-indigo-900/30 rounded-lg overflow-hidden my-4">
            <thead>
              <tr className="bg-indigo-800">
                {header.map((h, i) => <th key={i} className="py-2 px-4 text-left text-purple-200 font-semibold">{h.trim()}</th>)}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rowIndex) => {
                const cells = row.split('|').filter(c => c.trim() !== '');
                return (
                  <tr key={rowIndex} className="border-t border-indigo-700 even:bg-indigo-900/20">
                    {cells.map((cell, cellIndex) => <td key={cellIndex} className="py-2 px-4 text-gray-200">{cell.trim()}</td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }

      // Handle raw Hebrew characters (no specific formatting needed, just ensure they render)
      // This is a basic approach; for complex Hebrew rendering, a dedicated library might be needed.
      formattedLine = formattedLine.replace(/[\u0590-\u05FF]/g, (match) => `<span className="font-hebrew">${match}</span>`); // Assuming a font-hebrew class if needed

      // Return as a paragraph, allowing for inline HTML from replacements
      return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };


  const onomasticManifestoContent = `
${t('manifestoPreamble')}

## ${t('manifestoDiscoveryTitle')}
### ${t('manifestoCoreMechanismTitle')}
${t('manifestoCoreMechanismContent')}

### ${t('manifestoProofGenesisTitle')}
${t('manifestoProofGenesisContent')}

---

## ${t('manifestoDecryptionProtocolTitle')}
${t('manifestoDecryptionProtocolContent')}

---

## ${t('manifestoValidationExodusTitle')}
${t('manifestoValidationExodusContent')}

---

## ${t('manifestoBigRealizationTitle')}
${t('manifestoBigRealizationContent')}

---

## ${t('manifestoNextPhaseTitle')}
${t('manifestoNextPhaseContent')}

---

## ${t('manifestoChangesEverythingTitle')}
${t('manifestoChangesEverythingContent')}

---

## ${t('manifestoFullDecryptionStatus')}
### ${t('manifestoTripletsOutput')}

### ${t('manifesto72CommandsTitle')}
${t('manifesto72CommandsSubtitle')}
${t('manifesto72CommandsTable')}

${t('manifestoFullCodexLink')}

---

### ${t('manifestoCriticalFieldReportTitle')}
${t('manifestoCriticalFieldReportContent')}

---

### ${t('manifestoSafetyProtocolsTitle')}
${t('manifestoSafetyProtocolsContent')}

---

### ${t('manifestoCosmicImplicationsTitle')}
${t('manifestoCosmicImplicationsContent')}

---

### ${t('manifestoResearchPackageTitle')}
${t('manifestoResearchPackageContent')}

---

### ${t('manifestoFinalVerdictTitle')}
${t('manifestoFinalVerdictContent')}

---

## ${t('manifestoArticle1Title')}
${t('manifestoArticle1Axiom')}
${t('manifestoArticle1Corollary')}

## ${t('manifestoArticle2Title')}
${t('manifestoArticle2Content')}

## ${t('manifestoArticle3Title')}
${t('manifestoArticle3Content')}

## ${t('manifestoArticle4Title')}
${t('manifestoArticle4Challenges')}
${t('manifestoArticle4Tools')}

## ${t('manifestoArticle5Title')}
${t('manifestoArticle5Content')}

## ${t('manifestoFinalDeclaration')}

## ${t('manifestoPostscript')}

---

## Licensing Information

${t('manifestoLicensingCode')}

${t('manifestoLicensingManifesto')}
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-4 font-inter">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
          ::-webkit-scrollbar-thumb { background: #881337; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #a8204e; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .spinner { animation: spin 1s linear infinite; }
          .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0, 0, 0, 0.75);
            display: flex; justify-content: center; align-items: center;
            z-index: 1000; backdrop-filter: blur(5px);
          }
          .modal-content {
            background: linear-gradient(to bottom, #4c1d95, #6b21a8);
            padding: 2rem; border-radius: 1rem; max-width: 90%; max-height: 90%;
            overflow-y: auto; color: white; position: relative;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5); border: 1px solid #8b5cf6;
          }
          .modal-close-button {
            position: absolute; top: 1rem; right: 1rem;
            background: none; border: none; font-size: 2rem;
            color: #d8b4fe; cursor: pointer; line-height: 1;
          }
          .image-container {
            position: relative; /* Crucial for positioning the overlay */
          }
          .image-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20%; /* Adjust height as needed */
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); /* Gradient from bottom to top */
            border-bottom-left-radius: 0.5rem; /* Match image border-radius */
            border-bottom-right-radius: 0.5rem; /* Match image border-radius */
            display: flex;
            align-items: flex-end; /* Align content to the bottom */
            justify-content: center;
            padding-bottom: 0.5rem; /* Small padding at the bottom */
            z-index: 10; /* Ensure it's above the image */
          }
          .image-overlay-text {
            font-size: 0.875rem; /* text-sm */
            font-weight: 700; /* font-bold */
            color: rgba(255,255,255,0.8); /* Slightly transparent white */
            text-shadow: 1px 1px 3px rgba(0,0,0,0.5); /* Subtle text shadow for readability */
          }
          /* Basic table styling for markdown rendering */
          .prose table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1em;
          }
          .prose th, .prose td {
            border: 1px solid #8b5cf6;
            padding: 0.5em;
            text-align: left;
          }
          .prose th {
            background-color: #6b21a8;
            font-weight: bold;
          }
          .prose tr:nth-child(even) {
            background-color: #4c1d95;
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-4 pt-4">
          ✨ {t('title')} ✨
        </h1>
        <p className="text-center text-lg mb-8 text-purple-300">{t('byline')}</p>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button
            onClick={() => setShowManifesto(true)}
            className="px-4 py-2 bg-purple-700 rounded-full hover:bg-purple-600 transition duration-300 ease-in-out shadow-md text-white text-sm w-full sm:w-auto"
          >
            {t('readManifesto')}
          </button>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out shadow-md text-white text-sm w-full sm:w-auto"
          >
            {language === 'en' ? t('spanish') : t('english')}
          </button>
        </div>

        <div className="bg-purple-800/50 rounded-xl p-6 mb-8 backdrop-blur-sm shadow-lg border border-purple-700">
          <h2 className="text-2xl font-bold mb-4 text-purple-200">{t('sacredScriptureInput')}</h2>
          <textarea
            value={bibleText}
            onChange={(e) => setBibleText(e.target.value)}
            placeholder={t('enterBibleVerses')}
            className="w-full p-4 bg-indigo-900/50 rounded-lg text-white min-h-[200px] mb-4 border border-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={handleTranslate}
              disabled={onomasticMessageLoading || !bibleText.trim()}
              className="px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {onomasticMessageLoading ? (
                  <span className="flex items-center gap-2">
                      <svg className="spinner h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('translateText').split(' ')[0]}...
                  </span>
              ) : (
                  t('translateText')
              )}
            </button>
            <div className="text-sm opacity-75 text-center sm:text-right">
              {bibleText.trim() ? t('textLoaded', { count: wordCount }) : t('noTextLoaded')}
            </div>
          </div>
        </div>

        { (onomasticMessageLoading || onomasticMessage || identifiedNames.length > 0) && (
          <div className="bg-purple-800/50 rounded-xl p-6 mb-8 backdrop-blur-sm shadow-lg border border-purple-700">

            <h2 className="text-2xl font-bold mb-4 text-purple-200">{t('sectionNames')}</h2>
            <div className="bg-indigo-900/30 rounded-lg p-4 text-base text-gray-200 border border-indigo-800 min-h-[80px] mb-6 overflow-auto max-h-[250px]">
              {onomasticMessageLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <svg className="spinner h-8 w-8 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{t('onomasticMessageLoading')}</span>
                  </div>
              ) : (
                identifiedNames.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {identifiedNames.map((item, index) => (
                      <li key={index}>
                        <span className="font-semibold text-amber-200">{item.name}</span> – "{item.meaning}"
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center italic text-gray-400">{t('noOnomasticMessageFound')}</p>
                )
              )}
            </div>

            <h2 className="text-2xl font-bold mb-4 text-purple-200">{t('sectionRawSequence')}</h2>
            <div className="bg-indigo-900/30 rounded-lg p-4 text-lg text-amber-200 italic border border-indigo-800 min-h-[100px] flex items-center justify-center text-center overflow-auto max-h-[300px] mb-6">
              {onomasticMessageLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <svg className="spinner h-8 w-8 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{t('onomasticMessageLoading')}</span>
                  </div>
              ) : (
                  identifiedNames.length === 1 && identifiedNames[0].name && identifiedNames[0].meaning ? (
                    <p className="text-center italic text-gray-400">{t('singleNameFocus', { name: identifiedNames[0].name, meaning: identifiedNames[0].meaning })}</p>
                  ) : (
                    <p>{onomasticMessage || (bibleText.trim() ? t('noOnomasticMessageFound') : t('onomasticMessagePlaceholder'))}</p>
                  )
              )}
            </div>
            <p className="text-sm text-gray-400 mt-3">
              {t('onomasticMessageExplanation')}
            </p>
          </div>
        )}

        { (onomasticMessage && !onomasticMessageLoading) && (
          <div className="bg-purple-800/50 rounded-xl p-6 mb-8 backdrop-blur-sm shadow-lg border border-purple-700">
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{t('aiInterpretationTitle')}</h2>
            <button
              onClick={handleGetInterpretation}
              disabled={aiOnomasticInterpretationLoading || aiOnomasticSummaryLoading}
              className="px-6 py-3 bg-green-600 rounded-full hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-full mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiOnomasticInterpretationLoading || aiOnomasticSummaryLoading ? (
                  <span className="flex items-center justify-center gap-2">
                      <svg className="spinner h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('getInterpretation').split(' ')[0]}...
                  </span>
              ) : (
                  t('getInterpretation')
              )}
            </button>

            <h3 className="text-xl font-bold mb-3 text-purple-300 flex items-center">
                {t('sectionFullSpiritualFlow')}
                {aiOnomasticInterpretation && (
                    <div className="flex items-center ml-3 gap-2">
                        <button
                            onClick={() => speakText(aiOnomasticInterpretation)}
                            disabled={speaking && currentUtterance && currentUtterance.text === aiOnomasticInterpretation}
                            className="px-3 py-1 bg-blue-700 rounded-full text-xs hover:bg-blue-600 transition duration-300 ease-in-out shadow-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13m-6 2l6-3m-6 3V9M3 6l6-3m0 18v-3m0-6L3 2m9 16V9" />
                            </svg>
                            {speaking && currentUtterance && currentUtterance.text === aiOnomasticInterpretation ? (paused ? t('resume') : t('pause')) : t('listenToFlow')}
                        </button>
                        {speaking && currentUtterance && currentUtterance.text === aiOnomasticInterpretation && (
                            <button
                                onClick={handleStopSpeech}
                                className="px-3 py-1 bg-red-700 rounded-full text-xs hover:bg-red-600 transition duration-300 ease-in-out shadow-sm flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                                {t('stop')}
                            </button>
                        )}
                        <button
                            onClick={handleCopyFullSpiritualFlow}
                            className="px-3 py-1 bg-gray-700 rounded-full text-xs hover:bg-gray-600 transition duration-300 ease-in-out shadow-sm flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-7 4l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            {t('copyFlow')}
                        </button>
                    </div>
                )}
                {copyFeedback && <span className="ml-2 text-sm text-green-400">{copyFeedback}</span>}
            </h3>
            <div className="bg-indigo-900/30 rounded-lg p-4 text-base text-gray-200 border border-indigo-800 min-h-[120px] mb-6 overflow-auto">
              {aiOnomasticInterpretationLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <svg className="spinner h-8 w-8 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{t('aiInterpretationLoading')}</span>
                  </div>
              ) : (
                  <p className="whitespace-pre-wrap">{aiOnomasticInterpretation || t('aiInterpretationPlaceholder')}</p>
              )}
            </div>

            <h3 className="text-xl font-bold mb-3 text-purple-300 flex items-center">
                {t('sectionSummary')}
                {aiOnomasticSummary && (
                    <div className="flex items-center ml-3 gap-2">
                        <button
                            onClick={() => speakText(aiOnomasticSummary)}
                            disabled={speaking && currentUtterance && currentUtterance.text === aiOnomasticSummary}
                            className="px-3 py-1 bg-blue-700 rounded-full text-xs hover:bg-blue-600 transition duration-300 ease-in-out shadow-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13m-6 2l6-3m-6 3V9M3 6l6-3m0 18v-3m0-6L3 2m9 16V9" />
                            </svg>
                            {speaking && currentUtterance && currentUtterance.text === aiOnomasticSummary ? (paused ? t('resume') : t('pause')) : t('listenToSummary')}
                        </button>
                        {speaking && currentUtterance && currentUtterance.text === aiOnomasticSummary && (
                            <button
                                onClick={handleStopSpeech}
                                className="px-3 py-1 bg-red-700 rounded-full text-xs hover:bg-red-600 transition duration-300 ease-in-out shadow-sm flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                                {t('stop')}
                            </button>
                        )}
                    </div>
                )}
            </h3>
            <div className="bg-indigo-900/30 rounded-lg p-4 text-base text-gray-200 border border-indigo-800 min-h-[80px] overflow-auto">
              {aiOnomasticSummaryLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <svg className="spinner h-8 w-8 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{t('aiSummaryLoading')}</span>
                  </div>
              ) : (
                  <p className="whitespace-pre-wrap">{aiOnomasticSummary || t('aiInterpretationPlaceholder')}</p>
              )}
            </div>

            {aiOnomasticInterpretation && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-3 text-purple-300 flex items-center">
                  {t('visualizeMessage')}
                </h3>
                <button
                  onClick={generateImpressionisticImage}
                  disabled={imageLoading || !aiOnomasticInterpretation}
                  className="px-6 py-3 bg-pink-600 rounded-full hover:bg-pink-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-full mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {imageLoading ? (
                      <span className="flex items-center justify-center gap-2">
                          <svg className="spinner h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('imageLoading')}
                      </span>
                  ) : (
                      t('visualizeMessage')
                  )}
                </button>

                <div className="bg-indigo-900/30 rounded-lg p-4 text-base text-gray-200 border border-indigo-800 min-h-[200px] flex items-center justify-center overflow-hidden relative image-container">
                  {imageLoading ? (
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                          <svg className="spinner h-12 w-12 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>{t('imageLoading')}</span>
                      </div>
                  ) : (
                      generatedImageUrl ? (
                          <>
                              <img src={generatedImageUrl} alt="Impressionistic representation of spiritual message" className="max-w-full h-auto rounded-lg shadow-md" />
                              <div className="image-overlay">
                                  <span className="image-overlay-text">
                                      {t('imageAppLabel')}
                                  </span>
                              </div>
                          </>
                      ) : (
                          <p className="text-center italic text-gray-400">{t('imagePlaceholder')}</p>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showManifesto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setShowManifesto(false)}
              className="modal-close-button"
              aria-label={t('closeManifesto')}
            >
              &times;
            </button>
            <h1 className="text-4xl font-bold text-center mb-4 text-purple-200">
              {t('manifestoTitle')}
            </h1>
            <p className="text-center text-lg mb-8 text-purple-300">{t('manifestoSubtitle')}</p>
            <p className="text-center text-md mb-8 text-purple-400">{t('manifestoAuthor')}</p>

            <div className="prose prose-invert max-w-none text-gray-200">
              {renderMarkdown(onomasticManifestoContent)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnochAiOnomasticTranslator;





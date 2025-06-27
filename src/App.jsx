import React, { useState, useEffect, useCallback, useRef } from 'react';
    const debounce = (func, delay) => {
      let timeout;
// ... (Your existing code before App component)

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
  const [summaryLoading, setSummaryLoading] = useState(false); // Line 660: 'setSummaryLoading' declared
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
  }, [language, currentTranslation, ttsUtterance, setTtsStatus, setTtsPlaying, setTtsUtterance]); // Added missing dependencies

  const pauseSpeech = useCallback(() => {
    if (ttsUtterance && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setTtsPlaying(false); // Update state to reflect paused
    }
  }, [ttsUtterance, setTtsPlaying]); // Added missing dependency

  const resumeSpeech = useCallback(() => {
    if (ttsUtterance && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setTtsPlaying(true); // Update state to reflect playing
    }
  }, [ttsUtterance, setTtsPlaying]); // Added missing dependency

  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setTtsPlaying(false);
      setTtsStatus('');
      setTtsUtterance(null);
    }
  }, [setTtsPlaying, setTtsStatus, setTtsUtterance]); // Added missing dependencies

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
  }, [
    inputText,
    currentTranslation,
    setOnomasticMessage, // Added missing dependencies
    setIdentifiedNamesDetails,
    setOnomasticLoading,
    setAiInterpretation,
    setAiSummary,
    setImageSrc,
  ]);

  // Debounced version of generateOnomasticMessage
  const debouncedGenerateOnomasticMessage = useCallback(
    debounce(generateOnomasticMessage, 1000), // 1000ms debounce
    [generateOnomasticMessage]
  );

  const getAiInterpretation = useCallback(async () => { // This is where line 778 was
    if (!onomasticMessage || onomasticMessage.includes("Error:") || onomasticMessage.includes("No onomastic message found")) {
      setAiInterpretation(currentTranslation.aiInterpretationPlaceholder);
      // No need to set summaryLoading here as we're returning early
      return;
    }

    setAiLoading(true);
    setSummaryLoading(true); // FIX 1: Use setSummaryLoading when starting the AI call
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
      setSummaryLoading(false); // FIX 1: Use setSummaryLoading when ending the AI call
    }
  }, [
    onomasticMessage, // Dependency for onomasticMessage
    identifiedNamesDetails, // Dependency for identifiedNamesDetails
    currentTranslation, // Dependency for currentTranslation
    setAiLoading, // Dependency for setAiLoading
    setSummaryLoading, // FIX 2: Add setSummaryLoading to dependencies
    setAiInterpretation, // Dependency for setAiInterpretation
    setAiSummary // Dependency for setAiSummary
  ]);

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
  }, [aiInterpretation, currentTranslation, setImageLoading, setImageSrc]); // Added missing dependencies


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

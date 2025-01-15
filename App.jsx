import React from "react";

export default function App() {
  const [textToTranslate, setTextToTranslate] = React.useState(null);
  const [langSelected, setLangSelected] = React.useState("french");
  const [traslatedText, setTranslatedText] = React.useState(null);
  const [showTranslation, setShowTranslation] = React.useState(false);

  const messages = [
    {
      role: "system",
      content:
        "You are a language translator. You will translate the 'User Text' in the 'Selected Language and respond with just the translated text.'",
    },
    {
      role: "user",
      content: `User Text: ${textToTranslate} & Selected Language: ${langSelected}`,
    },
  ];

  const url = import.meta.env.VITE_OPENAI_API_WORKER_URL;

  async function translateText() {
    console.log("Text to translate: ", textToTranslate);
    if (textToTranslate) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messages),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`Worker Error: ${data.error}`);
        }
        console.log("Translated text: ", data);
        setTranslatedText(data.content);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("There is no text to translate");
    }
  }

  function onChangeTextToTranslate(e) {
    setTextToTranslate(e.target.value);
  }

  function onLangOptionChange(e) {
    setLangSelected(e.target.value);
  }

  function handleSubmitTranslation(e) {
    e.preventDefault();
    translateText();
    setShowTranslation(true);
  }

  function handleClickStartOver() {
    setShowTranslation(false);
  }

  return (
    <>
      <section className="top-section">
        <div className="logo-area-container">
          <img src="./assets/parrot.png" className="logo-img" />
          <div className="logo-text-container">
            <h1 className="logo-text-main">PollyGlot</h1>
            <p className="logo-text-sub">Perfect Translation Every Time</p>
          </div>
        </div>
      </section>
      <main className="main-section">
        <div className="main-form-container">
          <form onSubmit={handleSubmitTranslation}>
            <h2 className="main-area-h2">Text to translate 👇</h2>
            <input
              onChange={onChangeTextToTranslate}
              className="translate-text-box"
              placeholder="How are you?"
              disabled={showTranslation}
            />
            {!showTranslation && (
              <> 
                <div className="lang-selection-container">
                <h2 className="main-area-h2">Select Langauge 👇</h2>
                  <div className="lang-selection">
                    <input
                      type="radio"
                      id="french"
                      name="lang"
                      value="french"
                      defaultChecked
                      onChange={onLangOptionChange}
                    />
                    <label htmlFor="french">French</label>
                    <img src="./assets/fr-flag.png" className="flag" />
                  </div>
                  <div className="lang-selection">
                    <input
                      type="radio"
                      id="spanish"
                      name="lang"
                      value="spanish"
                      onChange={onLangOptionChange}
                    />
                    <label htmlFor="spanish">Spanish</label>
                    <img src="./assets/sp-flag.png" className="flag" />
                  </div>
                  <div className="lang-selection">
                    <input
                      type="radio"
                      id="japanese"
                      name="lang"
                      value="japanese"
                      onChange={onLangOptionChange}
                    />
                    <label htmlFor="japanese">Japanese</label>
                    <img src="./assets/jpn-flag.png" className="flag" />
                  </div>
                </div>
                <button className="button">Translate</button>
              </>
            )}
          </form>
          {showTranslation && (
            <>
              <h2 className="main-area-h2">Your Translation 👇</h2>
              <div className="translated-text-box">{traslatedText}</div>
              <button className="button" onClick={handleClickStartOver}>
                Start Over
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}

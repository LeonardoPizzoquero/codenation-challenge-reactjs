import React, { useState, useEffect } from 'react';
import axios from 'axios';
import sha1 from 'js-sha1';

function App() {
  const [answer, setAnswer] = useState(null);
  const [casas, setCasas] = useState(0);
  const [cifrado, setCifrado] = useState('');
  const [decifrado, setDecifrado] = useState('');
  const [resumo, setResumo] = useState('');

  useEffect(() => {
    async function loadChallenge() {
      const response = await axios.get("https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=")
      setCasas(response.data.numero_casas);
      setCifrado(response.data.cifrado);

      const text = response.data.cifrado;

      const newText = text.split("").map((char, index) => {
        if (char !== ' ' && char !== ',' && char !== '.') {
          let current = index;

          if (text.charCodeAt(current) - casas < 97) {
            let reverse = text.charCodeAt(current) - 97;
            let casasNovas = (response.data.numero_casas - reverse) - 1;
            return char = String.fromCharCode(122 - casasNovas);
          } else {
            return char = String.fromCharCode(text.charCodeAt(current) - response.data.numero_casas);
          }
        } else {
          return char;
        }
      });

      setDecifrado(newText.join(''));
      setResumo(sha1(newText.join('')));
    }

    loadChallenge();
  }, [casas]);

  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();

    data.append('answer', answer);

    await axios.post('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=', data);
  }

  return (
    <div className="App">
      <ul>
        <li>Número de casas: {casas}</li>
        <li>Cifrado: {cifrado}</li>
        <li>Decifrado: {decifrado}</li>
        <li>Resumo: {resumo}</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="file" name="answer" onChange={e => setAnswer(e.target.files[0])}/>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;

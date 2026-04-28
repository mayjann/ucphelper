function highlightMixedWords(html, textContent) {
    const latCount = (textContent.match(/[a-zA-Z]/g) || []).length;
    const cyrCount = (textContent.match(/[а-яА-ЯёЁ]/g) || []).length;

    let targetRegex;
    if (latCount > 0 && cyrCount > 0) {
        targetRegex = latCount >= cyrCount ? /[а-яА-ЯёЁ]/g : /[a-zA-Z]/g;
    } else if (latCount > 0) { 
        targetRegex = /[а-яА-ЯёЁ]/g; 
    } else { 
        targetRegex = /[a-zA-Z]/g; 
    }

    let tokens = html.split(/(<[^>]*>)/);
    for (let i = 0; i < tokens.length; i++) {
        if (!tokens[i].startsWith('<')) {
            tokens[i] = tokens[i].replace(/([a-zA-Zа-яА-ЯёЁ]+)/g, (word) => {
                const l = (word.match(/[a-zA-Z]/g) || []).length;
                const c = (word.match(/[а-яА-ЯёЁ]/g) || []).length;
                
                if (l > 0 && c > 0) {
                    const localRegex = l >= c ? /[а-яА-ЯёЁ]/g : /[a-zA-Z]/g;
                    return word.replace(localRegex, '<span class="ucp-mixed-char">$&</span>');
                }
                
                if (word.length === 1) {
                    if (latCount > cyrCount && /[а-яА-ЯёЁ]/.test(word)) return '<span class="ucp-mixed-char">' + word + '</span>';
                    if (cyrCount > latCount && /[a-zA-Z]/.test(word)) return '<span class="ucp-mixed-char">' + word + '</span>';
                }
                return word;
            });
        }
    }
    return tokens.join('');
}

function highlightBadWords(html, badWords) {
    let tokens = html.split(/(<[^>]*>)/);
    for (let i = 0; i < tokens.length; i++) {
        if (!tokens[i].startsWith('<')) {
            badWords.forEach(bad => {
                const regex = new RegExp(`(${bad})`, 'gi');
                tokens[i] = tokens[i].replace(regex, '<span class="ucp-bad-word">$1</span>');
            });
        }
    }
    return tokens.join('');
}
const parent = document.createElement('section');
parent.className = "concrete";
document.currentScript.parentElement.append(parent);

const getStyles = (key) => 
{
    let className = "";
    let id = false;
    let tagName = null;
    let href = "";
    let aria = "true";
    switch (key) 
    {
        case 'https://':
        case '../':
        case './':
            className = "link";
            tagName = "a";
            href = key;
            break;
        case '@':
            className = "link";
            tagName = "a";
            href = "#";
            break;
        case '#':
            className = "anchor";
            tagName = "a";
            href = "#";
            id = true;
            break;
//        case '>':
//            tagName = "code";
//            break;
        case '|':
            tagName = "blockquote"
            break;
        case '*':
            className = "bold";
            tagName = "span";
            break;
        case ':)':
            className = "smiley";
            break;
        default:
            aria = "undefined";
            break;
    }
    let element;
    if (tagName)
    {
        const keyElement = document.createElement("span");
        keyElement.className = "markup";
//        keyElement.aria-hidden = aria;
        keyElement.append(key);

        const valueElement = document.createElement(tagName);
        valueElement.className = className;                          

        element = { keyElement, valueElement, href, id };
    }
    return element;
};
const parseConcrete = (area) => 
{
//    autoGrow(area)
    const text = area.value
    parent.textContent = ''
    const lines = text.split('\n');
    for(let line of lines) 
    {
        const paragraph = document.createElement('div');
        paragraph.className = "line";
        parent.append(paragraph);
                
        let lineElement = paragraph;
        const words = line.split(' ');
        let chunk = line;
        let isFirst = true;
        for(let word of words)
        {
            let count = 0;
            for(let letter of chunk)
            {
                if (letter === ' ')
                {
                    count++;
                    lineElement.append(' ');
                }
                else
                {
                    chunk = chunk.slice(count);
                    chunk = chunk.slice(word.length);
                    break;
                }
            }
            
            if (isFirst && word !== '')
            {
                isFirst = false;
                const lineStyles = getStyles(word);
                if (lineStyles) 
                {
                    paragraph.append(lineStyles.keyElement);
                    paragraph.append(lineStyles.valueElement);
                    lineElement = lineStyles.valueElement;
                    continue;
                }
            }
            const https = 'https://';
            const dotDotSlash = '../';            
            const dotSlash = './';
            let wordStyles;
            if (word.startsWith(https))
            {
                wordStyles = getStyles(https);
            } 
            else if (word.startsWith(dotDotSlash))
            {
                wordStyles = getStyles(dotDotSlash);
            }
            else if (word.startsWith(dotSlash))
            {
                wordStyles = getStyles(dotSlash);
            }
            else
            {
                wordStyles = getStyles(word.charAt());
            }
            if (wordStyles) 
            {
                lineElement.append(wordStyles.keyElement);
                lineElement.append(wordStyles.valueElement);
                if (wordStyles.href !== "")
                {
                    word = word.slice(wordStyles.href.length);
                    wordStyles.valueElement.href = wordStyles.href + word;
                    if (wordStyles.id) 
                    {
                        wordStyles.valueElement.id = word;
                    }
                }
                else
                {
                    word = word.slice(1);
                }
                wordStyles.valueElement.append(word);
            }
            else
            {
                lineElement.append(word);
            }
        }
    }
};

function autoGrow (oField) {
  if (oField.scrollHeight > oField.clientHeight) {
    oField.style.height = oField.scrollHeight + "px";
  }
}
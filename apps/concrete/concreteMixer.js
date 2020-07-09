const parent = document.createElement('section');
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
        case '+':
            className = "bold";
            tagName = "span";
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
const parseConcrete = (text) => 
{
    const lines = text.split('\n');
    for(let line of lines) 
    {
        const paragraph = document.createElement('div');
        paragraph.className = "line";
        parent.append(paragraph);
                
        let lineElement = paragraph;
        const words = line.split(' ');
        let chunk = line;
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
            
            if (word === words[0])
            {
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
            let wordStyles;
            if (word.startsWith(https))
            {
                wordStyles = getStyles(https);
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
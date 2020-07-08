const parent = document.createElement('section');
document.currentScript.parentElement.append(parent);

const getStyles = (key) => 
{
    let className = "";
    let id = null;
    let tagName = null;
    let href = null;
    let aria = "true";
    switch (key) 
    {
        case '@':
            className = "link";
            tagName = "a";
            href = "";
            break;
        case '#':
            className = "anchor";
            tagName = "a";
            href = "#";
            id = "";
            break;
        case '>':
            tagName = "code";
            break;
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
        keyElement.className = "styled";
//        keyElement.aria-hidden = aria;
        keyElement.append(key);

        const valueElement = document.createElement(tagName);
        valueElement.className = className;
        valueElement.id = id;
        valueElement.href = href;                            

        element = { keyElement, valueElement };
    }
    return element;
};
const parseConcrete = (text) => 
{
    const lines = text.split('\n');
    for(let line of lines) 
    {
        const paragraph = document.createElement('p');
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
            
            const wordStyles = getStyles(word.charAt());
            if (wordStyles) 
            {
                lineElement.append(wordStyles.keyElement);
                lineElement.append(wordStyles.valueElement);
                wordStyles.valueElement.append(word.slice(1));
                if (wordStyles.valueElement.href) wordStyles.valueElement.href += word.slice(1);
                if (wordStyles.valueElement.id) wordStyles.valueElement.id = word.slice(1);
            }
            else
            {
                lineElement.append(word);
            }
        }
    }
};
/**
 * highlite.js - Hafif ve Güvenli Kod Renklendirme Kütüphanesi
 */

const highLiteRules = {
    html: {
        comm: /(&lt;!--[\s\S]*?--&gt;)/g,                    // Yorumlar
        tags: /(&lt;\/?)([\w-]+)/g,                          // Etiket isimleri: <div>, </a>
        attn: /(\s)([\w-]+)(?==)/g,                          // Attribute isimleri: href, data-test-id
        attv: /(=")([^"]*)(")/g,                             // Attribute değerleri (tırnak içleri)
        angl: /(&lt;|&gt;)/g,                                // < ve >
        enti: /(&amp;[a-zA-Z0-9#]+;)/g,                      // Entity'ler: &amp;, &lt;
        equa: /(=)/g                                         // = işareti (isteğe bağlı ayrı renk)
    },
    css: {
        comm: /(\/\*[\s\S]*?\*\/)/g,                         // Yorumlar
        sele: /([.#]?[\w-]+)(?=\s*\{)/g,                     // Selector: .class, #id, tag
        atRule: /(@[\w-]+)/g,                                // @media, @keyframes vb.
        prop: /([\w-]+)(?=\s*:)/g,                           // Property isimleri
        valu: /(:)\s*([^;{}]+)(?=[;}])/g,                     // Değerler (: den sonra)
        func: /(\w+)\(/g,                                    // Fonksiyonlar: rgb(, calc(
        hexc: /#([0-9a-fA-F]{3,8})\b/g,                      // Hex renkler
        numb: /\b\d+(\.\d+)?(%|px|em|rem|vw|vh|deg|s|ms)?\b/g,
        punc: /([{};:])/g                                    // Noktalama
    },
    js: {
        comm: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,              // Yorumlar
        str: /(".*?(?<!\\)"|'.*?(?<!\\)'|`[\s\S]*?`)/g,       // String'ler (template literal dahil)
        keyw: /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield|async|await)\b/g,
        func: /\b([A-Z_a-z]\w*)\s*(?=\()/g,                  // Fonksiyon çağrıları ve tanımları
        bool: /\b(true|false|null|undefined)\b/g,
        numb: /\b\d+(\.\d+)?([eE][+-]?\d+)?\b/g,
        oper: /([+\-*/%=&|!<>?:]+|===|!==|&&|\|\||=>)/g,
        punc: /([{}[\]();,])/g
    },
    php: {
        php: /(&lt;\?php|\?&gt;)/g,
        comm: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g,
        vari: /(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g,
        str: /(".*?(?<!\\)"|'.*?(?<!\\)')/g,
        keyw: /\b(array|as|break|case|class|const|continue|default|die|do|echo|else|elseif|empty|endif|endforeach|endwhile|eval|exit|extends|for|foreach|function|global|if|include|isset|list|new|print|require|return|static|switch|unset|use|var|while)\b/g,
        func: /\b(\w+)(?=\s*\()/g,
        numb: /\b\d+(\.\d+)?\b/g,
        oper: /([+\-*/%.=<>!&|]+)/g,
        punc: /([{}[\]();,])/g
    },
    json: {
        prop: /("[\w-]+")\s*(?=:)/g,                         // Property isimleri
        str: /("\s*[^"]*\s*")/g,                             // String değerler
        numb: /(:)\s*(-?\d+(\.\d+)?([eE][+-]?\d+)?)/g,
        bool: /(:)\s*(true|false|null)/g,
        punc: /([{}[\],:])/g
    },
    python: {
        comm: /(#.*$)/gm,
        str: /("(""|')?.*?(?<!\\)\2"|'.*?(?<!\\)')/gs,
        keyw: /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|True|False|None)\b/g,
        func: /(def|class)\s+(\w+)/g,                        // def func_name ve class ClassName
        builtin: /\b(len|range|print|open|list|dict|set|tuple|str|int|float|bool|sum|max|min|sorted)\b/g,
        numb: /\b\d+(\.\d+)?([eE][+-]?\d+)?\b/g,
        oper: /([+\-*/%@=<>!&|^~]+|\/\/)/g,
        punc: /([{}[\]();,:])/g
    },
    bash: {
        sheb: /^(#!.*)/gm,
        comm: /(#.*$)/gm,
        vari: /(\$[a-zA-Z0-9_]+|\${[^}]+})/g,
        str: /(".*?(?<!\\)"|'.*?')/g,
        cmd: /\b(cd|ls|pwd|mkdir|rm|cp|mv|touch|echo|cat|grep|sed|awk|find|chmod|chown|sudo|git|npm|yarn|docker|kubectl)\b/g,
        oper: /([&|;><]+|\|\|&&)/g,
        punc: /([{}[\]();])/g
    },
    sql: {
        comm: /(--.*$|\/\*[\s\S]*?\*\/)/gm,
        keyw: /\b(SELECT|FROM|WHERE|INSERT|INTO|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|DATABASE|INDEX|VIEW|JOIN|INNER|LEFT|RIGHT|FULL|ON|AND|OR|NOT|AS|IS|NULL|LIKE|IN|BETWEEN|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|VALUES|SET)\b/gi,
        func: /\b(COUNT|SUM|AVG|MAX|MIN|UPPER|LOWER|TRIM|CONCAT|SUBSTR|REPLACE|NOW|CURDATE|DATE_FORMAT)\b/gi,
        str: /('.*?')/g,
        numb: /\b\d+(\.\d+)?\b/g,
        oper: /([=<>!]+|<>)/g,
        punc: /([();,])/g
    },
    java: {
        comm: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,
        anno: /(@[A-Za-z]+(\.[A-Za-z]+)*)/g,
        keyw: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|synchronized|super|switch|this|throw|throws|transient|try|void|volatile|while)\b/g,
        str: /(".*?(?<!\\)")/g,
        numb: /\b\d+(\.\d+)?([eE][+-]?\d+)?[fFdD]?\b/g,
        func: /\b(\w+)(?=\s*\()/g,
        oper: /([+\-*/%=&|!<>?:]+|>>>?|<<|>>)/g,
        punc: /([{}[\]();,])/g
    },
    markdown: {
        heading: /^(#{1,6})\s+(.+)$/gm,                      // Başlıklar: #, ##, ###
        bold: /(\*\*|__)(.*?)\1/g,                          // Kalın: **text** veya __text__
        italic: /(\*|_)(?!\1)(.*?)\1/g,                     // İtalik: *text* veya _text_
        strikethrough: /(~~)(.*?)\1/g,                      // Üstü çizili: ~~text~~
        codeInline: /(`)([^`]+)\1/g,                        // Satır içi kod: `code`
        codeBlock: /(```[\s\S]*?\n)([\s\S]*?)(\n```)/g,     // Kod bloğu: ```lang\ncode\n```
        blockquote: /^(>.*)$/gm,                            // Alıntı: > text
        link: /(\[([^\]]+)\])(\()([^)]+)(\))/g,             // Bağlantı: [text](url)
        image: /(!\[([^\]]+)\])(\()([^)]+)(\))/g,           // Resim: ![alt](src)
        listItem: /^(\s*)([-*+]|\d+\.)\s+(.+)$/gm,          // Liste öğeleri
        horizontal: /^(---|\*\*\*|___)$/gm,                 // Yatay çizgi
        table: /(\|.*\|.*\n)((?:\|.*\|.*\n)*)/g,            // Tablolar
        taskList: /(\[[ xX]\])\s+(.+)/g,                    // Görev listesi: [x] [ ]
        highlight: /(==)(.*?)\1/g,                          // Vurgu: ==text==
        superscript: /(\^)([^^]+)\1/g,                      // Üst simge: ^text^
        subscript: /(~)([^~]+)\1/g,                         // Alt simge: ~text~
        emoji: /(:[\w+-]+:)/g,                              // Emoji: :smile:
        mention: /(@[\w.-]+)/g,                             // Kullanıcı etiketleme: @user
        hashtag: /(#[\w-]+)/g,                              // Hashtag: #tag
        escaped: /(\\)([\\`*_{}\[\]()#+\-.!>])/g            // Kaçan karakterler
    },
};
/**
 * Ana Renklendirme Motoru
 */
function applyHighlight(txt, lang) {
    if (!highLiteRules[lang]) return txt;
    let html = txt;
    const rules = highLiteRules[lang];
    const tokenStore = {};
    let tIdx = 0;

    // 1. ADIM: Maskeleme (Önce özel kuralları boya ve gizle)
    Object.keys(rules).forEach(key => {
        html = html.replace(rules[key], (match) => {
            if (match.includes('__HL_')) return match; // maskelenmişse dokunma
            const token = `__HL_${tIdx}__`;
            tokenStore[token] = `<span class="${lang}-${key}">${match}</span>`;
            tIdx++;
            return token;
        });
    });

    // 2. ADIM: Tokenleri Geri Yükle
    Object.keys(tokenStore).forEach(token => {html = html.split(token).join(tokenStore[token]);});
    
    // 3. ADIM: Etiketlerin içindeki karakterleri bozmamak için negatif lookahead kullanılır.
    html = html.replace(/(&lt;|&gt;)(?![^<]*>)/g, `<span class="hl-angled">$1</span>`);
    html = html.replace(/(\{|\})(?![^<]*>)/g, `<span class="hl-curly">$1</span>`);
    return html;
}

/**
 * Statik ve Dinamik Elemanları Başlatıcı
 */
function highLiteAll() {
    // 1. Statik Kod Blokları (<code data-lang="html"> gibi)
    document.querySelectorAll('code[data-lang]').forEach(el => {
        if (!el.classList.contains('highlited')) {
            const lang = el.getAttribute('data-lang');
            el.innerHTML = applyHighlight(el.innerHTML, lang);
            el.classList.add('highlited');
        }
    });

    // 2. ContentEditable yapısı (opsiyonel)
    document.querySelectorAll('.highLite_editable').forEach(el => {
        const lang = el.dataset.lang || 'html';
        const overlay = el.previousElementSibling;
        if (overlay) {
            overlay.innerHTML = applyHighlight(el.innerHTML, lang);
        }
    });
}

document.addEventListener("DOMContentLoaded", highLiteAll);

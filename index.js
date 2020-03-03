const $mainContainer = "#livePreview .rteToolbarContainer";
const customClData = "data-coderslab-plugin";
const notSelector = `not([${customClData}])`;

/**
 * GitHub styles for code
 */
const styles = {
  ".hljs-comment,.hljs-quote": { color: "#998", fontStyle: "italic" },
  ".hljs-keyword,.hljs-selector-tag,.hljs-subst": {
    color: "#333",
    fontWeight: "bold"
  },
  ".hljs-number,.hljs-literal,.hljs-variable,.hljs-template-variable,.hljs-tag .hljs-attr": {
    color: "teal"
  },
  ".hljs-string,.hljs-doctag": { color: "#d14" },
  ".hljs-title,.hljs-section,.hljs-selector-id": {
    color: "#900",
    fontWeight: "bold"
  },
  ".hljs-subst": { fontWeight: "normal" },
  ".hljs-type,.hljs-class .hljs-title": { color: "#458", fontWeight: "bold" },
  ".hljs-tag,.hljs-name,.hljs-attribute": {
    color: "navy",
    fontWeight: "normal"
  },
  ".hljs-regexp,.hljs-link": { color: "#009926" },
  ".hljs-symbol,.hljs-bullet": { color: "#990073" },
  ".hljs-built_in,.hljs-builtin-name": { color: "#0086b3" },
  ".hljs-meta": { color: "#999", fontWeight: "bold" },
  ".hljs-deletion": { background: "#fdd" },
  ".hljs-addition": { background: "#dfd" },
  ".hljs-emphasis": { fontStyle: "italic" },
  ".hljs-strong": { fontWeight: "bold" }
};

/**
 * Find all available inputs
 * and create buttons when needed
 */
function findInputs() {
  setTimeout(() => {
    const $inputs = document.querySelectorAll(
      `${$mainContainer} .rte[id*=editTitle]:${notSelector}, ${$mainContainer} .rte[id*=newChoice]:${notSelector}`
    );

    $inputs.forEach($input => {
      $input.setAttribute(customClData, true);
      createButtons($input.parentElement);
    });

    findInputs();
  }, 1000);
}

/**
 * Create buttons below input
 * @param {Node} parentElement
 */
function createButtons(parentElement) {
  const btns = ["HTML", "JS", "CSS", "SCSS", "Java", "Python", "SQL"];
  btns.forEach(btn => {
    const $btn = document.createElement("a");
    $btn.href = "#";
    $btn.innerText = btn;
    $btn.id = "coderslab-plugin-code-format";
    $btn.style =
      "color: #FF5722;text-decoration: none;display: inline-block;padding: 2px 3px;background-color: #e9e9e9;margin: 0 4px;border-radius: 4px;";
    parentElement.append($btn);
  });
}

/**
 * Event function [click]
 * Reacts when user is clicking on prepared button
 * @param {Object} e
 */
function codeFormatButton(e) {
  if (e.target.id.includes("coderslab-plugin-code-format")) {
    e.preventDefault();
    const $btn = e.target;
    const lang = $btn.innerText;

    const selectedText = getSelText();
    let result = hljs.highlight(lang, selectedText.trim());
    const code = `<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: #f0f0f0; color: #444444;">${result.value}</pre>`;

    // Creating proper HTML element from string
    let resultHtml = createElementFromHTML(code);

    // Add styles to elements [style attr]
    for (let query in styles) {
      const style = styles[query];
      resultHtml.querySelectorAll(query).forEach(el => {
        for (let prop in style) {
          el.style[prop] = style[prop];
        }
      });
    }
    

    /**
     * Find input of selected text
     * Replace selected text with styled code
     * Inject code to input
     */
    const $input = $btn.parentElement.querySelector(".rte");
    let inputText = $input.innerText;
    const finalHTML = inputText.replace(selectedText, "");
   
    $input.innerHTML += "\n\n" + resultHtml.outerHTML;
  }
}

/**
 * Method allows to create elements from string
 * @param {*} htmlString
 * @returns {Node}
 */
function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

/**
 * Get selected text
 * @returns {string}
 */
function getSelText() {
  let txt = "";
  if (window.getSelection) {
    txt = window.getSelection();
  } else if (document.getSelection) {
    txt = document.getSelection();
  } else if (document.selection) {
    txt = document.selection.createRange().text;
  }

  return txt.toString();
}

// Init
findInputs();
document.addEventListener("click", codeFormatButton);
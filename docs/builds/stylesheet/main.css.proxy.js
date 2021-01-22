// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "body{height:100%;width:100%;background-color:#4cb382;margin:0px;padding:0px}#webgl_canvas{position:absolute;z-index:1}.control_panel{position:absolute;top:3rem;left:3rem;z-index:2}.parallel_effect img[name=building]{left:0;right:0;margin-left:auto;margin-right:auto;width:70rem;position:absolute}.parallel_effect img[name=falling_tree]{left:0;right:0;margin-left:auto;margin-right:auto;max-width:50rem;position:absolute}.parallel_effect .parallel_holder{position:absolute;left:20%;top:20%}.parallel_effect .parallel_holder img[name=miko]{position:relative;display:block;left:5rem}.slide_panel[data-visibility=true]{visibility:visible}.slide_panel[data-visibility=false]{visibility:hidden}.slide_panel[name=touhou_6]{position:absolute;max-width:50rem;left:0;right:0;margin-left:auto;margin-right:auto;bottom:15rem}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
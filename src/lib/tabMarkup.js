/**
 * Build the standalone HTML markup for the tab generator.
 * @param {string[]} labels
 * @param {string[]} contents
 * @param {number} activeIndex
 */
export function buildStandaloneMarkup(labels, contents, activeIndex) {
  const buttonsHTML = labels
    .map((label, i) => `
        <button 
          id="tab-${i + 1}" 
          role="tab" 
          aria-selected="${i === activeIndex ? "true" : "false"}" 
          aria-controls="panel-${i + 1}" 
          data-role="tab-btn" 
          tabindex="${i === activeIndex ? 0 : -1}" 
          style="
            background-color: ${i === activeIndex ? "#ddd" : "#f5f5f5"};
            padding: 10px 16px;
            border: none;
            cursor: pointer;
            border-radius: 6px 6px 0 0;
            margin-right: 4px;
            font-weight: ${i === activeIndex ? "600" : "400"};
          "
          onclick="activateTab('panel-${i + 1}', this)"
        >
          ${label}
        </button>
      `)
    .join("");

  const panelsHTML = contents
    .map((content, i) => `
        <div 
          id="panel-${i + 1}" 
          role="tabpanel" 
          aria-labelledby="tab-${i + 1}" 
          tabindex="${i === activeIndex ? 0 : -1}"
          data-role="tab-pane" 
          style="
            display: ${i === activeIndex ? "block" : "none"};
            padding: 20px;
            border: 1px solid #e5e5e5;
            border-top: none;
            font-family: Arial, sans-serif;
            border-radius: 0 0 8px 8px;
            background: white;
          "
        >
          ${content}
        </div>
      `)
    .join("");

  const scriptBlock = `
<script>
(function() {
  function activateTab(id, clickedBtn) {
    document.querySelectorAll('[data-role="tab-pane"]').forEach(pan => {
      pan.style.display = 'none';
      pan.setAttribute('tabindex', '-1');
    });
    document.querySelectorAll('[data-role="tab-btn"]').forEach(btn => {
      btn.style.backgroundColor = '#f5f5f5';
      btn.style.fontWeight = '400';
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    });
    const panel = document.getElementById(id);
    if (!panel) return;
    panel.style.display = 'block';
    panel.setAttribute('tabindex', '0');
    clickedBtn.style.backgroundColor = '#ddd';
    clickedBtn.style.fontWeight = '600';
    clickedBtn.setAttribute('aria-selected', 'true');
    clickedBtn.setAttribute('tabindex', '0');
    clickedBtn.focus();
  }
  window.activateTab = activateTab;
  document.addEventListener('keydown', function(e) {
    const focused = document.activeElement;
    if (!focused) return;
    if (focused.getAttribute('data-role') !== 'tab-btn') return;
    const tabs = Array.from(document.querySelectorAll('[data-role="tab-btn"]'));
    let index = tabs.indexOf(focused);
    if (index === -1) return;
    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        index = (index + 1) % tabs.length;
        tabs[index].click();
        tabs[index].focus();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        index = (index - 1 + tabs.length) % tabs.length;
        tabs[index].click();
        tabs[index].focus();
        break;
      case 'Home':
        e.preventDefault();
        tabs[0].click();
        tabs[0].focus();
        break;
      case 'End':
        e.preventDefault();
        tabs[tabs.length - 1].click();
        tabs[tabs.length - 1].focus();
        break;
    }
  });
})();
</script>
`.trim();

  const finalOutput = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto;">
  <div role="tablist" style="border-bottom: 1px solid #e5e5e5;">
    ${buttonsHTML}
  </div>
  ${panelsHTML}
</div>
${scriptBlock}
`.trim();

  return finalOutput;
}

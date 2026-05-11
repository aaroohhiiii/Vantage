(function() {
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  const auditId = currentScript.getAttribute('data-audit-id');
  const host = currentScript.getAttribute('data-host') || 'https://vantage.sh';

  if (!auditId) {
    console.error('Vantage Widget: data-audit-id is required');
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = `${host}/embed/${auditId}`;
  iframe.style.width = '100%';
  iframe.style.maxWidth = '350px';
  iframe.style.height = '420px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '12px';
  iframe.style.overflow = 'hidden';
  iframe.scrolling = 'no';
  
  currentScript.parentNode.insertBefore(iframe, currentScript);
})();

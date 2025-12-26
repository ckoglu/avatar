// generate.js
// Bu dosya sadece UI kontrolü yapar, avatar render etmez

class ProfilAppExtended {
  constructor() {
    this.kaydetKod = '';
    this.isim = ['Arka Plan', 'Yüz', 'Ten', 'Saç', 'Göz', 'Ağız', 'Aksesuar', 'Sakal', 'Kıyafet', 'Kıyafet Rengi'];
    this.currentPopupIndex = -1;
    this.WHITE = '#ffffff';
    this.BLACK = '#000000';
    this.secenekler = [
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'y','z','A','B'],
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      ['-','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'y', 'z', 'x', 'q', 'w', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'],
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
      ['-', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
      ['-', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'y', 'z', 'x', 'q'],
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'y'],
    ];
    this.urlParams = new URLSearchParams(window.location.search);
    this.pathObjects = window.pathObjects || { bg, yuz, ten, sac, goz, agiz, aks, sakal, govde, grenk };
  }

  init() {
    this.kodYukle();
    this.createControls();
    this.setupEventListeners();
    this.updateCodeDisplay();
    this.setupSettingsListeners();
    this.setupManualCodeInput();
    this.updateApiCodeSamples();
    window.app = this;
    setTimeout(() => this.updateHtmlCode(), 100);
  }

  setupManualCodeInput() {
    const codeDisplay = document.getElementById('code-display');
    if (codeDisplay) {
      codeDisplay.addEventListener('input', (e) => {
        const code = e.target.value;
        if (code.length === 10 && this.isValidCode(code)) {
          this.kaydetKod = code;
          const element = document.querySelector('[avatar]');
          if (element) {
            element.setAttribute('avatar', code);
            this.updateAvatar();
            this.updateAllButtonPreviews();
            this.updateHtmlCode();
            this.updateApiCodeSamples(); 
            this.updateURL();
          }
        }
      });
      
      codeDisplay.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const code = e.target.value;
          if (code.length === 10 && this.isValidCode(code)) {
            this.kaydetKod = code;
            const element = document.querySelector('[avatar]');
            if (element) {
              element.setAttribute('avatar', code);
              this.updateAvatar();
              this.updateAllButtonPreviews();
              this.updateHtmlCode();
              this.updateApiCodeSamples();
              this.updateURL();
            }
          }
        }
      });
    }
  }

  updateApiCodeSamples() {
    const avatarElement = document.querySelector('[avatar]');
    if (!avatarElement) return;
    const avatarCode = avatarElement.getAttribute('avatar') || this.kaydetKod;
    const size = avatarElement.getAttribute('size') || '200';
    const radius = avatarElement.getAttribute('radius') || '25';
    const line = avatarElement.getAttribute('line') || '10';
    const apiUrl = `https://avatar.ckoglu.workers.dev/?size=${size}&radius=${radius}&line=${line}&code=${avatarCode}.svg`;
    // 1. API URL input'unu güncelle
    const apiUrlInput = document.getElementById('apiUrlInput');
    if (apiUrlInput) {apiUrlInput.value = apiUrl;}
    const cssCodeElement = document.getElementById('apiCssCode');
    if (cssCodeElement) {
      const cssCode = `.avatar {\n  width: ${size}px;\n  height: ${size}px;\n  background-image: url('${apiUrl}');\n  background-size: contain;\n  border-radius: ${radius}px;\n}`;
      cssCodeElement.textContent = cssCode;
      if (typeof applyHighlight === 'function') {
        cssCodeElement.innerHTML = applyHighlight(cssCode, 'css');
        cssCodeElement.classList.add('highlited');
      }
    } else {
      console.error('CSS code elementi bulunamadı. ID: apiCssCode');
    }
    
    const htmlCodeElement = document.getElementById('apiHtmlCode');
    if (htmlCodeElement) {
      const htmlCode = `&lt;img src=&quot;${apiUrl}&quot; width=&quot;${size}&quot; height=&quot;${size}&quot; alt=&quot;Avatar&quot;>`;
      htmlCodeElement.textContent = htmlCode;
      if (typeof applyHighlight === 'function') {
        htmlCodeElement.innerHTML = applyHighlight(htmlCode, 'html');
        htmlCodeElement.classList.add('highlited');
      }
    } else {
      console.error('HTML code elementi bulunamadı. ID: apiHtmlCode');
    }
    
    // 4. Markdown kodunu güncelle
    const markdownCodeElement = document.getElementById('apiMarkdownCode');
    if (markdownCodeElement) {
      const markdownCode = `![Avatar](${apiUrl})`;
      markdownCodeElement.textContent = markdownCode;
      if (typeof applyHighlight === 'function') {
        markdownCodeElement.innerHTML = applyHighlight(markdownCode, 'markdown');
        markdownCodeElement.classList.add('highlited');
      }
    }
    const apiBtn = document.getElementById('api-btn');
    if (apiBtn) {apiBtn.setAttribute('onclick', `apiBlank(this);`);}
  }

  kodYukle() {
    // URL'den kod oku
    const codeFromURL = this.urlParams.get('code');
    if (codeFromURL && this.isValidCode(codeFromURL)) {
      this.kaydetKod = codeFromURL;
      const element = document.querySelector('[avatar]');
      if (element) {
        element.setAttribute('avatar', codeFromURL);
        this.updateAvatar(); 
        this.updateAllButtonPreviews();
        this.updateURL(); 
      }
    } else {
      const dataElement = document.querySelector('[avatar]');
      let avatarCode = dataElement ? dataElement.getAttribute('avatar') : '';
      if (avatarCode && avatarCode.length === 10 && this.isValidCode(avatarCode)) {
        this.kaydetKod = avatarCode;
      } else {
        this.kodUret(); // URL'de ve DOM'da yoksa üret
      }
    }
  }

  kodUret() {
    const randomCode = this.secenekler.map(secenekler => secenekler[Math.floor(Math.random() * secenekler.length)]).join('');
    this.kaydetKod = randomCode;
    const element = document.querySelector('[avatar]');
    if (element) {
      element.setAttribute('avatar', randomCode);
      this.updateAvatar();
      this.updateAllButtonPreviews();
      this.updateCodeDisplay();
      this.updateHtmlCode();
      this.updateApiCodeSamples(); 
    }
    this.updateURL();
  }

  basamakGuncelle(index, value) {
    const codeArray = this.kaydetKod.split('');
    codeArray[index] = value;
    this.kaydetKod = codeArray.join('');
    const element = document.querySelector('[avatar]');
    if (element) {
      element.setAttribute('avatar', this.kaydetKod);
      this.updateAvatar();
      this.updateButtonPreview(index, value);
      this.updateOptionSelection(index, value);
      this.updateCodeDisplay();
      this.closePopup();
      this.updateHtmlCode();
      this.updateApiCodeSamples();
      this.updateURL();
    }
  }

  updateAvatar() {
    const element = document.querySelector('[avatar]');
    if (!element) return;
    if (window.avatarApp && typeof window.avatarApp.SVG === 'function') {
      window.avatarApp.SVG(this.kaydetKod.split(''), element);
      element.innerHTML = window.avatarApp.kisi.svg;
    }
    else if (this.pathObjects && typeof this.SVG === 'function') {
      this.SVG(this.kaydetKod.split(''), element);
      element.innerHTML = this.kisi ? this.kisi.svg : '';
    }
  }

  updateAvatarFromSettings() {
    const element = document.querySelector('[avatar]');
    const sizeInput = document.getElementById('size-input');
    const radiusInput = document.getElementById('radius-input');
    const lineInput = document.getElementById('line-input');
    if (element && sizeInput && radiusInput && lineInput) {
      element.setAttribute('size', sizeInput.value);
      element.setAttribute('radius', radiusInput.value);
      element.setAttribute('line', lineInput.value);
      this.updateAvatar();
      this.updateHtmlCode();
      this.updateApiCodeSamples();
      this.updateURL();
    }
  }

  updateURL() {
    const element = document.querySelector('[avatar]');
    if (!element) return;
    const params = new URLSearchParams(window.location.search);
    params.set('code', this.kaydetKod);
    params.set('size', element.getAttribute('size') || '200');
    params.set('radius', element.getAttribute('radius') || '25');
    params.set('line', element.getAttribute('line') || '10');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }

  getPreviewHTML(index, option) {
    const pathNames = ['bg', 'yuz', 'ten', 'sac', 'goz', 'agiz', 'aks', 'sakal', 'govde', 'grenk'];
    const pathType = pathNames[index];
    const path = this.pathObjects[pathType] ? this.pathObjects[pathType][option] : '';
    let inner = '';
    
    if (['bg', 'grenk', 'ten'].includes(pathType)) {
      const color = this.pathObjects[pathType] ? this.pathObjects[pathType][option] : this.WHITE;
      inner = `<div class="color-swatch" style="background: ${color}"></div>`;
    } else {
      let svgContent = '';
      switch(pathType) {
        case 'goz': svgContent = `<svg viewBox="0 0 120 120"><g transform="translate(-120, -70)">${path}</g></svg>`; break;
        case 'agiz': svgContent = `<svg viewBox="0 0 50 50"><g fill="none" transform="translate(-155, -155)">${path}</g></svg>`; break;
        case 'aks': svgContent = `<svg viewBox="0 0 300 300"><g transform="translate(0, 0)">${path}</g></svg>`;break;
        case 'sakal': svgContent = `<svg viewBox="0 0 150 150"><g transform="translate(-90, -90)">${path}</g></svg>`; break;
        case 'sac': svgContent = `<svg viewBox="0 0 300 300"><g stroke="${this.BLACK}">${path}</g></svg>`; break;
        case 'yuz': svgContent = `<svg viewBox="0 0 300 300"><g fill="${this.WHITE}" stroke-width="1" transform="translate(0, 0)" stroke="${this.BLACK}">${path}</g></svg>`; break;
        case 'govde': svgContent = `<svg viewBox="0 0 300 300"><g fill="${this.WHITE}" transform="translate(5, -30)">${path}</g></svg>`; break;
        default: svgContent = `<svg viewBox="0 0 300 300"><g stroke="${this.BLACK}">${path}</g></svg>`;
      }
      inner = `<div class="preview-svg">${svgContent}</div>`;
    }
    return inner;
  }

  getButtonHTML(index) {
    const currentValue = this.kaydetKod[index] || '';
    const preview = this.getPreviewHTML(index, currentValue);
    return `<div class="control-button-wrapper" data-index="${index}"><button class="control-button" data-index="${index}" data-tooltip="${this.isim[index].toLocaleLowerCase()}">${preview}</button></div>`;
  }

  getPopupHTML(index) {
    const optionsHTML = this.secenekler[index].map(option => {
      const preview = this.getPreviewHTML(index, option);
      const isSelected = this.kaydetKod[index] === option;
      return `<div class="option-item ${isSelected ? 'selected' : ''}" data-value="${option}"><div class="option-preview">${preview}</div></div>`;
    }).join('');
    
    return `<div class="popup-overlay floating-popup" id="popup-${index}" style="display: none;">
              <div class="popup-content" style="min-width: 320px;">
                <div class="popup-header">
                  <h3>${this.isim[index].toLocaleLowerCase()}</h3>
                  <data size="0.9" class="popup-close" data-tooltip="kapat"><i icon="close" class="popup-close"></i></data>
                </div>
                <div class="options-grid" id="options-${index}">${optionsHTML}</div>
              </div>
            </div>`;
  }

  createControls() {
    const container = document.getElementById('controls-container');
    if (!container) return;
    this.isim.forEach((_, index) => {container.innerHTML += this.getButtonHTML(index);});
    this.isim.forEach((_, index) => {document.body.insertAdjacentHTML('beforeend', this.getPopupHTML(index));});
  }

  updateOptionSelection(index, selectedValue) {
    const optionsGrid = document.getElementById(`options-${index}`);
    if (!optionsGrid) return;
    optionsGrid.querySelectorAll('.option-item').forEach(item => {item.classList.remove('selected');});
    const selectedOption = optionsGrid.querySelector(`[data-value="${selectedValue}"]`);
    if (selectedOption) {selectedOption.classList.add('selected');}
  }

  togglePopup(index) {
    const button = document.querySelector(`.control-button[data-index="${index}"]`);
    const popup = document.getElementById(`popup-${index}`);
    if (!button || !popup) return;
    document.querySelectorAll('.popup-overlay.active').forEach(p => {
      if (p !== popup) {
        p.classList.remove('active');
        p.style.display = 'none';
      }
    });
    document.querySelectorAll('.control-button.active').forEach(btn => {if (btn !== button) {btn.classList.remove('active');}});
    if (popup.classList.contains('active')) {
      popup.classList.remove('active');
      popup.style.display = 'none';
      button.classList.remove('active');
      this.currentPopupIndex = -1;
      return;
    }
    
    popup.classList.add('active');
    popup.style.display = 'block';
    button.classList.add('active');
    this.currentPopupIndex = index;
    this.positionPopup(popup, button);
    const outsideClick = (e) => {
      if (!button.contains(e.target) && !popup.contains(e.target)) {
        this.closePopup();
        document.removeEventListener('click', outsideClick);
      }
    };
    setTimeout(() => {document.addEventListener('click', outsideClick);}, 0);
  }

  positionPopup(popup, button) {
    if (!popup || !button) return;
    const buttonRect = button.getBoundingClientRect();
    const popupContent = popup.querySelector('.popup-content');
    if (!popupContent) return;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    popupContent.style.visibility = 'hidden';
    popupContent.style.display = 'block';
    const popupWidth = popupContent.offsetWidth;
    const popupHeight = popupContent.offsetHeight;
    popupContent.style.visibility = '';
    let left = buttonRect.left + (buttonRect.width / 2) - (popupWidth / 2);
    let top = buttonRect.bottom + 4;
    if (left + popupWidth > viewportWidth) {left = viewportWidth - popupWidth - 10;}
    if (left < 10) {left = 10;}
    if (top + popupHeight > viewportHeight) {
      top = buttonRect.top - popupHeight - 4;
      if (top < 10) {
        top = buttonRect.bottom + 4;
        left = Math.max(10, (viewportWidth - popupWidth) / 2);
      }
    }
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    if (window.innerWidth <= 768) {
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
    } 
    else {popup.style.transform = 'none';}
  }

  closePopup() {
    if (this.currentPopupIndex !== -1) {
      const popup = document.getElementById(`popup-${this.currentPopupIndex}`);
      const button = document.querySelector(`.control-button[data-index="${this.currentPopupIndex}"]`);
      if (popup) {
        popup.classList.remove('active');
        popup.style.display = 'none';
      }
      if (button) {button.classList.remove('active');}
      this.currentPopupIndex = -1;
    }
  }
 
  setupSettingsListeners() {
    const sizeInput = document.getElementById('size-input');
    const radiusInput = document.getElementById('radius-input');
    const lineInput = document.getElementById('line-input');
    const sizeFromURL = this.urlParams.get('size');
    const radiusFromURL = this.urlParams.get('radius');
    const lineFromURL = this.urlParams.get('line');
    const setValueWithDisplay = (input, value, displayClass) => {
      if (input && value) {
        input.value = value;
        const display = input.closest('.setting-group').querySelector(`.value-display.${displayClass}`);
        if (display) {display.textContent = value;}
      }
    };
    
    setValueWithDisplay(sizeInput, sizeFromURL, 'size');
    setValueWithDisplay(radiusInput, radiusFromURL, 'radius');
    setValueWithDisplay(lineInput, lineFromURL, 'line');
    
    const validateAndUpdate = (input, min, max, type) => {
      let value = parseInt(input.value);
      if (isNaN(value)) {value = min;}
      if (value < min) {value = min;} 
      else if (value > max) {value = max;}
      input.value = value;
      const display = input.closest('.setting-group').querySelector(`.value-display.${type}`);
      if (display) {display.textContent = value;}
      return value;
    };
    
    [sizeInput, radiusInput, lineInput].forEach((input, index) => {
      if (!input) return;
      const limits = [{ min: 16, max: 620 }, { min: 0, max: 500 }, { min: 0, max: 25 }];
      const types = ['size', 'radius', 'line'];
      const { min, max } = limits[index];
      const type = types[index];
      
      input.addEventListener('input', (e) => {
        const display = e.target.closest('.setting-group').querySelector(`.value-display.${type}`);
        if (display) {display.textContent = e.target.value;}
      });
      
      input.addEventListener('change', () => {
        validateAndUpdate(input, min, max, type);
        this.updateAvatarFromSettings();
      });
      
      input.addEventListener('blur', () => {
        validateAndUpdate(input, min, max, type);
        this.updateAvatarFromSettings();
      });
      
      input.addEventListener('keypress', (e) => {
        if (!/^\d$/.test(e.key)) {e.preventDefault();}
      });
      
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const numericText = pastedText.replace(/[^\d]/g, '');
        input.value = numericText;
        const display = input.closest('.setting-group').querySelector(`.value-display.${type}`);
        if (display) {display.textContent = numericText;}
      });
    });
  }
    
  setupEventListeners() {
    document.querySelectorAll('.control-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.currentTarget.dataset.index);
        this.togglePopup(index);
      });
    });

    this.isim.forEach((_, index) => {
      const popup = document.getElementById(`popup-${index}`);
      const optionsGrid = document.getElementById(`options-${index}`);
      
      if (optionsGrid) {
        optionsGrid.addEventListener('click', (e) => {
          e.stopPropagation();
          const optionItem = e.target.closest('.option-item');
          if (optionItem) {
            const value = optionItem.dataset.value;
            this.basamakGuncelle(index, value);
            this.closePopup();
          }
        });
      }
      
      if (popup) {
        popup.addEventListener('click', (e) => {
          if (e.target.classList.contains('popup-close')) {
            e.stopPropagation();
            this.closePopup();
          }
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {this.closePopup();}
    });

    window.addEventListener('scroll', () => {
      if (this.currentPopupIndex !== -1) {
        const popup = document.getElementById(`popup-${this.currentPopupIndex}`);
        const button = document.querySelector(`.control-button[data-index="${this.currentPopupIndex}"]`);
        if (popup && button && popup.classList.contains('active')) {this.positionPopup(popup, button);}
      }
    }, true);

    window.addEventListener('resize', () => {
      if (this.currentPopupIndex !== -1) {
        const popup = document.getElementById(`popup-${this.currentPopupIndex}`);
        const button = document.querySelector(`.control-button[data-index="${this.currentPopupIndex}"]`);
        if (popup && button && popup.classList.contains('active')) {this.positionPopup(popup, button);}
      }
    });

    const randomBtn = document.getElementById('random-btn');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        this.kodUret();
        this.closePopup();
      });
    }
    
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(this.kaydetKod).then(() => {
          AlertBox(`Kod: ${this.kaydetKod}`, 'copy');
        });
        this.closePopup();
      });
    }
  }

  updateButtonPreview(index, value) {
    const button = document.querySelector(`.control-button[data-index="${index}"]`);
    if (button) {
      const preview = this.getPreviewHTML(index, value);
      button.innerHTML = preview;
      button.setAttribute('data-tooltip', `${this.isim[index]}: ${value}`);
    }
  }

  updateAllButtonPreviews() {this.isim.forEach((_, index) => {this.updateButtonPreview(index, this.kaydetKod[index] || '');});}

  updateCodeDisplay() {
    const display = document.getElementById('code-display');
    if (display) {display.value = this.kaydetKod;}
    const dataElement = document.querySelector('[avatar]');
    if (dataElement) {dataElement.setAttribute('avatar', this.kaydetKod);}
  }

  updateHtmlCode() {
    const avatarElement = document.querySelector('[avatar]');
    if (avatarElement) {
      const size = avatarElement.getAttribute('size') || '200';
      const radius = avatarElement.getAttribute('radius') || '25';
      const line = avatarElement.getAttribute('line') || '10';
      const avatarCode = avatarElement.getAttribute('avatar') || this.kaydetKod;
      const htmlCode = `<div avatar="${avatarCode}" size="${size}" radius="${radius}" line="${line}"></div>`;
      const htmlCodeElement = document.querySelector('#htmlCode code'); 
      if (htmlCodeElement) {
        htmlCodeElement.classList.remove('highlited');
        htmlCodeElement.textContent = htmlCode;
        if (typeof applyHighlight === 'function') {
          const lang = htmlCodeElement.getAttribute('data-lang') || 'html';
          htmlCodeElement.innerHTML = applyHighlight(htmlCodeElement.innerHTML, lang);
          htmlCodeElement.classList.add('highlited');
        }
      }
    }
  }

  isValidCode(code) {
    if (code.length !== 10) return false;
    for (let i = 0; i < 10; i++) {
      if (!this.secenekler[i].includes(code[i])) {return false;}
    }
    return true;
  }

  // Backup SVG
  SVG(c, element) {
    if (!this.pathObjects || !this.pathObjects.bg) return;
    const bgRenk = this.pathObjects.bg[c[0]?.toLowerCase()] || this.WHITE;
    const yuzKod = c[1]?.toLowerCase();
    const tenRenk = this.pathObjects.ten[c[2]?.toLowerCase()] || this.WHITE;
    const sacKod = c[3];
    const gozKod = c[4]?.toLowerCase();
    const agizKod = c[5]?.toLowerCase();
    const aksKod = c[6]?.toLowerCase();
    const sakalKod = c[7]?.toLowerCase();
    const govdeKod = c[8]?.toLowerCase();
    const govdeRenk = this.pathObjects.grenk[c[9]?.toLowerCase()] || this.WHITE;
    const radius = element.getAttribute('radius') || '25';
    const size = element.getAttribute('size') || '200';
    const line = element.getAttribute('line') || '10';
    const borderValue = `${line}px solid ${bgRenk}30`;
    let radiusValue = radius.includes('px') ? radius : radius + 'px';
    let sizeValue = size.includes('px') ? size : size + 'px';
    const style = `width: ${sizeValue}; height: ${sizeValue}; border-radius: ${radiusValue}; border: ${borderValue}; background: ${this.WHITE}; display: block; margin: 0 auto; box-sizing: border-box;`;
    const svgBas = `<svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style="${style}">`;
    const svgFilter = `<defs><filter id="white-outline" x="-50" y="-50" width="350" height="350" filterUnits="userSpaceOnUse"><feMorphology in="SourceAlpha" operator="dilate" radius="${line}" result="dilated"/><feFlood flood-color="${this.WHITE}" result="white" /><feComposite in="white" in2="dilated" operator="in" result="outline"/><feMerge><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
    const svgBackground = `<rect width="300" height="300" fill="${bgRenk}"/><g transform="translate(5, 0)" filter="url(#white-outline)">`;
    const yuzPath = `<g fill="${tenRenk}" stroke="${this.BLACK}" stroke-width="0">${this.pathObjects.yuz[yuzKod] || ''}</g>`;
    const sacPath = this.pathObjects.sac[sacKod] || '';
    const gozPath = this.pathObjects.goz[gozKod] || '';
    const agizPath = `<g transform="translate(6, 8)">${this.pathObjects.agiz[agizKod] || ''}</g>`;
    const govdePath = `<g fill="${govdeRenk}" stroke="${this.BLACK}" stroke-width="0">${this.pathObjects.govde[govdeKod] || ''}</g>`;
    const aksPath = this.pathObjects.aks[aksKod] || '';
    const sakalPath = this.pathObjects.sakal[sakalKod] || '';
    const svgSon = `</g></svg>`;
    this.kisi = this.kisi || { svg: '' };
    this.kisi.svg = svgBas + svgFilter + svgBackground + govdePath + yuzPath + sacPath + agizPath + sakalPath + gozPath + aksPath + svgSon;
  }
}

// Yardımcı fonksiyonlar
function copyCode(element) {
    const codeElement = element.closest('pre').querySelector('code');
    const textToCopy = codeElement.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        AlertBox(`Metin kopyalandı`, 'copy');
    }).catch(err => {
        console.error('Kopyalama hatası:', err);
        AlertBox(`Kopyalama hatası:` + err, 'danger');
    });
}

function apiBlank() {
  const avatarElement = document.querySelector('[avatar]');
  if (!avatarElement) {
      console.error('Avatar elementi bulunamadı');
      AlertBox(`Avatar elementi bulunamadı`, 'danger');
      return;
  }
  const avatarCode = avatarElement.getAttribute('avatar') || '';
  const size = avatarElement.getAttribute('size') || '200';
  const radius = avatarElement.getAttribute('radius') || '25';
  const line = avatarElement.getAttribute('line') || '10';
  const apiUrl = `https://avatar.ckoglu.workers.dev/?size=${size}&radius=${radius}&line=${line}&code=${avatarCode}.svg`;
  window.open(apiUrl, '_blank', 'noopener,noreferrer');
}

function selectAllCode(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function copyUrl(element) {
  const input = element.closest('.input-wrapper')?.querySelector('.url-input');
  if (!input) {
      console.warn('Kopyalanacak input bulunamadı');
      AlertBox('Kopyalanacak bağlantı bulunamadı', 'error');
      return;
  }
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value).then(() => {
      AlertBox('Bağlantı adresi kopyalandı', 'copy');
  })
  .catch(err => {
      console.error('Kopyalama hatası:', err);
      AlertBox('Kopyalama başarısız oldu', 'error');
  });
}

// İndirme fonksiyonları
async function downloadSVG() {
  try {
    const avatarElement = document.querySelector('[avatar]');
    if (!avatarElement) {
      AlertBox('Avatar elementi bulunamadı!', 'danger');
      return;
    }
    
    const svgElement = avatarElement.querySelector('svg');
    if (!svgElement) {
      AlertBox('SVG elementi bulunamadı!', 'danger');
      return;
    }
    
    const code = avatarElement.getAttribute('avatar') || window.app?.kaydetKod || 'avatar';
    const filename = `avatar-${code}.svg`;
    
    // SVG elementini klonlayalım ve stil ekleyelim
    const clonedSvg = svgElement.cloneNode(true);
    
    // SVG'yi temizleyip optimize edelim
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(clonedSvg);
    
    // SVG başlığını ekleyelim
    svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString;
    
    // Blob oluştur ve indir
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    saveDownloadFile(svgBlob, filename);
    
    AlertBox('SVG formatında indirildi', 'success');
  } catch (error) {
    console.error('SVG indirme hatası:', error);
    AlertBox('SVG indirme sırasında hata oluştu!', 'danger');
  }
}

async function downloadPNG() {
  try {
    await downloadRasterFormat('png');
  } catch (error) {
    console.error('PNG indirme hatası:', error);
    AlertBox('PNG indirme sırasında hata oluştu!', 'danger');
  }
}

async function downloadJPG() {
  try {
    await downloadRasterFormat('jpg');
  } catch (error) {
    console.error('JPG indirme hatası:', error);
    AlertBox('JPG indirme sırasında hata oluştu!', 'danger');
  }
}

async function downloadRasterFormat(format) {
  const avatarElement = document.querySelector('[avatar]');
  if (!avatarElement) {
    AlertBox('Avatar elementi bulunamadı!', 'danger');
    return;
  }
  
  const svgElement = avatarElement.querySelector('svg');
  if (!svgElement) {
    AlertBox('SVG elementi bulunamadı!', 'danger');
    return;
  }
  
  const size = parseInt(avatarElement.getAttribute('size')) || 200;
  const code = avatarElement.getAttribute('avatar') || window.app?.kaydetKod || 'avatar';
  const filename = `avatar-${code}.${format}`;
  
  // SVG'yi string'e çevir
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);
  
  // Data URL oluştur
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  // Canvas oluştur
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Canvas boyutunu ayarla (yüksek çözünürlük için scale)
  const scale = 2; // Retina desteği için 2x
  canvas.width = size * scale;
  canvas.height = size * scale;
  
  // SVG'yi yükle
  const img = new Image();
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        // Canvas'ı temizle ve beyaz arka plan ekle
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // SVG'yi canvas'a çiz (scale faktörünü uygula)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Canvas'tan blob oluştur
        canvas.toBlob((blob) => {
          if (blob) {
            saveDownloadFile(blob, filename, format === 'png' ? 'image/png' : 'image/jpeg');
            URL.revokeObjectURL(url);
            resolve();
            AlertBox(`${format.toUpperCase()} formatında indirildi`, 'success');
          } else {
            reject(new Error('Blob oluşturulamadı'));
          }
        }, format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = reject;
    img.src = url;
  });
}

function saveDownloadFile(blob, filename) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  // Temizlik
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}


document.addEventListener('DOMContentLoaded', () => {
  const app = new ProfilAppExtended();
  app.init();

  // İndirme butonları için event listener'lar
  const downloadButtons = document.querySelectorAll('.dropdown-item[data-format]');
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const format = btn.dataset.format.toLowerCase();
      if (format === 'svg') {
        downloadSVG();
      } else if (format === 'png') {
        downloadPNG();
      } else if (format === 'jpg') {
        downloadJPG();
      }
    });
  });
  
  // Manuel kod girişi için event listener
  const codeDisplay = document.getElementById('code-display');
  if (codeDisplay) {
    codeDisplay.addEventListener('input', function() {
      const code = this.value;
      if (code.length === 10) {
        if (window.app && window.app.isValidCode(code)) {
          window.app.kaydetKod = code;
          const element = document.querySelector('[avatar]');
          if (element) {
            element.setAttribute('avatar', code);
            if (window.avatarApp && typeof window.avatarApp.SVG === 'function') {
              window.avatarApp.SVG(code.split(''), element);
              element.innerHTML = window.avatarApp.kisi.svg;
            }
            window.app.updateAllButtonPreviews();
            window.app.updateHtmlCode();
            window.app.updateApiCodeSamples();
            window.app.updateURL();
          }
        }
      }
    });

    const apiBtn = document.getElementById('api-btn');
    if (apiBtn) {apiBtn.addEventListener('click', function() {apiBlank(this);});}
    
    codeDisplay.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const code = this.value;
        if (code.length === 10) {
          if (window.app && window.app.isValidCode(code)) {
            window.app.kaydetKod = code;
            const element = document.querySelector('[avatar]');
            if (element) {
              element.setAttribute('avatar', code);
              
              if (window.avatarApp && typeof window.avatarApp.SVG === 'function') {
                window.avatarApp.SVG(code.split(''), element);
                element.innerHTML = window.avatarApp.kisi.svg;
              }
              
              window.app.updateAllButtonPreviews();
              window.app.updateHtmlCode();
              window.app.updateApiCodeSamples();
              window.app.updateURL();
            }
          }
        }
      }
    });
  }

});


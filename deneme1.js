// DOM Elements
const introScreen = document.getElementById('introScreen');
const canvasScreen = document.getElementById('canvasScreen');
const loadScreen = document.getElementById('loadScreen');
const continueBtn = document.getElementById('continueBtn');
const backBtn = document.getElementById('backBtn');
const continueToLoadBtn = document.getElementById('continueToLoadBtn');
const backToSlabBtn = document.getElementById('backToSlabBtn');
const designLoadSection = document.getElementById('designLoadSection');
const lineLoadSection = document.getElementById('lineLoadSection');
const continueDimensionBtn = document.getElementById('continueDimensionBtn');
const dimensionScreen = document.getElementById('dimensionScreen');


const drawCanvasBtn = document.getElementById('drawCanvasBtn');
const inputWidth = document.getElementById('inputWidth');
const inputLength = document.getElementById('inputLength');
const inputBeamCount = document.getElementById('inputBeamCount');
const spacingInfo = document.getElementById('spacingInfo');
const canvas = document.getElementById('slabCanvas');
const c = canvas.getContext('2d');

const submitLoadBtn = document.getElementById('submitLoadBtn');
const submitDesignLoadBtn = document.getElementById('submitDesignLoadBtn');
const submitLineLoadBtn = document.getElementById('submitLineLoadBtn');
const beamSelect = document.getElementById('beamSelect');


const feedback = document.getElementById('feedback');
const continueToTributaryBtn = document.getElementById('continueToTributaryBtn');
continueToTributaryBtn.addEventListener('click', () => {
  playClick();
  showScreen('tributaryScreen');

  // Clone load canvas
  const originalCanvas = document.getElementById('loadCanvas');
  const cloneCanvas = document.getElementById('loadCanvasPreview');
  if (originalCanvas && cloneCanvas) {
    const ctx = cloneCanvas.getContext('2d');
    ctx.clearRect(0, 0, cloneCanvas.width, cloneCanvas.height);
    ctx.drawImage(originalCanvas, 0, 0);
  }

  // Clone combined load image
  const combinedOriginal = document.getElementById('combinedLoadImage');
  const combinedClone = document.getElementById('combinedImagePreview');
  if (combinedOriginal && combinedClone) {
    combinedClone.innerHTML = combinedOriginal.innerHTML;
  }
});


// Sound elements
const clickSound = document.getElementById('clickSound');
const successSound = document.getElementById('successSound');
const errorSound = document.getElementById('errorSound');

// Hint elements
const hintPsi = document.getElementById('hintPsi');
const hintGamma = document.getElementById('hintGamma');
const hintModal = document.getElementById('hintModal');
const hintImage = document.getElementById('hintImage');

// Canvas setup
canvas.width = 1024;
canvas.height = 576;

// Global variables
let beamCount = 0;

// Sound functions
function playClick() { 
  clickSound?.play(); 
}

function playSuccess() { 
  successSound?.play(); 
}

function playError() { 
  errorSound?.play(); 
}

// Progress update function (assuming it exists elsewhere)
function updateProgress(step) {
  for (let i = 1; i <= step; i++) {
    const el = document.getElementById(`step${i}`);
    if (el) el.classList.add('completed');
  }
}

// Navigation event listeners
continueBtn.addEventListener('click', () => {
  playClick();
  introScreen.classList.remove('active');
  canvasScreen.classList.add('active');
  updateProgress(1);
});

backBtn.addEventListener('click', () => {
  playClick();
  canvasScreen.classList.remove('active');
  introScreen.classList.add('active');
});

continueToLoadBtn.addEventListener('click', () => {
  playClick();
  canvasScreen.classList.remove('active');
  loadScreen.classList.add('active');
  const loadCanvas = document.getElementById('loadCanvas');
  const loadCtx = loadCanvas.getContext('2d');
  loadCtx.clearRect(0, 0, loadCanvas.width, loadCanvas.height);
  loadCtx.drawImage(canvas, 0, 0);
});

backToSlabBtn.addEventListener('click', () => {
  playClick();
  loadScreen.classList.remove('active');
  canvasScreen.classList.add('active');
});

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.style.display = 'none';
    screen.classList.remove('active');
  });
  const screen = document.getElementById(id);
  if (screen) {
    screen.style.display = 'block';
    screen.classList.add('active');
  }
}


// Draw slab function
function drawSlab(width, length, spacing, beamCountInput) {
  const originX = 50;
  const originY = 50;
  const scale = 50;
  const slabWidthPx = width * scale;
  const slabLengthPx = length * scale;

  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = '#e6f2fa';
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.strokeStyle = '#333';
  c.strokeRect(originX, originY, slabWidthPx, slabLengthPx);

  c.strokeStyle = '#0066cc';
  c.fillStyle = '#000';
  c.font = '14px Arial';

  for (let i = 0; i < beamCountInput; i++) {
    const x = originX + i * spacing * scale;
    c.beginPath();
    c.moveTo(x, originY);
    c.lineTo(x, originY + slabLengthPx);
    c.stroke();
    c.fillText(`Beam ${i + 1}`, x - 20, originY - 10);
  }

  c.fillText(`Length: ${length} m`, originX + slabWidthPx + 10, originY + slabLengthPx / 2);
  const midX = originX + spacing * scale / 2;
  const midY = originY + slabLengthPx + 20;
  c.beginPath();
  c.moveTo(originX, originY + slabLengthPx + 10);
  c.lineTo(originX + spacing * scale, originY + slabLengthPx + 10);
  c.stroke();
  c.fillText(`Spacing: ${spacing.toFixed(2)} m`, midX - 30, midY + 10);
}

// Draw canvas button event listener
drawCanvasBtn.addEventListener('click', () => {
  playClick();
  
  const width = parseFloat(inputWidth.value);
  const length = parseFloat(inputLength.value);
  const beamCountInput = parseInt(inputBeamCount.value);

  if (isNaN(width) || isNaN(length) || isNaN(beamCountInput) || beamCountInput < 2) {
    alert("Please enter valid slab dimensions and at least 2 beams.");
    return;
  }

  const spacing = width / (beamCountInput - 1);
  beamCount = beamCountInput;
  
  spacingInfo.textContent = `Calculated spacing: ${spacing.toFixed(2)} m`;
  
  drawSlab(width, length, spacing, beamCountInput);
  updateProgress(2);

    // Populate beam dropdown
    const beamSelect = document.getElementById('beamSelect');
    beamSelect.innerHTML = ''; // Clear previous options
    for (let i = 1; i <= beamCountInput; i++) {
      const option = document.createElement('option');
      option.value = `Beam ${i}`;
      option.textContent = `Beam ${i}`;
      beamSelect.appendChild(option);
    }
  });


// Load image functions
// Function to update combined load image based on active loads
function updateCombinedLoadImage() {
  const combinedImageDiv = document.getElementById('combinedLoadImage');
  const toggleBtn = document.getElementById('toggleCombinedBtn');
  if (!combinedImageDiv || !toggleBtn) return;

  const permanent = parseFloat(document.getElementById('permanentLoad').value) || 0;
  const snow = parseFloat(document.getElementById('snowLoad').value) || 0;
  const wind = parseFloat(document.getElementById('windLoad').value) || 0;
  const mobile = parseFloat(document.getElementById('mobileLoad').value) || 0;

  // Clear previous image
  combinedImageDiv.innerHTML = '';

  // Determine which loads are active
  const hasP = permanent > 0;
  const hasS = snow > 0;
  const hasW = wind !== 0;
  const hasM = mobile > 0;
  const windDirection = wind > 0 ? '+W' : (wind < 0 ? '-W' : '');


  // Generate combination string based on your specific naming convention
  let combination = '';
  let imageName = '';

  // Check combinations in the order you specified: P+S+W+M; P+W+M; P+M+S; P+M; P; P+S+W; P+S
  if (hasP && hasS && hasW && hasM) {
    combination = `P+S+${windDirection}+M`;
  } else if (hasP && hasW && hasM && !hasS) {
    combination = `P+${windDirection}+M`;
  } else if (hasP && hasM && hasS && !hasW) {
    combination = 'P+M+S';
  } else if (hasP && hasM && !hasS && !hasW) {
    combination = 'P+M';
  } else if (hasP && !hasS && !hasW && !hasM) {
    combination = 'P';
  } else if (hasP && hasS && hasW && !hasM) {
    combination = `P+S+${windDirection}`;
  } else if (hasP && hasS && !hasW && !hasM) {
    combination = 'P+S';
  }
  

  if (combination) {
    imageName = combination + '.png';
    
    const img = document.createElement('img');
    img.src = './img/' + imageName;
    img.alt = 'Combined Load: ' + combination;
    img.title = 'Combined Load: ' + combination;
    img.style.width = '400px';
    img.style.height = 'auto';
    img.style.margin = '10px';
    img.style.border = '2px solid #333';
    img.style.borderRadius = '8px';
    
    // Add error handling for missing images
    img.onerror = function() {
      this.style.display = 'none';
      console.warn('Combined load image not found:', imageName);
    };
    
    combinedImageDiv.appendChild(img);
    
    // Show/enable the toggle button when there are active loads
    toggleBtn.style.display = 'inline-block';
    toggleBtn.textContent = combinedImageDiv.style.display === 'none' ? 
      `Show Combined Loads (${combination})` : 
      `Hide Combined Loads (${combination})`;
  } else {
    // Hide the toggle button when no loads are active
    toggleBtn.style.display = 'none';
    combinedImageDiv.style.display = 'none';
  }
}

// Function to toggle combined load image visibility
function toggleCombinedLoadImage() {
  const combinedImageDiv = document.getElementById('combinedLoadImage');
  const toggleBtn = document.getElementById('toggleCombinedBtn');
  
  if (combinedImageDiv && toggleBtn) {
    const isVisible = combinedImageDiv.style.display !== 'none';
    combinedImageDiv.style.display = isVisible ? 'none' : 'block';
    
    // Update button text
    const combination = toggleBtn.textContent.match(/\(([^)]+)\)/)?.[1] || '';
    toggleBtn.textContent = isVisible ? 
      `Show Combined Loads (${combination})` : 
      `Hide Combined Loads (${combination})`;
  }
}
function toggleLoadImage(inputId, imgId) {
  const input = document.getElementById(inputId);

  // Special handling for wind load with positive and negative images
  if (inputId === 'windLoad') {
    const imgPositive = document.getElementById('imgWindPositive');
    const imgNegative = document.getElementById('imgWindNegative');

    if (input && imgPositive && imgNegative) {
      imgPositive.style.display = 'none';
      imgNegative.style.display = 'none';

      input.addEventListener('input', () => {
        const value = parseFloat(input.value) || 0;
        imgPositive.style.display = 'none';
        imgNegative.style.display = 'none';

        if (value > 0) {
          imgPositive.style.display = 'inline-block';
        } else if (value < 0) {
          imgNegative.style.display = 'inline-block';
        }

        updateCombinedLoadImage();
      });
    }
  } 
  // Normal loads
  else {
    const img = document.getElementById(imgId);
    if (input && img) {
      img.style.display = 'none';
      input.addEventListener('input', () => {
        const value = parseFloat(input.value) || 0;
        img.style.display = value > 0 ? 'inline-block' : 'none';
        updateCombinedLoadImage();
      });
    }
  }
}


// Initialize load image toggles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  toggleLoadImage('permanentLoad', 'imgPermanent');
  toggleLoadImage('snowLoad', 'imgSnow');
  toggleLoadImage('windLoad', 'imgWind');
  toggleLoadImage('mobileLoad', 'imgMobile');
  
  // Initialize combined load image
  updateCombinedLoadImage();
  
  // Add event listener for toggle button
  const toggleBtn = document.getElementById('toggleCombinedBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      playClick();
      toggleCombinedLoadImage();
      updateProgress(3);
    });
  }
});


document.getElementById('backToLoadBtn').addEventListener('click', () => {
  playClick();
  showScreen('loadScreen');
});

document.getElementById('backToLoadDimensionBtn').addEventListener('click', () => {
  playClick();
  showScreen('loadScreen');
});

document.getElementById('continueToDesignLoadBtn').addEventListener('click', () => {
  playClick();
  showScreen('designLoadScreen'); // <- next screen
});


// Gamification variables
let tributaryPoints = 100;
let tributaryAttempts = 0;

document.getElementById('submitLoadBtn').addEventListener('click', () => {
  const tributaryWidth = parseFloat(document.getElementById('tributaryWidth').value);
  const selectedBeam = document.getElementById('beamSelect').value;
  const beamNumber = parseInt(selectedBeam.replace("Beam ", ""));
  const spacing = parseFloat(inputWidth.value) / (beamCount - 1);
  const isEdgeBeam = beamNumber === 1 || beamNumber === beamCount;
  const expectedTributary = isEdgeBeam ? spacing / 2 : spacing;
  const tolerance = 0.1;
  const feedback = document.getElementById('feedback');
  const gifContainer = document.getElementById('feedbackGif'); // Add <img id="feedbackGif"> in HTML
  const badgeContainer = document.getElementById('badgeContainer'); // Add <div id="badgeContainer"></div> in HTML

  tributaryAttempts++;

  if (Math.abs(tributaryWidth - expectedTributary) <= tolerance) {
    playSuccess(); // Success sound or animation

    // Award bonus for first try
    if (tributaryAttempts === 1) {
      tributaryPoints += 20;
      badgeContainer.innerHTML += '<img src="./img/perfect-badge.png" class="badge" title="Perfect Designer">';
    }

    feedback.innerHTML = `✅ Correct! Tributary width for ${selectedBeam} is ${expectedTributary.toFixed(2)} m.<br>Points: ${tributaryPoints}`;
    feedback.style.backgroundColor = '#e0f7e9';
    feedback.style.borderLeft = '4px solid #2ecc71';

    gifContainer.src = './img/correct1.gif';
    gifContainer.style.display = 'block';

    updateProgress(4);

    // Reset attempts for the next challenge
    tributaryAttempts = 0;

    // Show design check options
    designChecksWrapper.style.display = 'block';
    checkTypeScreen.style.display = 'block';
    loadCaseScreen.style.display = 'none';
    factorInputSection.style.display = 'none';
    checkTypeScreen.scrollIntoView({ behavior: 'smooth' });

  } else {
    tributaryPoints = Math.max(0, tributaryPoints - 10);
    playError(); // Error sound or animation

    // Show hint messages based on attempts
    let hint = "";
    if (tributaryAttempts === 1) hint = "💡 Hint: Is it an edge beam?";
    else if (tributaryAttempts === 2) hint = "💡 Remember: tributary width = half the distance to adjacent supporting members ";
    else if (tributaryAttempts >= 3) hint = `The correct value is ${expectedTributary.toFixed(2)} m. Try again!`;

    feedback.innerHTML = `❌ Incorrect. Points: ${tributaryPoints} <br> ${hint}`;
    feedback.style.backgroundColor = '#fff3cd';
    feedback.style.borderLeft = '4px solid #f0ad4e';

    // Show random fail GIF
    const failGifs = ['./img/fail1.gif', './img/fail2.gif'];
    gifContainer.src = failGifs[Math.floor(Math.random() * failGifs.length)];
    gifContainer.style.display = 'block';
  }

  feedback.style.display = 'block';
});

// Ensure currentLimitState is declared globally
let currentLimitState = null;

const chooseSLSBtn = document.getElementById('chooseSLSBtn');
const chooseULSBtn = document.getElementById('chooseULSBtn');
const selectedLimitState = document.getElementById('selectedLimitState');
const checkTypeScreen = document.getElementById('checkTypeScreen');
const loadCaseScreen = document.getElementById('loadCaseScreen');

function updateLimitStateDisplay() {
  if (currentLimitState) {
    selectedLimitState.innerText = `✅ Selected: ${currentLimitState}`;
    selectedLimitState.style.display = 'block';
  }
}

function restoreLimitStateSelection() {
  chooseSLSBtn.checked = (currentLimitState === 'SLS');
  chooseULSBtn.checked = (currentLimitState === 'ULS');
  updateLimitStateDisplay();
}

['chooseSLSBtn', 'chooseULSBtn'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('change', () => {
    // Uncheck the other limit state
    ['chooseSLSBtn', 'chooseULSBtn'].forEach(otherId => {
      if (otherId !== id) {
        document.getElementById(otherId).checked = false;
      }
    });

    // Update currentLimitState
    currentLimitState = chooseSLSBtn.checked ? 'SLS' :
                        chooseULSBtn.checked ? 'ULS' : null;

    // Update display
    updateLimitStateDisplay();

    // Show next screen
    if (currentLimitState) {
      // Keep checkboxes visible but also show load cases
      loadCaseScreen.style.display = 'block';
    }
  });
});

// Restore on page load
document.addEventListener('DOMContentLoaded', () => {
  restoreLimitStateSelection();
});



// Step 2: Load case selection (ensure only one selected)
['chooseMobileBtn', 'chooseSnowBtn', 'chooseWindBtn'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('change', () => {
    // Uncheck other load cases
    ['chooseMobileBtn', 'chooseSnowBtn', 'chooseWindBtn'].forEach(otherId => {
      if (otherId !== id) {
        document.getElementById(otherId).checked = false;
      }
    });

    // Show Ψ factor section
    document.getElementById('factorInputSection').style.display = 'block';
    document.getElementById('gammaFactorSection').style.display = 'none'; 
    document.getElementById('designLoadSection').style.display = 'none'
  });
});


// Populate ψ dropdowns with values from 0 to 1.0 (steps of 0.1)
function populatePsiDropdowns() {
  const values = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  const psi0Select = document.getElementById('psi0Select');
  const psi1Select = document.getElementById('psi1Select');
  const psi2Select = document.getElementById('psi2Select');

  [psi0Select, psi1Select, psi2Select].forEach(select => {
    select.innerHTML = values
      .map(v => `<option value="${v}">${v.toFixed(1)}</option>`)
      .join('');
  });
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', populatePsiDropdowns);

// Correct ψ factor reference table (ψ0, ψ1, ψ2)
const psiFactorsTable = {
  A: [0.7, 0.5, 0.3],      // Domestic
  B: [0.7, 0.5, 0.3],      // Office
  C: [0.7, 0.7, 0.6],      // Congregation
  D: [0.7, 0.7, 0.6],      // Shopping
  E: [0.9, 0.8, 0.7],      // Storage
  F30: [0.7, 0.7, 0.6],    // Traffic ≤30kN
  F160: [0.7, 0.5, 0.3],   // Traffic ≤160kN
  G: [0.7, 0.5, 0.3],      // Traffic area
  H: [0, 0, 0],            // Roofs
  SnowFI: [0.7, 0.5, 0.3], // Snow FI/IS/Norway/Sweden
  SnowHigh: [0.7, 0.5, 0.2], // Snow >1000m
  SnowLow: [0.5, 0.2, 0],  // Snow ≤1000m
  Wind: [0.6, 0.2, 0],     // Wind
  Temp: [0.6, 0.5, 0]      // Temperature
};


document.getElementById('hintPsiBtn').addEventListener('click', () => {
  document.getElementById('hintImage').src = './img/psi-factors.png';
  document.getElementById('hintModal').style.display = 'flex';
});

document.getElementById('closeHintModal').addEventListener('click', () => {
  document.getElementById('hintModal').style.display = 'none';
});


// Check selected ψ values
document.getElementById('checkPsiBtn').addEventListener('click', () => {
  const category = document.getElementById('categorySelect').value;
  const psi0 = parseFloat(document.getElementById('psi0Select').value);
  const psi1 = parseFloat(document.getElementById('psi1Select').value);
  const psi2 = parseFloat(document.getElementById('psi2Select').value);
  const feedback = document.getElementById('psiFeedback');

  if (!category) {
    feedback.innerText = "⚠️ Please select a category.";
    feedback.style.color = "orange";
    feedback.style.display = 'block';
    return;
  }

  const correctValues = psiFactorsTable[category];
  const isCorrect =
    Math.abs(psi0 - correctValues[0]) < 0.01 &&
    Math.abs(psi1 - correctValues[1]) < 0.01 &&
    Math.abs(psi2 - correctValues[2]) < 0.01;

  if (isCorrect) {
    playSuccess();
    feedback.innerText = `✅ Correct! Ψ factors for ${category}: [${correctValues.join(', ')}]`;
    feedback.style.color = "green";
    document.getElementById('designLoadSection').style.display = 'block';

  } else {
    playError();
    feedback.innerText = `❌ Incorrect values. Don't forget you are designing for ${category}, try again!`;
    feedback.style.color = "red";
  }
  feedback.style.display = 'block';
});

function populateGammaDropdowns() {
  const values = ['None', 0, 0.9, 1.10, 1.15, 1.35, 1.50];
  const gammaGSelect = document.getElementById('gammaGSelect');
  const gammaQSelect = document.getElementById('gammaQSelect');

  if (gammaGSelect && gammaQSelect) {
    [gammaGSelect, gammaQSelect].forEach(select => {
      select.innerHTML = values
        .map(v => {
          return typeof v === 'string'
            ? `<option value="${v}">${v}</option>`
            : `<option value="${v}">${v.toFixed(2)}</option>`;
        })
        .join('');
    });
  }
}


document.addEventListener('DOMContentLoaded', populateGammaDropdowns);

const gammaHintBtn = document.getElementById('hintGammaBtn');
if (gammaHintBtn) {
  gammaHintBtn.addEventListener('click', () => {
    document.getElementById('hintImage').src = './img/gamma-factors.png';
    document.getElementById('hintModal').style.display = 'flex';
  });
}

const closeModal = document.getElementById('closeHintModal');
if (closeModal) {
  closeModal.addEventListener('click', () => {
    document.getElementById('hintModal').style.display = 'none';
  });
}



// Checkbox change → trigger gamma + psi inputs and reveal design box
['chooseMobileBtn', 'chooseSnowBtn', 'chooseWindBtn'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    // Uncheck other checkboxes
    ['chooseMobileBtn', 'chooseSnowBtn', 'chooseWindBtn'].forEach(otherId => {
      if (otherId !== id) {
        document.getElementById(otherId).checked = false;
      }
    });

    showGammaInputs();  // Custom function to reveal gamma
    showFactorInputs(); // Custom function to reveal ψ
  });
});


// Design Load submission and validation
document.getElementById('checkDesignLoadBtn').addEventListener('click', () => {
  const gk = parseFloat(document.getElementById('permanentLoad')?.value) || 0;
  const q1k = parseFloat(document.getElementById('mobileLoad')?.value) || 0;
  const qs = parseFloat(document.getElementById('snowLoad')?.value) || 0;
  const qw = parseFloat(document.getElementById('windLoad')?.value) || 0;

  const psi01 = parseFloat(document.getElementById('psi01')?.value) || 0;
  const psis = parseFloat(document.getElementById('psis')?.value) || 0;
  const psiw = parseFloat(document.getElementById('psiw')?.value) || 0;

  const gammaG = parseFloat(document.getElementById('gammaG')?.value) || 1;
  const gammaQ = parseFloat(document.getElementById('gammaQ')?.value) || 1;

  const userDesignLoad = parseFloat(document.getElementById('designLoadInput')?.value);
  const tolerance = 0.1;
  let Ed = 0;

  // Detect selected load type
  const mobileSelected = document.getElementById('chooseMobileBtn').checked;
  const snowSelected = document.getElementById('chooseSnowBtn').checked;
  const windSelected = document.getElementById('chooseWindBtn').checked;
  
  let loadType = null;
  if (mobileSelected) loadType = 'mobile';
  else if (snowSelected) loadType = 'snow';
  else if (windSelected) loadType = 'wind';
  

  if (!loadType || !currentLimitState) {
    alert("Please select both a dominant load type and a limit state (SLS or ULS).");
    return;
  }


document.getElementById('hintGammaBtn').addEventListener('click', () => {
  document.getElementById('hintImage').src = './img/gamma-factors.png';
  document.getElementById('hintModal').style.display = 'flex';
});


// --- Compute Ed based on currentLimitState and loadType ---
if (window.currentLimitState === 'SLS') {
  if (loadType === 'mobile') {
    Ed = gk + q1k + psis * qs + psiw * qw;
  } else if (loadType === 'snow') {
    Ed = gk + qs + psi01 * q1k + psiw * qw;
  } else if (loadType === 'wind') {
    Ed = gk + qw + psi01 * q1k + psis * qs;
  }
} else if (window.currentLimitState === 'ULS') {
  if (loadType === 'mobile') {
    Ed = gammaG * gk + gammaQ * (q1k + psis * qs + psiw * qw);
  } else if (loadType === 'snow') {
    Ed = gammaG * gk + gammaQ * (qs + psi01 * q1k + psiw * qw);
  } else if (loadType === 'wind') {
    Ed = gammaG * gk + gammaQ * (qw + psi01 * q1k + psis * qs);
  }
}

Ed = parseFloat(Ed.toFixed(2)); // Round to 2 decimals

const feedbackBox = document.getElementById('designLoadFeedback');

if (isNaN(userDesignLoad)) {
  alert("Please enter a valid design load value.");
  return;
}

const isCorrect = Math.abs(userDesignLoad - Ed) <= tolerance;

if (isCorrect) {
  playSuccess?.();
  feedbackBox.innerHTML = `✅ <strong>Correct!</strong> Expected E<sub>d</sub> = <strong>${Ed.toFixed(2)} kN/m</strong>`;
  feedbackBox.style.backgroundColor = '#e0f7e9';
  feedbackBox.style.borderLeft = '4px solid #2ecc71';
} else {
  playError?.();
  feedbackBox.innerHTML = `❌ <strong>Incorrect.</strong><br>Expected E<sub>d</sub> = <strong>${Ed.toFixed(2)} kN/m</strong><br>You entered: <strong>${userDesignLoad.toFixed(2)}</strong>`;
  feedbackBox.style.backgroundColor = '#fff3cd';
  feedbackBox.style.borderLeft = '4px solid #f39c12';
}

feedbackBox.style.display = 'block';
feedbackBox.style.padding = '10px';
feedbackBox.style.marginTop = '15px';

});


document.getElementById('backToDesignLoadBtn').addEventListener('click', () => {
  playClick();
  showScreen('designLoadScreen');
});

document.getElementById('continueDimensionBtn').addEventListener('click', () => {
  playClick();
  showScreen('dimensionScreen'); // <- next screen
});
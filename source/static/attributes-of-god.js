// script.js
document.addEventListener("DOMContentLoaded", () => {
  const activeQueue = [];
  let currentProblem = null;
  let timerStep1 = null;
  let timerStep2 = null;

  const inputs = document.querySelectorAll('input[type="checkbox"]');
  const subtitleText = document.getElementById("subtitle-text");
  const problemDescription = document.getElementById("problemDescription");
  const selectWrapper = document.getElementById("selectWrapper");
  const selectTrigger = document.getElementById("selectTrigger");
  const selectedLabel = document.getElementById("selectedLabel");
  const customOptionsContainer = document.getElementById("customOptions");

  // Populate Dropdown Options dynamically from commentaryData
  const keys = Object.keys(commentaryData);
  keys.forEach((key) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "custom-option";
    optionDiv.setAttribute("data-value", key);
    optionDiv.textContent = commentaryData[key].label;
    customOptionsContainer.appendChild(optionDiv);
  });

  currentProblem = null;
  selectedLabel.textContent = "Select a problem...";
  problemDescription.textContent = "";

  const customOptions = document.querySelectorAll(".custom-option");

  function clearPendingTimers() {
    if (timerStep1) clearTimeout(timerStep1);
    if (timerStep2) clearTimeout(timerStep2);

    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.remove();
  }

  function updateSubtitle() {
    const allAttributes = ["powerful", "knowing", "loving"];

    if (!currentProblem) {
      subtitleText.textContent =
        "Select God's attributes to see how He handles this problem...";
      clearPendingTimers();
      return;
    }

    if (activeQueue.length === 3) {
      handleAllThreeSelected();
      return;
    }

    clearPendingTimers();

    if (activeQueue.length < 2) {
      subtitleText.textContent =
        "Select God's attributes to see how He handles this problem...";
      return;
    }

    const missingAttribute = allAttributes.find(
      (attr) => !activeQueue.includes(attr),
    );
    if (missingAttribute && commentaryData[currentProblem][missingAttribute]) {
      subtitleText.textContent =
        commentaryData[currentProblem][missingAttribute];
    }
  }

  function handleAllThreeSelected() {
    clearPendingTimers();

    subtitleText.textContent = commentaryData[currentProblem].utopiaMessage;

    let spinner = document.getElementById("loadingSpinner");
    if (!spinner) {
      spinner = document.createElement("div");
      spinner.className = "spinner";
      spinner.id = "loadingSpinner";
      document.getElementById("subtitleContent").appendChild(spinner);
    }

    timerStep1 = setTimeout(() => {
      subtitleText.textContent = "Oh I found the problem...";
      if (spinner) spinner.remove();

      timerStep2 = setTimeout(() => {
        const oldestId = activeQueue.shift();
        const oldestInput = document.querySelector(
          `input[data-id="${oldestId}"]`,
        );
        if (oldestInput) {
          oldestInput.checked = false;
        }

        updateSubtitle();
      }, 2000);
    }, 5000);
  }

  selectTrigger.addEventListener("click", () => {
    selectWrapper.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!selectWrapper.contains(e.target)) {
      selectWrapper.classList.remove("open");
    }
  });

  customOptions.forEach((option) => {
    option.addEventListener("click", () => {
      customOptions.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      currentProblem = option.getAttribute("data-value");

      if (!currentProblem) {
        selectedLabel.textContent = "Select a problem...";
        problemDescription.textContent = "";
      } else {
        selectedLabel.textContent = option.textContent;
        problemDescription.textContent =
          commentaryData[currentProblem].description;
      }

      selectWrapper.classList.remove("open");
      updateSubtitle();
    });
  });

  inputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = e.target.getAttribute("data-id");

      if (e.target.checked) {
        activeQueue.push(id);
      } else {
        const index = activeQueue.indexOf(id);
        if (index > -1) {
          activeQueue.splice(index, 1);
        }
      }

      updateSubtitle();
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const resultBox = document.getElementById("result");
  const titleEl = document.getElementById("res-title");
  const descEl = document.getElementById("res-desc");
  const logicEl = document.getElementById("res-logic");
  const badgeEl = document.getElementById("res-badge");
  const nodes = document.querySelectorAll(".node");
  const selectWrapper = document.getElementById("selectWrapper");
  const selectTrigger = document.getElementById("selectTrigger");
  const selectedLabel = document.getElementById("selectedLabel");
  const customOptionsContainer = document.getElementById("customOptions");

  const keys = Object.keys(heresyDatabase);
  keys.forEach((key) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "custom-option";
    optionDiv.setAttribute("data-value", key);
    optionDiv.textContent = heresyDatabase[key].label;
    customOptionsContainer.appendChild(optionDiv);
  });

  selectedLabel.textContent = "Select an explanation...";
  currentProblem = null;

  const customOptions = document.querySelectorAll(".custom-option");

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
        selectedLabel.textContent = "Select an explanation...";
        evaluateAnalogy("");
      } else {
        selectedLabel.textContent = option.textContent;
        evaluateAnalogy(currentProblem);
      }

      selectWrapper.classList.remove("open");
    });
  });

  // Modal elements
  const openModalBtn = document.getElementById("open-modal-btn");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modal = document.getElementById("logic-modal");

  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      const nodeName = node.getAttribute("data-node");
      highlightSingleNode(node);
      showNodeInfo(nodeName);
    });
  });

  // Modal event handlers
  openModalBtn.addEventListener("click", () =>
    modal.classList.remove("hidden"),
  );
  closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  function evaluateAnalogy(key) {
    clearHighlights();

    if (!key || !heresyDatabase[key]) {
      resultBox.classList.remove("heresy-failed");
      badgeEl.textContent = "Awaiting Selection";
      titleEl.textContent = "Choose an option above";
      descEl.textContent =
        "Select an explanation to test whether it maintains identity while preserving distinction.";
      logicEl.textContent = "";
      return;
    }

    const data = heresyDatabase[key];
    resultBox.classList.add("heresy-failed");
    badgeEl.textContent = "Declared Heresy";
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    logicEl.textContent = data.logic;

    data.targetNodes.forEach((nodeId) => {
      const target = document.getElementById(nodeId);
      if (target) {
        target.querySelector(".node-circle").classList.add("heresy-active");
      }
    });

    document.querySelectorAll(".link-line").forEach((line) => {
      line.classList.add("pulse-error");
    });
  }

  function highlightSingleNode(selectedNode) {
    clearHighlights();
    selectedNode.querySelector(".node-circle").classList.add("active");
  }

  function clearHighlights() {
    document.querySelectorAll(".node-circle").forEach((el) => {
      el.classList.remove("active", "heresy-active");
    });
    document.querySelectorAll(".link-line").forEach((line) => {
      line.classList.remove("pulse-error");
    });
  }

  function showNodeInfo(nodeName) {
    resultBox.classList.remove("heresy-failed");
    badgeEl.textContent = "Diagram Inspection";
    titleEl.textContent = nodeName;

    if (nodeName === "God") {
      descEl.textContent =
        "The single, indivisible divine essence (Ousia). Orthodoxy asserts God is One in Substance.";
      logicEl.textContent = "Core Axiom: Essence = 1";
    } else {
      descEl.textContent = `One of the three distinct Persons (Hypostases) of the Trinity.`;
      logicEl.textContent = `Core Axiom: ${nodeName} is fully God, but distinct from the other Persons.`;
    }
  }
});

// Declaration of Variables - use of document object models to access the HTML elements.
const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
let isError = false;

function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, "");
}

function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// This function is activated when a user clicks the addEntryButton to add an entry.
function addEntry() {
  const targetInputContainer = document.querySelector(
    `#${entryDropdown.value} .input-container`
  );
  const entryNumber =
    targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  // Building a dynamic HTML string to add to the webpage...
  const HTMLString = `<label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input
    type="text"
    id="${entryDropdown.value}-${entryNumber}-name"
    placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;
  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  // This will return any number inputs that are in the selected element.
  // The querySelector is directed to the input[type=number] of each element.
  const breakfastNumberInputs = document.querySelectorAll(
    `#breakfast input[type=number]`
  );
  const lunchNumberInputs = document.querySelectorAll(
    `#lunch input[type=number]`
  );
  const dinnerNumberInputs = document.querySelectorAll(
    `#dinner input[type=number]`
  );
  const snacksNumberInputs = document.querySelectorAll(
    `#snacks input[type=number]`
  );
  const exerciseNumberInputs = document.querySelectorAll(
    `#exercise input[type=number]`
  );

  // This declarations assign the calories inputs from the query to the specific elements.
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
  // Since budgetNumberInput was already declared earlier with document.getElementById which returns an element not an array-like NodeList, we use an array to achieve the same thing as in the other variables.

  if (isError) {
    return;
  }
  // This if statement resets the logic for invalid in the getCaloriesFromInputs if the input is valid. i.e it resets the isError to false and then continues down the calculateCalories function.

  const consumedCalories =
    breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories =
    budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";

  // Another dynamic HTML to show the output on the page.
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(
    remainingCalories
  )} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove("hide");
  // This will disable this class and all styling associated with it.
}

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    //Logic for invalid input
    if (invalidInputMatch) {
      alert(`"Invalid Input: "${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }

    //Logic for valid input: the number is added to calories.
    calories += Number(currVal);
  }
  return calories;
}

function clearForm() {
  const inputContainers = Array.from(
    document.querySelectorAll(`.input-container`)
  );

  for (const container of inputContainers) {
    container.innerHTML = "";
    // This will clear all the inputs of .input-container.
    // This simplifies clearing all .input-containers at once.
  }

  budgetNumberInput.value = "";
  output.innerText = "";
  // By doing this, contents that were dynamically added in the calculateCalories() will be changed to an empty string.
  output.classList.add("hide");
}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);

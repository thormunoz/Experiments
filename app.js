function findRecipes(myInventory) {
  let validRecipes = [];
  
  // Helper to extract names and find overlapping traits
  function getMatchingEffects(ing1, ing2, ing3 = null) {
    // Map objects down to just names: ["Weakness to Frost", "Fortify Sneak"...]
    let effects1 = ing1.effects.map(e => e.name);
    let effects2 = ing2.effects.map(e => e.name);
    let allEffects = [...effects1, ...effects2];
    
    if (ing3) {
      let effects3 = ing3.effects.map(e => e.name);
      allEffects.push(...effects3);
    }
    
    // Find effects that appear more than once
    let counts = {};
    allEffects.forEach(e => counts[e] = (counts[e] || 0) + 1);
    return Object.keys(counts).filter(e => counts[e] > 1);
  }

  // 1. Check all 2-ingredient pairs
  for (let i = 0; i < myInventory.length; i++) {
    for (let j = i + 1; j < myInventory.length; j++) {
      let matches = getMatchingEffects(myInventory[i], myInventory[j]);
      if (matches.length > 0) {
        validRecipes.push({
          ingredients: [myInventory[i].name, myInventory[j].name],
          effects: matches,
          efficiencyScore: calculateEfficiency(myInventory[i], myInventory[j])
        });
      }
    }
  }
  
  // 2. Check all 3-ingredient combinations
  for (let i = 0; i < myInventory.length; i++) {
    for (let j = i + 1; j < myInventory.length; j++) {
      for (let k = j + 1; k < myInventory.length; k++) {
        let matches = getMatchingEffects(myInventory[i], myInventory[j], myInventory[k]);
        if (matches.length > 0) {
          validRecipes.push({
            ingredients: [myInventory[i].name, myInventory[j].name, myInventory[k].name],
            effects: matches,
            efficiencyScore: calculateEfficiency(myInventory[i], myInventory[j], myInventory[k])
          });
        }
      }
    }
  }
  return validRecipes.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
}

function calculateEfficiency(ing1, ing2, ing3 = null) {
  // Profit Score: Value generated minus individual ingredient base cost
  let totalValue = ing1.goldValue + ing2.goldValue + (ing3 ? ing3.goldValue : 0);
  return totalValue; 
}

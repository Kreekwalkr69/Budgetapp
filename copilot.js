const readline = require ('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let counter = 1;
const userObjects = {}; 


class IncomeStatement {
  constructor(name, incomeSource, amount) {
    this.name = `${incomeSource}`
    this.incomeSource = incomeSource;
    this.amount = amount;
  }
};

function askQuestion (query) {
  return new Promise (resolve => rl.question(query, resolve));
};

async function monthLoop () {
  //creates a list named by user to represent a month, and is stored in userObjects object
  const monthName = await askQuestion("Please enter the month you would like to log your income for: ");
  userObjects[monthName] = [];
//main actual looping part
  while (true) {
    //income source is user inputed
    const incomeSource = await askQuestion("Please enter a source of income from your balance sheet, or type 'x' to finish: ")
    if (incomeSource == 'x') break;
    // amount is user inputed
    let amount;
    while (true) {
      const amountInput = await askQuestion("Please enter the $ amount indicated on your balance sheet: ");
      amount = amountInput;
      if (!isNaN(amount)) break;
      console.log("Please enter a number value.")
    }
    
    //creates a statement object with two properties, income source and amount, and makes each property what the user input made, respectively
    const statement = new IncomeStatement(incomeSource, incomeSource, amount)
    userObjects[monthName].push(statement)
    console.log(`Added: ${statement.name}`);
    counter++; 

    //also adds that statement object to the month list that the user 'created' and adds a count to differentiate
  }
  
  // Summarize and log total by source
const summarizedStatements = {};

userObjects[monthName].forEach(statement => {
  const source = statement.incomeSource;
  const amount = parseFloat(statement.amount);
  if (summarizedStatements[source]) {
    summarizedStatements[source] += amount;
  } else {
    summarizedStatements[source] = amount;
  }
});

//logs / summarized income statements  
console.log(`\nSummarized income for ${monthName}:`);
Object.entries(summarizedStatements).forEach(([source, total], index) => {
  console.log(`${index + 1}. Source: ${source}, Total Amount: $${total.toFixed(2)}`);
});
// once user has finished the month it asks if the user would like to make another month
  const continueQ = await askQuestion('Would you like to log another month of income? yes(y) no(n) ');
  if (continueQ == 'y') {
    await monthLoop();
  } else {

    console.log("\nAll logged months and their itemized statements:\n");
//logs month name
    for (const [month, statements] of Object.entries(userObjects)) {
    console.log(`>>> ${month}:`);

  if (statements.length === 0) {
    console.log("  (No statements for this month)");
  } else {
    // Sort statements by incomeSource alphabetically
    const sorted = statements.slice().sort((a, b) =>
      a.incomeSource.localeCompare(b.incomeSource)
    );

    sorted.forEach((statement, index) => {
      console.log(`  ${index + 1}. Source: ${statement.incomeSource}, Amount: $${parseFloat(statement.amount).toFixed(2)}`);
    });
  }

  console.log(""); // Add spacing between months
}


  }
  //closes readline if the loop is broken so the program ends 
  rl.close();
}   


// calls main loop function to run
monthLoop();
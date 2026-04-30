function findEvenNumbers(InputArray) {
	let evenNumbers = InputArray.filter((num) => num % 2 === 0);
	return evenNumbers;
}

// console.log(findEvenNumbers([1, 2, 3, 4, 5, 6])); //output: [ 2, 4, 6 ]

function findOddNumbers(InputArray) {
	let oddNumbers = InputArray.filter((num) => num % 2 !== 0);
	return oddNumbers;
}

// console.log(findOddNumbers([1, 2, 3, 4, 5, 6])); //output: [ 1, 3, 5 ]

function findPrimeNumbers(InputArray) {
	let primeNumbers = InputArray.filter((num) => isPrime(num));
	return primeNumbers;
}

// console.log(findPrimeNumbers([1, 2, 3, 4, 5, 6])); //output: [ 2, 3, 5 ]

function isPrime(num) {
	if (num <= 1) return false;
	for (let i = 2; i < num; i++) {
		if (num % i === 0) return false;
	}
	return true;
}

// String character count

function countOfEachCharacter(InputString) {
	let charCount = {};
	for (let char of InputString) {
		if (charCount[char]) {
			charCount[char]++;
		} else {
			charCount[char] = 1;
		}
	}
	return charCount;
}

// console.log(countOfEachCharacter("salman"));

function findLargestNumber(InputArray) {
	// return Math.max(...InputArray);
	let largestNumber = InputArray[0];
	for (let i = 1; i < InputArray.length; i++) {
		if (InputArray[i] > largestNumber) {
			largestNumber = InputArray[i];
		}
	}
	return largestNumber;
}
// console.log(findLargestNumber([10, 5, 25, 8, 15]));

function xyz(InputArray) {
	let abc = [];
	for (let i = 0; i < InputArray.length; i++) {
		abc[InputArray[i]] = InputArray[i];
	}
	return abc;
}
// console.log(xyz([1, 2, 2, 3, 4, 4, 5]));

let arrayObject = [
	{ name: "A", price: 300 },
	{ name: "B", price: 100 },
	{ name: "C", price: 200 },
];

function sortByPrice(arrayObject) {
	return arrayObject.sort((a, b) => a.price - b.price);
}
console.log(sortByPrice(arrayObject));

const products = [
	{ name: "A", price: 50 },
	{ name: "B", price: 30 },
	{ name: "C", price: 40 },
];

function getName(products) {
    return products.map((product) => product.name);
}
console.log(getName(products));
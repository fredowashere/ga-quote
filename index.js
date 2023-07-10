const unicodeLow = 32;
const unicodeHigh = 126;
const quote = "That's one small step for a man, a giant leap for mankind.";

function coinFlip() {
    return Math.random() > 0.5;
}

function random(min, max) {

    if (Array.isArray(min)) {
        return min[Math.floor(Math.random() * min.length)];
    }

    return min + Math.random() * (max - min);
}

function DNA(genes) {
    this.mutationRate = 0.03;
    this.genes = genes || Array(quote.length).fill(0)
        .map(() => String.fromCharCode(random(unicodeLow, unicodeHigh)));
}

DNA.prototype.getFitness = function () {
    let sum = 0;
    for (let i = 0; i < quote.length; i++) {
        if (this.genes[i] === quote[i]) {
            sum++;
        }
    }
    return sum;
};

DNA.crossover = function (a, b) {
    const len = quote.length;
    const lenHalf = quote.length / 2;
    const [ floor, ceil ] = [ Math.floor(lenHalf), Math.ceil(lenHalf) ];
    const [ father, mother ] = coinFlip() ? [ a, b ] : [ b, a ];
    return new DNA([
        ...father.genes.slice(0, ceil),
        ...mother.genes.slice(len - floor)
    ]);
};

DNA.prototype.mutate = function () {
    for (let i = 0; i < this.genes.length; i++) {
        if (Math.random() < this.mutationRate) {
            this.genes[i] = String.fromCharCode(random(unicodeLow, unicodeHigh));
        }
    }
}

const populationSize = 1e2;
let population = [];
for (let i = 0; i < populationSize; i++) {
    population.push(new DNA());
}

const startTime = Date.now();
let iterations = 0;
function loop() {
    
    // Rank by fitness
    population.sort((a, b) => b.getFitness() - a.getFitness());
    
    // Select
    const selected = population.slice(0, Math.floor(population.length * 0.1));

    const strongest = selected[0];
    console.log(iterations++, strongest.genes.join(""));
    if (strongest.genes.join("") === quote) {
        return console.log("FOUND after", (Date.now() - startTime) / 1000, "seconds");
    }

    // Reproduce FROM THE SELECTED ONES!!!
    const newPopulation = [];
    while (newPopulation.length < population.length) {
        const [ a, b ] = [ random(selected), random(selected) ];
        const child = DNA.crossover(a, b);
        child.mutate();
        newPopulation.push(child);
    }
    population = newPopulation;

    window.requestAnimationFrame(loop);
}

loop();
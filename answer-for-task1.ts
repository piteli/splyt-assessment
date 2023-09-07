//Task 1 - Answer

async function retryFailures<T>(fn: () => Promise<T>, retries: number): Promise<T> {
    let currentIndex = 1;

    return new Promise(async(resolve, reject) => {
        while(currentIndex <= retries) {
            try {
              const response = await fn();
              if(typeof response === 'number') {
                resolve(response);
              }
            } catch(e) {
              if(currentIndex >= retries) {
                reject(e);
              }
            } finally {
              currentIndex++;
            }
        }
    })
}

function createTargetFunction(succeedsOnAttempt: number) {
    let attempt = 0;
    
    return async () => {
    if (++attempt === succeedsOnAttempt) {
        return attempt;
    }

    throw Object.assign(new Error(`failure`), { attempt });
    };
}

// Examples
// succeeds on attempt number 3
retryFailures(createTargetFunction(3), 5).then((attempt) => {
  console.assert(attempt === 3);
});

// fails on attempt number 2 and throws last error
retryFailures(createTargetFunction(3), 2).then(() => {
  throw new Error('should not succeed');
}, (e) => {
  console.assert(e.attempt === 2);
});

// succeeds
retryFailures(createTargetFunction(10), 10).then((attempt) => {
  console.assert(attempt === 10);
});

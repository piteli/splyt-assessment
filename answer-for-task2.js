//Task 2 - Answer

function add(a, b) {
    return a + b;
};

function retrieveParamNameFromFunction(fn) {
    const fnStr = fn.toString();
    const match = fnStr.match(/\(([^)]+)\)/);

    if (!match) {
        throw new Error("Unable to retrieve parameter names from the function.");
    }

    return match[1].split(',').map(param => param.trim());
}

function defaultArguments(fn, unorderObject) {
  return (...newValues) => {
    const listOfValues = [];

    const ordered = Object.keys(unorderObject).sort().reduce(
        (obj, key) => { 
          obj[key] = unorderObject[key]; 
          return obj;
        }, 
        {}
    );
    
    let index = 0;
    for(let item in ordered) {
        listOfValues.push(ordered[item]);
        if(newValues[index] !== undefined) {
            listOfValues[index] = newValues[index];
        }
        index++;
    }
    return fn(...listOfValues);
  }
}

function defaultArguments(fn, object) {
    return (...newValues) => {
      let listOfValues = [];
      let useObject = object;

      for(let value of newValues) {
        if(typeof value === 'number') {
            listOfValues.push(value);
        } else {
            useObject = {...useObject, ...value};
        }
      }
  
      const orderedObject = Object.keys(useObject).sort().reduce(
          (obj, key) => { 
            obj[key] = useObject[key]; 
            return obj;
          }, 
          {}
      );

      const getAllParamsNameInFunction = retrieveParamNameFromFunction(fn);
      const [firstElement] = getAllParamsNameInFunction;
      if(firstElement === '...newValues') {
        listOfValues.push(orderedObject);
      } else {
        listOfValues = [];
        getAllParamsNameInFunction.forEach((item, index) => {
            if(orderedObject[item] !== undefined) {
                listOfValues[index] = orderedObject[item];
            }
            if(newValues[index] !== undefined && typeof newValues[index] === 'number') {
                listOfValues[index] = newValues[index];
            }
        })
      }
      return fn(...listOfValues);
    }
  }

  const add2 = defaultArguments(add, { b: 9 });
  console.assert(add2(10) === 19);
  console.assert(add2(10, 7) === 17);
  console.assert(isNaN(add2()));
  const add3 = defaultArguments(add2, { b: 3, a: 2 });
  console.assert(add3(10) === 13);
  console.assert(add3() === 5);
  const add4 = defaultArguments(add, { c: 3 }); // doesn't do anything, since c isn't
  console.assert(isNaN(add4(10)));
  console.assert(add4(10, 10) === 20);
  const add5 = defaultArguments(add2, { a: 10 }); //extends add2
  console.assert(add5() === 19); // a=10, b=9
// NOTE: and object is deemed iterable when it has the implementation for the
// [Symbol.iterator]() method, some built-in javascript function already has it on
// such as array, string etc, for the purpose of the demo we are gonna turn a class into 
// a perfect iterable object for using for...of...loop on 

interface IterableCustomization<T> {
    [Symbol.iterator](): Iterator<T>
}

class MyIterable<T> implements IterableCustomization<T> {
    constructor(private items: T[]) {
        // NO BODY
    }

    [Symbol.iterator](): Iterator<T> {
        return new MyIterator(0, false,this.items)
    }
}

// an iterator is an object that can used to iterate over a sequence of values 
// and stop at specific point
class MyIterator<T> implements Iterator<T> {
     constructor(private index: number, private done: boolean, private items: T[]) {}
     next(): IteratorResult<T> {
        if(this.index == this.items.length) {
            this.done = true
        }
        return {value: this.items[this.index++], done: this.done}
     }
}

// testing out the clas-based iterator
for (let items of new MyIterable(["a", "b", "d", "c"])) {
    console.log(items)
}


// TODO: when it comes to work with pure function and make it iterable apply these methods
function Iterate<T>(items: T[], index: number, done: boolean): IterableCustomization<T> {
    const IterableImplementation: IterableCustomization<T> = {
        [Symbol.iterator](): Iterator<T> {
            return IteratorCustomization(items, index, done)
        }
    }
    
    return IterableImplementation
}

function IteratorCustomization<T>(items: T[], index: number, done: boolean): Iterator<T> {
    return {
        next(): IteratorResult<T> {
            if(index === items.length) {
                done = true
            }
        return {value: items[index++], done}
        }
    } as Iterator<T>
}

// testing out the function-based iterator
for (let item of Iterate([2, 3, 4, 5], 0, false)) {
    console.log(item)
}
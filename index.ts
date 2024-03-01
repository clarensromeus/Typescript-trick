import { parse } from "node:path/posix";

interface User {
    firstname: string;
    lastname: string;
    animal(bird: "Eagle", count: number): string
}

interface User {
    age: number
}


class Animal {
    public animal: Animal.Bird = {kind: "Eagle"}
    Status: Animal.Single = {status: "married"}
}

namespace Animal {
    export interface Fish {
        count: number;
        kind: "Eel"
    }

    export interface Bird {
        kind: string
    }
    type AorB = "married" | "single"
    export class Single {
        public status: AorB = "married" 
    }
    
}

function buildSport(muscle: number) {
    return `my name is ${buildSport.username} and i have ${muscle} i do sport only ${buildSport.sportDays}`
}

namespace buildSport {
   export let username: string = "clarens romeus"
   export let sportDays: number = 33
}

console.log(buildSport(22))
const cs: Animal = new Animal()
console.log(cs.animal)
console.log(cs.Status.status) 
let a = 23


enum Shape {
    Circle = "Circle",
    Square = "Square"
}

type av = {first: Shape.Circle, second: Shape.Square}
const res: av = {first: Shape.Circle, second: Shape.Square}
const ab: Shape = Shape.Circle
console.log(ab)


const Firstname = Symbol()
const Lastname = Symbol()
const Fullname = Symbol()


class D {
    [Firstname]: string = "clarens";
    [Lastname]: string = "romeus";

    [Fullname](age: number) {
        return `${this[Firstname]} ${this[Lastname]} ${age}`  // this[Firstname] is the value of the Firstname symbol, and this[Lastname] is the value of the Lastname symbol.
    }
    
}

const d = new D()
console.log(d[Firstname], d[Lastname], d[Fullname](25))

interface Iuser {
    username: string;
    phoneNumber: number | boolean;
    customers: string[] | number
}

const user = {
    "first": {username: "clarens romeus", phoneNumber: 48845162, customers: ["S. engineer", "Computer bussiness"]}
} satisfies Record<string, Iuser>


// a proxy is an object that wraps another object and then intercept some operations like 
// reading, writing, validating and formatting the original object 
const data = new Proxy(user, {
    get: (target, prop)=> {
        
    }
})

interface Itarget {
    username: string;
    email: string;
    password?: number;
    extensible: boolean
}

const target: Itarget = {
  username: "clarensromeus",
  email: "clarensromeus@gamail.com",
  password: 4947493439,
  extensible: true
}

const handler2 = {
  get(target: any, prop: string) {
    const rs = target[prop].length > 10 ? target[prop] : "too short"
    return rs
  },
};

const secondUser: Itarget = {
    username: "clervil", 
    email: "clervilwoodlet49@gmail.com",
    password: 439393939,
    extensible: true
}

const proxy2 = new Proxy(target, {
    getOwnPropertyDescriptor(target: any, p: string) {
        let value: string = p === "password" ? "sorry access denied" : target[p]
        return {configurable: true, writable: true, enumerable: true, value}
    },
   ownKeys(target: any) {
     console.log("all keys are really", [Object.keys(target).find(key => key !== "password")])
     
     return Object.keys(target).filter(key => key !== "password")
   },
   deleteProperty(target, p) {
    let message: string = "no property of the kind"
        if(!(p in target)) {
         console.log(message)
         return false
       }
         console.log("delete with success")
         delete target[p]
         return true
       
   },
   getPrototypeOf(target) {
       return secondUser
   },
   has(target, key) {
       if(key == "password") {
           return false
       }
       return key in target
   },
   isExtensible(target) {
       return Object.isExtensible(target)
   }, 
   preventExtensions(target) {
       target.extensible = false;
       return Object.preventExtensions(target)
   },
   set(target, p, newValue, receiver) {
       if(p === "password") {
            console.log("sorry password cannot change")
           return false
       } else if(p === "username" && newValue.length < 5) {
           console.log("sorry username is too short")
           return false
       } else {
           target[p] = newValue
           return true
       }
       
   },
   setPrototypeOf(target: any, v: any) {
       target.email =  v.email
       target.username = v.username
       return true
   },
}) as Itarget;

console.log(proxy2.password)
console.log("password" in proxy2)
delete proxy2.password
console.log("password" in proxy2)
console.log(Object.getPrototypeOf(proxy2).username, Object.getPrototypeOf(proxy2).email)
console.log(Object.getPrototypeOf(proxy2) === secondUser)
console.log("email" in proxy2)
console.log("after extension and prevent extension")
console.log(Object.isExtensible(proxy2))
console.log(Object.preventExtensions(proxy2))
console.log(proxy2.extensible)
console.log(Object.isExtensible(proxy2))
proxy2.username = "prophete allrich"
console.log(proxy2.username)
Object.setPrototypeOf(proxy2, secondUser)
console.log(Object.getPrototypeOf(proxy2).username, Object.getPrototypeOf(proxy2).email)

function testFunc(this:{age: number, proff: string}, firstname: string, lastname: string) {
     return `${this.age} ${this.proff} ${firstname} ${lastname}`
}

const pro = new Proxy(testFunc, {
    apply(target, thisArg, argArray: any) {
        return Reflect.apply(target, thisArg, argArray)
    },
})

// call pro function with all arguments inside
console.log(pro.apply({age: 23, proff: "engineer"}, ["clarens", "romeus"]))

// creating  a symbol with teacherInfo key
const teacherInfo = Symbol.for("teacherInfo")


class Teacher {
    public info: Record<string, string> = {}
    constructor(public name: string, public course: string, private hours: number) {}

    [teacherInfo]() {
        return `${this.name} teaches ${this.course} for ${this.hours} hours`
    }  
}

// proxy.construct uses the trap [[Construct]] that is used with the new operator to instanciatiate an object
const teacher = new Proxy(Teacher, {
    construct(target, argArray: any, newTarget) {
        // return Reflect.construct(target, argArray, newTarget)
       return new target(argArray[0], argArray[1], argArray[2]) 
    }
})

console.log(new teacher("clarens", "computer science", 33)[teacherInfo]())

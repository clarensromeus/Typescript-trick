
import  "reflect-metadata"

@Complete
class BugReport {
  type: string = "first";
  next: number = 55;
  title: string;
 
  constructor(t: string) {
    this.title = t;
  }
}

function Alter<T extends {new (...args: any[]): {}} >(constructor: T) {
    return class extends constructor {
    type = "altered"; 
    title = "the title is for me a big price right now "
  } as T;
} 

function Complete(target: new (...args: any[]) => {}) {
    return class extends  target {
    type: string = "complete";
    title: string = "the title is for me a big price right now "
    next: number;
   constructor(...args: any[]) {
      super(...args);
      this.next = 100
      
    }
  }
}


// NOTE: this implementation is only for property decorator
class Property { 
    @ProDecor public username: number = 5
}

// TODO: the decorator that will attached to the class property and alter its result
function ProDecor(target: any, key: string | symbol) {
    let currentProperty: number = target[key]
    Object.defineProperty(target, key, {
        get: () => {
            if(currentProperty < 10) {
                currentProperty += 10  
            } else {
                currentProperty
            }
            return currentProperty
        },
        set: (newProp) => {
            currentProperty = newProp 
        }
    })
}

const pro = new Property()
console.log(pro.username)
pro.username = 7
console.log(pro.username)

//NOTE: this class is for checking property requirement
class User {
    @required public username?: string
}

// TODO: declaring and implementing decorator which goes by required
function required(target: any, key: string | symbol) {
    let currentProperty: string = target[key]
    // if the username is undefined display out an upleasant message 
    if(typeof currentProperty === "undefined") {
       return Object.defineProperty(target, key, {value: "username cannot be undefined"})
    }
    // else display the username 
    return Object.defineProperty(target, key, {value: currentProperty})
}

const user = new User()
console.log(user.username)


interface Info<S> {
    name: S;
    id: number;
    school_name: S
}
// TODO: this class is for method decorator 
class School {
    // Parameter properies
    constructor(private student_name: string, public student_id: number) {
        // No body
    }
    
    @isEnumerable(false)
    @isConfigurable(true)
    student_info(school_name: string): Info<string> {
        return {name: this.student_name, id: this.student_id, school_name: school_name}
    }
}

// HACK: create the isEnumerabel decorator 
function isEnumerable(value: boolean) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value
    }
}

// HACK: create the isConfigurable decorator 
function isConfigurable(value: boolean) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value
    }
}

// NOTE: class for conditional check out a method decorator
class Institution {
    // parameter properties
    constructor(private name: string, public people: number, public Total: number) {
        // No body
    }

    @GreaterThan20(true)
    Average(Note: number): number {
        return (this.people * 2) / Note
    }

    //@GreaterThan20ForAccessor(true)
    get(): number {
        return this.Total
    }

    set(Note: number) {
        this.Total = (this.people * 2) / Note
    }
}


function GreaterThan20(config: boolean) {
    return function (target: any, name: string | symbol, descriptor: PropertyDescriptor) {
        let original = descriptor.value
        descriptor.configurable = config 
        descriptor.value = function(...args: any[]) {
           if(typeof args[0] === "number") {
            const result: number = original.apply(this, args)
            if(result < 20) {
                return result + 20
            }
            return result
           } else {
            // if type of the first argument is not a number print only a default value
           const defaultValue: number = 20
           return defaultValue
           }
           
        }
    }
}

function GreaterThan20ForAccessor(config: boolean) {
    return function (target: any, name: string, descriptor: PropertyDescriptor) {
        let original = descriptor.get
        descriptor.configurable = config
        descriptor.get = function() {
           let result = original?.apply(this)
           if(result && result < 20) {
            return result + 10
           } else {
            const defaultValue: number = 20
            return defaultValue
           }
        }
    }
}

const institution: Institution = new Institution("Washington School", 10, 10)
console.log("one test for the institution class Average method")
console.log(institution.Average(10))
// testing the accessor decorator right now 
const institutionacc: Institution = new Institution("New york city", 200, 20)
console.log("one test for the institution accessor") 
institutionacc.set(20)
console.log(institutionacc.get())

// NOTE: last but not least this class tests a parameter decorator
class Param {
    // Parameter properties
    constructor(private username: string, priviledge: boolean) {
        // No body
    }
}

// TODO: declaring the required decorator for the parameter for username in the class Param using reflect metadata
function requiredParam(target: any, key: string | symbol, index: number) {
    let requiredParameters: string[] = Reflect.getOwnMetadata("required", target, key) || []
    requiredParameters.push(key.toString())
    Reflect.defineMetadata("required", requiredParameters, target, key)
}


// NOTE: this class is for testing the parameter decorator of a method
class Administration{
    // Parameter properties
    constructor(private username: string, private priviledge: boolean, public ammountToPay: number) {
        // No body
    }
    
    @Validator("admin")
    creditCardPay(@Required totalAmount: number) {
        return totalAmount - this.ammountToPay
    }
}


function Required(target: any, propertykey: string | symbol, index: number) {
    // if the property exists proceed then on to further 
    if(propertykey && typeof index === "number") {
        Reflect.defineMetadata("creditCard", [true, index], target, propertykey)
    } 
}

function Validator(role: string) {
    // validator decorator factory to dynamically customize the decorated declaration
    return (target: any, propertykey: string | symbol, descriptor: PropertyDescriptor) => {
        let metadataKeys: (boolean | number)[] = Reflect.getMetadata("creditCard", target, propertykey ) 
        let propertyValue = descriptor.value
        console.log("all metadata keys",metadataKeys)
        descriptor.value = function(...args: any[]){
            if(role === "admin") {
                if(metadataKeys[0] === true && metadataKeys[1] as number === 0) {
                    const result: number = propertyValue.call(this, args)
                    return result
                } else {
                 throw new Error("sorry you cannot because you're broke")
                }             
            } else {
                throw new Error("sorry you're not authorized !")
            }
        }
    }
}

// testing out the credit card payment method from the Administration class
const credit = new Administration("romeus clarens", true, 20)
console.log(credit.creditCardPay(100))

// NOTE: there are three design-time type annotions in reflect-metadata
// 1) Design-time Type annotation  2) Design-time Parameter Types annotation 
// 3) Design-time Return Type annotation
const rturn = {firstname: "clarens", lastname: "romeus"}
class Hospital {
    // design Type
    @Reflect.metadata("design:type", "number")
    public patients: number = 20
  
    // design ParamTypes
    @Reflect.metadata("design:paramtypes", "number")
    public Surgery(doctors: number) {
        return this.patients + doctors
    }
     
    // design Return Type
    @Reflect.metadata("design:returntype", "string")
    protected CheckUp(): string {
        return "patient is : romeus clarens"
    }
}

const hospital = new Hospital()
const metadataParam = Reflect.getMetadata("design:paramtypes", hospital, "Surgery")
console.log(metadataParam)
const metadata = Reflect.getMetadata("design:returntype", hospital, "CheckUp")
console.log(metadata)
const metadata2 = Reflect.getMetadata("design:type", hospital, "patients")
console.log(metadata2)

// HACK: alternative logics to collect metadata using Design-time type annotations
function Type<T>(type:T) {return Reflect.metadata("design:type", type)}
function ParamTypes<T>(type: T) {return Reflect.metadata("design:paramtypes", type)}
function ReturnType<T>(type: T) {return Reflect.metadata("design:returntype", type)}

class Hospiatal2 {
    @Type(Number)
    public patients: number = 50

    @ParamTypes(Number)
    public Surgery(doctors: number) {
        return this.patients + doctors
    } 
    
    @ReturnType(String)
    @ParamTypes(String)
    protected CheckUp(owner_name: string): string {
        return "patient is : prophete allrich"
    }
}

let hospital2: Hospiatal2 = new Hospiatal2()
// retrieve metadata from some of the Hospital2 class properties
console.log(Reflect.getMetadata("design:type", hospital2, "patients"))
console.log(Reflect.getMetadata("design:paramtypes", hospital2, "Surgery"))
console.log(Reflect.getMetadata("design:returntype", hospital2, "CheckUp"))
// test if design type exists on the Patient propertyname
if(Reflect.hasMetadata("design:type", hospital2, "CheckUp")) {
    console.log(true)
}
// test if design return type exists on the CheckUp propertyname
if(Reflect.hasMetadata("design:returntype", hospital2, "CheckUp")) {
    console.log(true)
} else {
    console.log(false)
}





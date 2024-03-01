// a mixin is a working pattern which is using generics with class inheritance to extend a Base clas 
interface IUser {
    username: string;
    Email: string
}

function User<T>() {
    return class UserInfo {
        private userData: Record<string,T> = {}

        set(id: string, value: T) {
            this.userData[id] = value
        }
    
        get(id: string): T {
            return this.userData[id]
        }

        
        allUserData(): object {
            return this.allUserData
        }
    }
}

// this a receives a construct signature 
type Constructor<T> = new (...args: any[]) => T

// contrain the callable class with allUserData to be more specific
function Mixin<T extends Constructor<{allUserData(): object}>>(TBase: T) {
    return class Dumpable extends TBase {
       public Note: number = 0
       public School: string = ""

       dumpData() {
         return this.allUserData
       }

       userStatistics(username: string, Email: string, Phone: number) {
         return {username, Email, Phone, Note: this.Note, School: this.School}
       }
    }
}

// first off all i'm initializing the User
const userData = User<IUser>()
// pass the userInfo class to the Mixin function via the user method
const mixin = Mixin(userData)
const dumpable = new mixin()
dumpable.set("a", {username: "clarens romeus", Email: "clarensromeus303@gmail.com"})
dumpable.set("b", {username: "prophete allrich", Email: "propheteallrich23@gmail.com"})
dumpable.Note = 233
dumpable.School = "IDOL"
const firstuser: IUser = dumpable.get("a")
console.log(dumpable.userStatistics(firstuser["username"], firstuser["Email"], 459533833))
console.log(dumpable.dumpData)

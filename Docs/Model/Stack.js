let fs = require('fs');

/* Linked List based Stack */
var id = 0;

function uuid(){
    id = id + 1;
    return id;
}

class Node{
    
    constructor(back=null,v=null){
       this._back = back;
       this._v = v;
    }
    
    get back(){
        return this._back;
    }
    
    set back(n){
        if (n instanceof Node){
            this._back = n;
        }
        else{
            if(n==null)this._back = null;
            else throw "Argument to back not a Node";
        }
    }
    
    get value(){
        return this._v;
    }
    
    set value(v){
        this._v = v;
    }
}

class Stack {
    
    constructor(id=0){
        let d = new Date();
        this._head = this;
        this._count = 0;
        this._creation = d;
        this._updation = d;
        this._uuid = uuid();
        this._listener = null;
        this[Symbol.iterator] = this.SGenerator;
    }

    addListener(l){
        if(this._listener === null) this._listener = new Stack();
        if(l instanceof Function) this._listener.push(l);
        else {
            if(l instanceof Node  && l.value instanceof Function){
                this._listener.push(l);
            }
            else{
                throw "Illegal Listener";
            }
        }
        return this;
    }

    fireEvent(e,v){
        if(!(this._listener === null || this._listener.count === 0)){
          for(let l of this._listener.iterator)l(e,v,this);
        }
    }
    
    push(v){
        if(v==null) throw "Can't push Null Values";
        let n  = new Node(this._head,v);
        this._head.front = n;
        this._head = n;
        this._count++;
        this._updation = new Date();
        this.fireEvent("push",n.value);
    }

    pop(){
      let current = null;
      if (this._count == 0) return current;
      current = this._head;
      this._head = this._head.back;
      this._count--;
      this._updation = new Date();
      current.back = null;
      this.fireEvent("pop",current.value,this);
      return current.value;
    }
    
    peek(){
          return this._head.value;
    }
    
    flush(){
        this._head = null;
    }
    
    isEmpty(){
       return this._head === null;
    }
    
    get head(){
        return this._head;
    }
    
    get creation(){
        return this._creation;
    }
    
    set creation(v){
        this._creation = v;
    }
    
    get updation(){
        return this._updation;
    }
    
    set updation(v){
        this._updation = v;
    }
    
    get count(){
        return this._count;
    }
    
    set count(v){
        this._count = v;
    }
    
    get uuid(){
       return this._uuid;
    }
    
    *SGenerator(){
        let cursor = this._head;
        for( let index = 0; index < this.count ; index++){
            yield cursor.value;
            cursor = cursor.back;
        }
    }

    get iterator(){
        return this.SGenerator();
    }
    
    reduce(op,acc=null){
        let itr = this.iterator;
        if(acc == null){
            if((acc = itr.next()).done) return null;
            else acc = acc.value;
        }
        for(let v of itr) acc = op(v,acc);
        return acc;
    }

    map(op,order = true){
        let s = new Stack();
        for(let v of this.iterator) s.push(op(v));
        return order ? s.reverse() : s;
    }

    forEach(op){
        for(let v of this.iterator){
            op(v);
        }
    }

    filter(op,order=true){
        let s = new Stack();
        for(let v of this.iterator)if(op(v))s.push(v);
        return order ? s.reverse() : s;
    }
    
    reverse(){
        let s = new Stack();
        for(let v of this.iterator) s.push(v);
        return s;
    }

    toTatva(){
        console.log("To Tatva Called");
        let data = [];
        for(let v of this.iterator){
             let obj = {
                media_type:"",
                data:Buffer.from(JSON.stringify(v)).toString('base64'),
                md5:""
             }
             data.push(obj);
        }
        fs.writeFileSync("./StackStore/"+(this._uuid).toString()+'.json',JSON.stringify(data));
    }

}

Stack.fromTatva=function(filename,data)
{
    data = JSON.parse(fs.readFileSync("./StackStore/"+filename));
    console.log(filename.split(".")[0]);
    let s = new Stack(parseInt(filename.split(".")[0]));
    length = data.length;
    for(let i = 0; i < length ; i++){
        s.push(JSON.parse(Buffer.from(data.pop().data, 'base64').toString()));
    }
    return s;
}



/* AdHoc Manual Test */

function main(){
    let s1 = new Stack();
    s1.addListener((v1,v2,v3)=>{
        console.log("Listener1 Called");
        console.log("Event is",v1);
        console.log("Value is ",v2);
    })
    s1.addListener((v1,v2,v3)=>{
        console.log("Listener2 Called");
        console.log("Event is",v1);
        console.log("Value is ",v2);
    })
    s1.push(10);
    s1.push(20);
    s1.push(30);
    s1.push(40);
    let s2 = new Stack();
    s2.push("cat");
    s2.push("dog");
    s2.push("donkey");
    s2.push("grapes");
    for(let v of s2.iterator){
        console.table(v);
    } 
    s1.push(51);
    s1.push(99);
    for(let v of s1){
        console.table(v);
    } 
    let y = s1.pop();
    let z = JSON.stringify(y);
    console.log(typeof(z));
    let m = Buffer.from(z).toString('base64');
    console.log(`y=${y},z=${z},m=${m}`);
    
    let x = s1.reduce((e,acc)=>e+acc);
    console.log(x);
    s1.map((e)=>e*3).filter((e)=>e>60).forEach(console.log);
    //js = JSON.stringify(s1);
    //console.log(js);
    s1.toTatva();
    console.log("Creating Stack s3");
    s3 = Stack.fromTatva("1.json");
    for(var v of s3){
        console.log(v);
    }
}


main();

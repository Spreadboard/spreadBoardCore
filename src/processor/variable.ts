class SpreadBoardVariable<Type>{
    private declare initVal:Type;
    private declare curValue:Type;
    private declare edited:boolean;
    private readonly onChange: Function;

    constructor(onChange: Function) {
        this.onChange = onChange;
    }

    getEdited = ()=>this.edited;

    set(newVal:Type){
        const oldVal = this.curValue;
        this.curValue = newVal;
        if(oldVal!= this.curValue) {
            this.edited=true;
            this.onChange(newVal);
        }
    }

    setInitial(val:Type){
        const oldVal = this.curValue;
        this.initVal=val;
        if(!this.edited) {
            this.curValue = val;
            if(oldVal!=this.curValue){
                this.onChange(val);
            }
        }
    }

    reset(){
        const oldVal = this.curValue;
        this.curValue = this.initVal;
        this.edited = false;
        if (this.curValue != oldVal)
            this.onChange(this.curValue);
    }

    get = () => this.curValue;
    getInitial = () => this.initVal;

}

export type SpreadBoardStack = {variables: Map<string, SpreadBoardVariable<any>>, subStacks: Map<number,SpreadBoardStack>};


export {SpreadBoardVariable};
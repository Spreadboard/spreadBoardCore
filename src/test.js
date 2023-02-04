const ggt = require('@/ggt');
const { combineLatest } = require('rxjs');
const { seperate } = require('./variable');

const node90 = seperate(((obs) => {
    let res = new ObservableVariable({ num: 0 });
    if (!silent)
        this.liveValues.get(node.id)?.subscribe(
            (val) => {
                res.set({
                    num: val
                });
            }
        );
    else {
        res.set({ num: node.data.num });
    }
    return res;
})(combineLatest({})));


const node91 = seperate(((obs) => {
    let res = new ObservableVariable({ num: 0 });
    if (!silent)
        this.liveValues.get(node.id)?.subscribe(
            (val) => {
                res.set({
                    num: val
                });
            }
        );
    else {
        res.set({ num: node.data.num });
    }
    return res;
})(combineLatest({})));


const node97 = seperate(ggt(combineLatest({})));


const node92 = seperate(((obs) => {
    let res = new ObservableVariable({ num: 0 });
    let { num, num2 } = seperate(fromObservable(obs, { num: 0, num2: 0 }));
    if (!silent) {
        if (node.inputs.num.connections.length == 0 && this.liveValues.has(node.id)) {
            num = this.liveValues.get(node.id);
            console.log("Replace num");
        }
        if (node.inputs.num2.connections.length == 0 && this.liveValues2.has(node.id)) {
            num2 = this.liveValues2.get(node.id);
            console.log("Replace num2");
        }
        let { num_, num2_ } = { num_: num.get(), num2_: num2.get() };
        obs = fromObservable(combineLatest({ num, num2 }), { num: num_, num2: num2_ });
    }
    obs.subscribe(
        (val) => {
            res.set({
                num: val.num + val.num2
            });
        }
    );
    if (!silent) {
        res.subscribe(
            (val) => this.editor?.nodes.find((n) => n.id == node.id)?.controls.get("preview")?.setValue(val.num)
        );
    }
    return res;
})(combineLatest({})));

return {}
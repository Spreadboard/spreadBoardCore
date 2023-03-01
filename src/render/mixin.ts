import { Control, Input, Node as ReteNode, Output } from "rete";

export default {
    props: ['node', 'editor', 'bindSocket', 'bindControl'],
    methods: {
        inputs(): Input[] {
            //@ts-ignore
            return Array.from((this.node as Node).inputs.values());
        },
        outputs(): Output[] {
            //@ts-ignore
            return Array.from(this.node.outputs.values());
        },
        controls(): Control[] {
            //@ts-ignore
            return Array.from(this.node.controls.values());
        },
        selected(): string {
            //@ts-ignore
            return this.editor.selected.contains(this.node) ? 'selected' : '';
        }
    },
    directives: {
        socket: {
            beforeMount(el: HTMLElement, binding: any) {
                binding.instance.bindSocket(el, binding.arg, binding.value);
            },
            updated(el: HTMLElement, binding: any) {
                binding.instance.bindSocket(el, binding.arg, binding.value);
            }
        },
        control: {
            beforeMount(el: HTMLElement, binding: any) {
                if (!binding.value) return;
                binding.instance.bindControl(el, binding.value);
            }
        }
    }
};

<!-- Top Funtion Node -->
<template>
    <div class="binnode top-binnode" @click="divOnClick">
        <span v-show="!showInput" style="display: inline-block; width: 100%; height: 100%;">{{ sequence }}</span>
        <label v-show="showTopBuild" class="top-build-btn node-upper-btn" title="由真二叉树层次遍历序列构建, 逗号分隔. 自行保证序列合法性."
            @click.stop="emitTopBuild"><i>B</i></label>
        <label v-show="showTopInsert" class="top-insert-btn node-upper-btn" title="按次序插入"
            @click.stop="emitTopInsert"><i>I</i></label>
        <label v-show="showTopSearch" class="top-search-btn node-upper-btn" title="查找单个数值"
            @click.stop="emitTopSearch"><i>S</i></label>
        <label class="top-help-btn node-left-btn" title="help" @click.stop="emitTopHelp"><i>?</i></label>
        <label class="top-proper-btn node-upper-btn" title="生成真二叉序列" @click.stop="$emit('top-proper')"><i>P</i></label>
        <binnode-input ref="input" v-show="showInput" v-model="sequence" @blur="showInput=false"
            @keyup.enter.native="emitTopInsert">
        </binnode-input>
    </div>
</template>

<script>
    import BinnodeInput from "./binnode-input.vue";
    export default {
        props: ['data'],
        data() {
            return {
                sequence: this.data.toString(), showInput: false, helpInd: -1,
                helpMessages: ["B: 真二叉树构建, 逗号分隔. 例如 1,,2,,3 对应 {1: [null, 2: [null, 3]]}",
                    "I: (回车)输入序列依次插入, 逗号分隔. 上限为666..666(具体几个不告诉你)",
                    "S: 输入单个数值进行搜索",
                    "P: 生成真二叉树层次遍历序列(复制下来就可以随时重建啦)"]
            };
        },
        components: {
            'binnode-input': BinnodeInput
        },
        methods: {
            divOnClick() {
                if (this.showInput === true) return false;
                this.showInput = true;
                process.nextTick(() => {
                    this.$refs.input.forceFocus();
                })
            },
            emitTopBuild() {
                if (this.sequence === "") return false;
                let sequence = this.$parent.strToArr(this.sequence);
                if (!sequence || sequence[0] === null) {
                    alert("Empty Root!");
                    return false;
                }
                if (this.$parent.tree && this.$parent.tree.root())
                    if (!confirm("Overwrite current tree?")) return false;
                this.sequence = sequence.toString();
                this.$emit('top-build', sequence);
            },
            emitTopInsert() {
                let sequence = this.$parent.strToArr(this.sequence);
                if (!sequence || sequence.length === 0) return false;
                this.sequence = sequence.toString();
                this.$emit('top-insert', sequence);
            },
            emitTopSearch() {
                let num = this.$parent.assertNumber(this.sequence);
                if (num === null) return false;
                this.sequence = num.toString();
                this.$emit('top-search', num);
            },
            emitTopHelp() {
                this.helpInd = ++this.helpInd % this.helpMessages.length;
                let enableHelp = [this.showTopBuild, this.showTopInsert, this.showTopSearch, true]
                let failSafe = 0;
                while (!enableHelp[this.helpInd] && failSafe++ < 5) this.helpInd = ++this.helpInd % this.helpMessages.length; if
                    (enableHelp[this.helpInd]) this.$emit('top-help', this.helpMessages[this.helpInd]);
            }
        }, computed: {
            showTopSearch() { return this.$parent.curTreeType !== "BinTree"; }, showTopInsert() {
                return this.$parent.curTreeType !== "BinTree";
            }, showTopBuild() { return true; }
        },
        watch: {
            data() { this.sequence = this.data.toString(); }
        }
    }
</script>